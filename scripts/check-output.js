import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parser } from "posthtml-parser";
import parseSrcset from "parse-srcset";

function elements(tree) {
  return tree.flatMap((node) => typeof node === "object"
    ? [node, ...elements(node.content ?? [])] : []);
}
function textContent(node) {
  return (node.content ?? []).map((child) => typeof child === "string" ? child : textContent(child)).join("");
}

// Offline structural checks, not an HTML validator or browser accessibility audit.
export async function checkOutput(directory, siteUrl) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const files = new Set(entries.filter((entry) => entry.isFile()).map((entry) =>
    path.relative(directory, path.join(entry.parentPath, entry.name)).split(path.sep).join("/")));
  const pages = new Map();
  const errors = [];
  const fail = (file, message) => errors.push(`${file}: ${message}`);
  for (const file of [...files].filter((file) => /\.html?$/i.test(file)).sort()) {
    // Attribute values must match the DOM, including entity-encoded URLs and IDs.
    const nodes = elements(parser(await readFile(path.join(directory, file), "utf8"), {
      decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true
    }));
    const ids = new Set();
    const targets = new Set();
    for (const node of nodes) {
      const attrs = node.attrs ?? {};
      if (Object.hasOwn(attrs, "id")) {
        if (ids.has(attrs.id)) fail(file, `duplicate id ${JSON.stringify(attrs.id)}`);
        ids.add(attrs.id);
        targets.add(attrs.id);
      }
      if (node.tag === "a" && attrs.name) targets.add(attrs.name);
    }
    pages.set(file, { nodes, targets });
  }
  if (!pages.size) errors.push("output: no HTML pages found");
  const origin = new URL(siteUrl).origin;
  function resolve(file, reference) {
    let url;
    try { url = new URL(reference, new URL(`/${file}`, origin)); }
    catch { fail(file, `invalid URL ${JSON.stringify(reference)}`); return; }
    if (url.origin !== origin || !["http:", "https:"].includes(url.protocol)) return;
    let target, fragment;
    try {
      target = decodeURIComponent(url.pathname).slice(1);
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch { fail(file, `invalid URL encoding ${JSON.stringify(reference)}`); return; }
    if (target.split("/").includes("..") || target.includes("\\")) {
      fail(file, `unsafe local path ${JSON.stringify(reference)}`); return;
    }
    if (!files.has(target)) target = `${target.replace(/\/$/, "")}${target ? "/" : ""}index.html`;
    if (!files.has(target)) { fail(file, `missing local target ${JSON.stringify(reference)}`); return; }
    // XML feeds and binary resources are existence-checked, not parsed as HTML.
    if (fragment && pages.has(target) && !pages.get(target).targets.has(fragment) && fragment.toLowerCase() !== "top") {
      fail(file, `missing fragment ${JSON.stringify(reference)} in ${target}`);
    }
    return { target, fragment };
  }
  for (const [file, { nodes }] of pages) {
    const select = (tag) => nodes.filter((node) => node.tag === tag);
    const one = (items, predicate, label) => {
      if (items.length !== 1 || !predicate(items[0])) fail(file, `requires ${label}`);
    };
    one(select("html"), (node) => Boolean(node.attrs?.lang?.trim()), "one document language");
    one(select("head").flatMap((head) => elements(head.content ?? [])).filter((node) => node.tag === "title"), (node) => Boolean(textContent(node).trim()), "one non-empty title");
    const headNodes = select("head").flatMap((head) => elements(head.content ?? []));
    const meta = headNodes.filter((node) => node.tag === "meta");
    one(meta.filter((node) => node.attrs?.name?.toLowerCase() === "description"),
      (node) => Boolean(node.attrs.content?.trim()), "one non-empty description");
    one(meta.filter((node) => Object.hasOwn(node.attrs ?? {}, "charset")),
      (node) => node.attrs.charset.toLowerCase() === "utf-8", "one UTF-8 charset");
    one(meta.filter((node) => node.attrs?.name?.toLowerCase() === "viewport"),
      (node) => /(?:^|,)\s*width\s*=\s*device-width\s*(?:,|$)/i.test(node.attrs.content ?? "") &&
        /(?:^|,)\s*initial-scale\s*=\s*1(?:\.0)?\s*(?:,|$)/i.test(node.attrs.content ?? ""), "one responsive viewport");
    const mains = nodes.filter((node) => node.tag === "main" || node.attrs?.role === "main");
    one(mains, () => true, "one main landmark");
    if (select("base").length) fail(file, "base elements are unsupported; use site-relative URLs");
    const skips = select("a").filter((node) => node.attrs?.class?.split(/\s+/).includes("skip-link"));
    if (!skips.some((node) => {
      const href = node.attrs?.href;
      if (!href?.startsWith("#") || href === "#") return false;
      try { return mains.some((main) => main.attrs?.id === decodeURIComponent(href.slice(1))); }
      catch { return false; }
    })) fail(file, "requires a skip-link to the main landmark");
    for (const node of nodes) {
      const attrs = node.attrs ?? {};
      for (const attribute of ["href", "src", "poster", "data"]) {
        if (Object.hasOwn(attrs, attribute) && (attribute !== "data" || node.tag === "object")) resolve(file, attrs[attribute]);
      }
      for (const attribute of ["srcset", "imagesrcset"]) {
        if (attrs[attribute]) for (const candidate of parseSrcset(attrs[attribute])) resolve(file, candidate.url);
      }
    }
  }
  return { pages: pages.size, errors };
}
