// Feeds carry the same explanation and downloads with a noninteractive figure.
// The site-only frame controller remains in the page layout, outside entry.content.
export function polargraphFeedFallback(content) {
  return String(content).replace(/<iframe\b[^>]*\bsrc="\/assets\/drafts\/pablo\/polargraph\.html"[^>]*><\/iframe>/g,
    '<img src="/assets/drafts/pablo/pablo.png" width="900" height="1220" alt="Illustration of Pablo, showing the two chains, pen holder and counterweights on its easel.">');
}
