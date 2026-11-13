import { parser } from 'posthtml-parser';
const elements = nodes => nodes.flatMap(n => typeof n === 'object' ? [n, ...elements(n.content ?? [])] : []);
const text = nodes => nodes.map(n => typeof n === 'string' ? n : text(n.content ?? [])).join('');
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// Applied only by the outer page layout. Markdown, entry content and RSS are untouched.
export function readingLayout(content) {
  const nodes = elements(parser(content, {decodeEntities:true}));
  const ids = new Set(nodes.map(n => n.attrs?.id).filter(Boolean));
  const chapters = [];
  // Skip comments and literal-text elements; retain source markup byte-for-byte
  // except the missing heading IDs needed for native chapter links.
  const html = content.replace(/<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1>|<h2((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/h2>/gi, (match, raw, attrs) => {
    if (raw || !/^<h2\b/i.test(match)) return match;
    const heading = parser(match, {decodeEntities:true})[0];
    const title = text(heading.content ?? []).replace(/\s+/g,' ').trim();
    if (!title) return match;
    let id = heading.attrs?.id;
    if (!id) {
      const stem = 'chapter-' + (title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'section');
      id = stem; let suffix = 2;
      while(ids.has(id)) id = `${stem}-${suffix++}`;
      ids.add(id);
    }
    chapters.push({id, href:'#'+encodeURIComponent(id), title});
    return heading.attrs?.id ? match : match.replace(/^<h2/i, `<h2 id="${escape(id)}"`);
  });
  return {html, chapters:chapters.length > 1 ? chapters : []};
}
