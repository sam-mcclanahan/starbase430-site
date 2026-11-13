import { createHash } from "node:crypto";
import { reviewedEmbeds } from "./reviewed-embeds.js";
import { readFile, readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { parser } from "posthtml-parser";

export const WARNING_BYTES = 100_000;
export const MAX_BYTES = 512_000;
export const budgetStatus = (bytes) => bytes > MAX_BYTES ? "FAIL" : bytes > WARNING_BYTES ? "WARN" : "PASS";

// Bounded CSS token scanner, not a general CSS validator. Consume strings,
// comments and URL tokens in their own contexts; never rewrite the source.
// In particular, /* is literal inside an unquoted URL token, and @import is
// literal inside a string. Unsupported dependency syntax fails closed.
function cssReferences(source) {
  const references = [];
  let index = 0;
  const whitespace = (character) => character !== undefined && /[\t\n\f\r ]/.test(character);
  const identifier = () => {
    const start = index;
    while (index < source.length && /[\w-]/.test(source[index])) index++;
    return source.slice(start, index).toLowerCase();
  };
  const skipTrivia = () => {
    while (index < source.length) {
      if (whitespace(source[index])) index++;
      else if (source.startsWith("/*", index)) {
        const end = source.indexOf("*/", index + 2);
        if (end === -1) throw new Error("Unterminated CSS comment");
        index = end + 2;
      } else break;
    }
  };
  const string = () => {
    const quote = source[index++];
    const start = index;
    while (index < source.length && source[index] !== quote) {
      if (/[\n\r\f]/.test(source[index])) throw new Error("Unsupported CSS string newline");
      index++;
    }
    if (index === source.length) throw new Error("Unterminated CSS string");
    return source.slice(start, index++);
  };
  const url = () => {
    // Called immediately after the url identifier. Comments here are not
    // stripped: URL contents have their own tokenization rules.
    if (source[index++] !== "(") throw new Error("Unsupported CSS URL");
    while (whitespace(source[index])) index++;
    let value;
    if (source[index] === '"' || source[index] === "'") value = string();
    else {
      const start = index;
      while (index < source.length && source[index] !== ")" && !whitespace(source[index])) {
        if (/[('"\x00-\x08\x0b\x0e-\x1f\x7f]/.test(source[index])) throw new Error("Unsupported CSS URL");
        index++;
      }
      value = source.slice(start, index);
    }
    while (whitespace(source[index])) index++;
    if (source[index++] !== ")") throw new Error("Unsupported CSS URL");
    return value;
  };

  // Escapes can change token boundaries and identifiers; outside this subset.
  if (source.includes("\\")) throw new Error("Unsupported CSS resource syntax");
  while (index < source.length) {
    skipTrivia();
    if (index === source.length) break;
    if (source[index] === '"' || source[index] === "'") {
      string();
    } else if (source[index] === "@") {
      index++;
      if (identifier() !== "import") continue;
      skipTrivia();
      let reference;
      if (source[index] === '"' || source[index] === "'") reference = string();
      else if (identifier() === "url") reference = url();
      else throw new Error("Unsupported CSS import");
      references.push({ reference, kind: "css" });
      // Scan the remaining media/layer condition normally. Never consume
      // through a semicolon that could belong to a later resource rule.
    } else if (/[\w-]/.test(source[index])) {
      const name = identifier();
      if (name === "url" && source[index] === "(") references.push({ reference: url(), kind: "asset" });
      else if (["image", "image-set", "-webkit-image-set", "src"].includes(name) && source[index] === "(") {
        throw new Error("Unsupported CSS resource syntax");
      }
    } else index++;
  }
  return references;
}

// Deliberately bounded static accounting. Unknown dependency mechanisms fail
// closed rather than claiming that their bytes were completely measured.
export async function pageBudget(root, page) {
  root = await realpath(root);
  const resources = new Map();
  const inspected = new Set();
  const issues = new Set();
  const downloads = new Set();
  const issue = (message) => issues.add(message);

  async function resource(reference, owner, kind = "asset") {
    if (!reference) { issue(`Empty resource reference in ${owner}`); return; }
    if (reference.startsWith("#")) return;
    if (/^data:/i.test(reference)) {
      // Raster data bytes are already included in the containing document.
      if (!/^data:image\/(?:png|jpeg|gif|webp|avif);base64,/i.test(reference)) issue(`Unsupported embedded resource in ${owner}`);
      return;
    }
    if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(reference)) {
      issue(`External or unsupported resource: ${reference} in ${owner}`);
      return;
    }
    let target;
    try {
      const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
      if (pathname.includes("\\") || pathname.includes("\0")) throw new Error();
      target = path.resolve(root, pathname.startsWith("/") ? `.${pathname}` : path.join(path.dirname(owner), pathname));
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      target = await realpath(target);
      if (!target.startsWith(root + path.sep)) throw new Error();
    } catch {
      issue(`Missing or unsafe resource: ${reference} in ${owner}`);
      return;
    }
    const relative = path.relative(root, target);
    const inspection = `${relative}:${kind === "html" ? "html" : kind === "css" || /\.css$/i.test(relative) ? "css" : "asset"}`;
    if (inspected.has(inspection)) return;
    inspected.add(inspection);
    const bytes = await readFile(target);
    resources.set(relative, bytes.length);
    const reviewed = reviewedEmbeds[relative] === createHash("sha256").update(bytes).digest("hex");
    if (reviewedEmbeds[relative] && !reviewed) issue(`Reviewed embed changed; re-review dependencies: ${relative}`);
    if (kind === "html") await html(bytes.toString(), relative, reviewed);
    else if (kind === "css" || /\.css$/i.test(relative)) await css(bytes.toString(), relative);
    else if (!reviewed && /\.(?:js|mjs|svg|html?)$/i.test(relative)) issue(`Unsupported nested dependencies: ${relative}`);
  }

  async function css(source, owner) {
    try {
      for (const { reference, kind } of cssReferences(source)) {
        await resource(reference, owner, kind);
      }
    } catch (error) {
      issue(`${error.message} in ${owner}`);
    }
  }

  async function srcset(value, owner) {
    // Include every candidate and fallback, even across picture formats/media.
    // Commas in URLs/data URLs require a fuller grammar; do not undercount them.
    if (/data:|[()]/i.test(value)) { issue(`Unsupported srcset in ${owner}`); return; }
    // The HTML parser collects URL tokens through non-ASCII-whitespace,
    // including internal commas. Only split our supported explicit-descriptor
    // lists after proving that no comma belongs to a URL token.
    // https://html.spec.whatwg.org/multipage/images.html#parse-a-srcset-attribute
    const explicitCandidate = String.raw`[^,\s]+[\t\n\f\r ]+(?:\d+w|(?:\d*\.)?\d+x)`;
    const explicitList = new RegExp(`^[\\t\\n\\f\\r ]*${explicitCandidate}(?:[\\t\\n\\f\\r ]*,[\\t\\n\\f\\r ]*${explicitCandidate})*[\\t\\n\\f\\r ]*$`);
    if (value.includes(",") && !explicitList.test(value)) {
      issue(`Unsupported srcset: ambiguous comma or missing explicit descriptor in ${owner}`);
      return;
    }
    for (const candidate of value.split(",")) {
      const match = /^\s*(\S+)(?:\s+(?:\d+w|(?:\d*\.)?\d+x))?\s*$/.exec(candidate);
      if (!match) issue(`Unsupported srcset candidate in ${owner}: ${candidate}`);
      else await resource(match[1], owner);
    }
  }

  async function html(source, owner, reviewed = false) {
    // Browsers accept --!> as a comment terminator, but the locked parser
    // can consume subsequent resource tags as comment text. Reject before
    // parsing rather than trusting a potentially incomplete dependency tree.
    if (source.includes("--!>")) issue(`Unsupported HTML comment ending in ${owner}`);
    async function walk(nodes) {
      for (const node of nodes) {
        if (typeof node !== "object") continue;
        const tag = node.tag.toLowerCase();
        const attrs = Object.fromEntries(Object.entries(node.attrs ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
        const pabloFrame = tag === "iframe" && attrs.src === "/assets/illustrations/pablo/polargraph.html" && !Object.hasOwn(attrs, "srcdoc");
        const reviewedController = tag === "script" && attrs.src === "/assets/illustrations/pablo/polargraph-frame.js";
        const reviewedInline = reviewed && ["svg", "script"].includes(tag) && !attrs.src;
        if (["base", "iframe", "object", "embed", "svg", "script"].includes(tag) && !pabloFrame && !reviewedController && !reviewedInline) issue(`Unsupported <${tag}> dependencies in ${owner}`);
        if (attrs.style) await css(attrs.style, owner);
        if (tag === "style") await css((node.content ?? []).join(""), owner);
        for (const key of ["src", "poster", "background"]) {
          if (Object.hasOwn(attrs, key)) await resource(attrs[key], owner, pabloFrame && key === "src" ? "html" : "asset");
        }
        for (const key of ["srcset", "imagesrcset"]) if (attrs[key]) await srcset(attrs[key], owner);
        if (tag === "link") {
          const rel = (attrs.rel ?? "").toLowerCase().split(/\s+/);
          if (rel.some((r) => ["stylesheet", "icon", "apple-touch-icon", "preload", "modulepreload"].includes(r))) {
            await resource(attrs.href, owner, rel.includes("stylesheet") ? "css" : "asset");
          } else if (!rel.every((r) => ["alternate", "canonical", "author", "license", "next", "prev"].includes(r))) {
            issue(`Unsupported link relation: ${attrs.rel ?? "(none)"} in ${owner}`);
          }
        }
        if ((tag === "a" || tag === "area") && attrs.href && (Object.hasOwn(attrs, "download") || /\.[a-z0-9]+(?:[?#]|$)/i.test(attrs.href) && !/\.html?(?:[?#]|$)/i.test(attrs.href))) downloads.add(attrs.href);
        if (Object.keys(attrs).some((key) => /^on/i.test(key))) issue(`Unsupported event handler in ${owner}`);
        if (tag === "meta" && /refresh/i.test(attrs["http-equiv"] ?? "")) issue(`Unsupported refresh in ${owner}`);
        if (node.content && !["style", "script"].includes(tag)) await walk(node.content);
      }
    }
    await walk(parser(source, { lowerCaseTags: true, lowerCaseAttributeNames: true, decodeEntities: true }));
  }

  await resource(`/${page}`, page, "html");
  const bytes = [...resources.values()].reduce((sum, size) => sum + size, 0);
  return { page, bytes, status: issues.size ? "FAIL" : budgetStatus(bytes), resources: Object.fromEntries(resources), downloads: [...downloads].sort(), issues: [...issues].sort() };
}

export async function siteBudgets(root) {
  const pages = (await readdir(root, { recursive: true })).filter((file) => file.endsWith(".html")).sort();
  if (!pages.length) throw new Error("No HTML pages found; refusing an empty budget report.");
  return Promise.all(pages.map((page) => pageBudget(root, page)));
}
