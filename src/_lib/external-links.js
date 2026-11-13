import { parser } from "posthtml-parser";

const notice = "opens in a new tab";
const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// Apply to the outer website layout only. Preserve source markup, literal text,
// and feed content; visitors need no script or CSS for the warning or behavior.
export function externalLinks(html, siteUrl) {
  const origin = new URL(siteUrl).origin;
  return html.replace(/<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<a\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/a\s*>/gi,
    (match, literal, rawAttributes, content) => {
      if (literal || !/^<a\b/i.test(match)) return match;
      const attrs = parser(`<a${rawAttributes}></a>`, { decodeEntities: true })[0]?.attrs ?? {};
      let destination;
      try { destination = new URL(attrs.href, siteUrl); } catch { return match; }
      if (!attrs.href || !["http:", "https:"].includes(destination.protocol) || destination.origin === origin) return match;
      if (content.includes('data-new-tab=""')) return match;
      const rel = [...new Set((attrs.rel ?? "").split(/\s+/).filter(Boolean).concat("noopener"))].join(" ");
      // Replace only the attributes we manage, leaving URLs and other source
      // attributes untouched (including entities and download metadata).
      let opening = rawAttributes.replace(/\s+([^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g,
        (attribute, name) => ["target", "rel", "aria-label"].includes(name.toLowerCase()) ? "" : attribute);
      opening += ` target="_blank" rel="${escapeAttribute(rel)}"`;
      if (attrs["aria-label"]) opening += ` aria-label="${escapeAttribute(attrs["aria-label"] + " (" + notice + ")")}"`;
      return `<a${opening}>${content}<span class="sr-only" data-new-tab=""> (${notice})</span></a>`;
    });
}
