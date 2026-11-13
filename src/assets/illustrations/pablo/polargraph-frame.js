// The embedded document reports its height; only accept its own window and origin.
const frame = document.querySelector('.polargraph-embed iframe');
if (frame) {
  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type !== 'pablo-height') return;
    const height = event.data.height;
    if (Number.isFinite(height) && height >= 200 && height <= 6000) {
      frame.height = `${Math.ceil(height) + 2}`;
      frame.style.height = `${Math.ceil(height) + 2}px`;
    }
  });
  frame.addEventListener('load', () => {
    frame.contentWindow.postMessage({ type: 'pablo-measure' }, location.origin);
  });
}
