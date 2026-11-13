// XML 1.0 fifth edition Char production, including supplementary Unicode.
const forbiddenXmlCharacter = /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/u;

export function validateXml(value, context = "RSS text") {
  const text = String(value);
  const match = forbiddenXmlCharacter.exec(text);
  if (match) {
    const code = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
    // Identify the problem without echoing unpublished text or contact details.
    throw new Error(`${context}: XML 1.0 forbids U+${code} at UTF-16 offset ${match.index}.`);
  }
  return text;
}

export function escapeXml(value) {
  return validateXml(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function safeCdata(value) {
  return validateXml(value, "RSS entry content").replaceAll("]]>", "]]]]><![CDATA[>");
}
