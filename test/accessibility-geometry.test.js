import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, geometryIssues } from '../scripts/accessibility-geometry.js';

test('contrast calculation uses sRGB luminance, is symmetric, and rejects translucent inputs', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#ffffff', '#ffffff'), 1);
  assert.equal(contrastRatio('#123456', '#abcdef'), contrastRatio('#abcdef', '#123456'));
  assert.ok(contrastRatio('#767676', '#ffffff') >= 4.5);
  assert.ok(contrastRatio('#777777', '#ffffff') < 4.5);
  assert.throws(() => contrastRatio('rgba(0,0,0,.5)', '#ffffff'));
});

test('accessibility geometry catches overflow, overlapping cards and detached connectors', () => {
  const result = geometryIssues({ viewport: 320, scrollWidth: 500,
    cards: [{ left: 0, right: 200, top: 0, bottom: 100 },
      { left: 0, right: 200, top: 90, bottom: 190 }], markers: [{ y: 120 }] });
  assert.equal(result.length, 3);
  assert.match(result.join(' '), /overflow/);
  assert.match(result.join(' '), /overlap/);
  assert.match(result.join(' '), /misses/);
});

test('accessibility geometry allows alternating cards, edge connectors and subpixel rounding', () => {
  assert.deepEqual(geometryIssues({ viewport: 700, scrollWidth: 700.5,
    cards: [{ left: 0, right: 300, top: 0, bottom: 200 },
      { left: 400, right: 700, top: 100, bottom: 300 }], markers: [{ y: 0 }, { y: 300 }] }), []);
});
