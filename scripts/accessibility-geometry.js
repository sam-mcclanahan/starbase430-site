// Geometry assertions complement axe: a valid accessible name does not prevent clipping.
export function contrastRatio(first, second) {
  const luminance = hex => {
    if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error('Expected an opaque six-digit sRGB color');
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

export function geometryIssues({ viewport, scrollWidth, cards = [], markers = [] }) {
  const issues = [];
  if (scrollWidth > viewport + 1) issues.push(`horizontal overflow: ${scrollWidth} > ${viewport}`);
  for (let i = 0; i < cards.length; i++) {
    const a = cards[i];
    if (a.left < -1 || a.right > viewport + 1) issues.push(`card ${i + 1} outside viewport`);
    for (let j = i + 1; j < cards.length; j++) {
      const b = cards[j];
      if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
        issues.push(`cards ${i + 1} and ${j + 1} overlap`);
      }
    }
    const marker = markers[i];
    if (marker && (marker.y < a.top - 1 || marker.y > a.bottom + 1)) {
      issues.push(`connector ${i + 1} misses its card`);
    }
  }
  return issues;
}
