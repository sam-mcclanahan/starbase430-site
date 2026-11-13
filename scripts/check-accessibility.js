import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio, geometryIssues } from './accessibility-geometry.js';

const repository = fileURLToPath(new URL('../', import.meta.url));
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(repository, '.cache/a11y-browsers');
const { chromium, expect } = await import('@playwright/test');
const { default: AxeBuilder } = await import('@axe-core/playwright');
const reports = path.join(repository, '.a11y');
const temporary = await mkdtemp(path.join(tmpdir(), 'starbase430-a11y-'));
const report = { checkedAt: new Date().toISOString(), browser: '',
  coverage: 'Automated checks, not WCAG certification or a screen-reader usability audit.',
  scans: [], checks: [], failures: [], incomplete: [], blockedRequests: [] };
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.avif': 'image/avif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml' };
let server, browser;

async function run(name, page, action) {
  try { await action(); report.checks.push(name); }
  catch (error) {
    const screenshot = `failure-${report.failures.length + 1}.png`;
    await page?.screenshot({ path: path.join(reports, screenshot), fullPage: false }).catch(() => {});
    report.failures.push({ name, message: error.message, details: error.actual, screenshot });
    console.error(`FAIL: ${name}: ${JSON.stringify(error.actual ?? error.message).slice(0, 700)}`);
  }
}

async function scan(page, name) {
  const result = await new AxeBuilder({ page }).withTags([
    'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'
  ]).analyze();
  report.scans.push(name);
  for (const item of result.incomplete) report.incomplete.push({ name, rule: item.id,
    help: item.help, helpUrl: item.helpUrl, targets: item.nodes.map(n => n.target),
    reasons: item.nodes.map(n => ({ target: n.target, checks: [...n.any, ...n.all, ...n.none].map(c => c.message) })) });
  assert.deepEqual(result.violations.map(v => ({ rule: v.id, help: v.help,
    targets: v.nodes.map(n => n.target), helpUrl: v.helpUrl })), [], 'axe violations');
}

async function layout(page) {
  const geometry = await page.evaluate(() => {
    const elements = [...document.querySelectorAll('.science-event')];
    return { viewport: document.documentElement.clientWidth,
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      cards: elements.map(e => { const r = e.querySelector('.science-card').getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; }),
      markers: elements.map(e => ({ y: e.getBoundingClientRect().top + parseFloat(getComputedStyle(e, '::after').top) })) };
  });
  assert.deepEqual(geometryIssues(geometry), []);
}

async function keyboard(page) {
  // Every document has the shared/native skip-link pattern. Inspect real focus,
  // not programmatic focus alone, and activate it with the keyboard.
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip-link').first();
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  const focus = await skip.evaluate(e => {
    const s = getComputedStyle(e), r = e.getBoundingClientRect();
    return { visible: r.top >= -1 && r.bottom <= innerHeight + 1,
      outlined: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 };
  });
  assert.ok(focus.visible && focus.outlined, 'skip link needs visible on-screen focus');
  await page.keyboard.press('Enter');
  const href = await skip.getAttribute('href');
  await expect(page.locator(href)).toBeFocused();
}

try {
  await mkdir(reports, { recursive: true });
  // Clear only this suite's old artifacts: a fresh result must not include stale failures.
  for (const file of await readdir(reports)) if (/^(report\.json|summary\.txt|failure-\d+\.png)$/.test(file)) await rm(path.join(reports, file));
  const outputs = {};
  for (const [mode, runMode] of [['production', 'build'], ['preview', 'watch']]) {
    outputs[mode] = path.join(temporary, mode);
    execFileSync(process.execPath, ['--input-type=module', '-e', `
      import Eleventy from '@11ty/eleventy';
      await new Eleventy('src', ${JSON.stringify(outputs[mode])},
        {source:'cli',runMode:${JSON.stringify(runMode)},quietMode:true}).write();
    `], { cwd: repository, timeout: 30_000, stdio: 'pipe' });
  }
  server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname === '/__broken-fixture') {
        response.setHeader('Content-Type', types['.html']);
        response.end('<!doctype html><html lang="en"><title>Negative test</title><main><h1>Fixture</h1><button></button><div style="width:2000px">Overflow</div></main></html>'); return;
      }
      const match = url.pathname.match(/^\/(production|preview)\/(.*)$/);
      if (!match) { response.writeHead(404).end(); return; }
      const root = outputs[match[1]];
      let target = path.resolve(root, decodeURIComponent(match[2]));
      if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      response.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
      response.end(await readFile(target));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  report.browser = `Chromium ${browser.version()}`;
  // Site-relative resources must resolve within the currently tested build.
  // Never send private drafts or load third-party pages during testing.
  let activeMode = "preview";
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route('**/*', async route => {
    const request = new URL(route.request().url());
    if (request.origin !== origin) { report.blockedRequests.push(request.origin); await route.abort(); return; }
    const referer = route.request().headers().referer;
    if (!/^\/(production|preview)\//.test(request.pathname) && request.pathname !== '/__broken-fixture') {
      const mode = (referer && new URL(referer).pathname.match(/^\/(production|preview)\//)?.[1]) || activeMode;
      if (mode) { await route.continue({ url: `${origin}/${mode}${request.pathname}${request.search}` }); return; }
    }
    await route.continue();
  });
  const page = await context.newPage();
  await run('negative fixtures prove axe and overflow checks detect failures', page, async () => {
    await page.goto(`${origin}/__broken-fixture`);
    const result = await new AxeBuilder({ page }).analyze();
    assert.ok(result.violations.some(v => v.id === 'button-name'));
    await assert.rejects(() => layout(page));
  });
  await run('shared opaque palette contrast pairs', page, async () => {
    await page.goto(`${origin}/preview/`);
    const colors = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return Object.fromEntries(['text', 'muted', 'silver', 'green', 'bright', 'accent', 'focus', 'space', 'panel', 'deep']
        .map(key => [key, s.getPropertyValue(`--${key}`).trim()]));
    });
    for (const [foreground, background] of [['text', 'panel'], ['muted', 'panel'], ['silver', 'panel'],
      ['green', 'panel'], ['bright', 'panel'], ['accent', 'panel'], ['text', 'deep'], ['silver', 'deep']]) {
      const ratio = contrastRatio(colors[foreground], colors[background]);
      assert.ok(ratio >= 4.5, `${foreground}/${background} contrast ${ratio.toFixed(2)} < 4.5`);
    }
    assert.ok(contrastRatio(colors.focus, colors.space) >= 3);
  });
  for (const [mode, output] of Object.entries(outputs)) {
    activeMode = mode;
    const files = (await readdir(output, { recursive: true })).filter(f => f.endsWith('.html')).sort();
    assert.ok(files.includes('index.html'), `${mode}: missing home page`);
    for (const file of files) {
      const url = `${origin}/${mode}/${file}`;
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(url);
      await run(`${mode}/${file}: keyboard skip link`, page, () => keyboard(page));
      await run(`${mode}/${file}: desktop scan`, page, () => scan(page, `${mode}/${file}: desktop`));
      await run(`${mode}/${file}: desktop layout`, page, () => layout(page));
      const details = page.locator('details > summary');
      if (await details.count()) {
        await run(`${mode}/${file}: keyboard disclosure and expanded scan`, page, async () => {
          for (const summary of await details.all()) {
            await summary.focus(); await page.keyboard.press('Enter');
            assert.equal(await summary.evaluate(e => e.parentElement.open), true);
          }
          await scan(page, `${mode}/${file}: expanded`);
        });
      }
      await page.setViewportSize({ width: 320, height: 900 });
      await run(`${mode}/${file}: narrow scan`, page, () => scan(page, `${mode}/${file}: narrow`));
      await run(`${mode}/${file}: narrow layout`, page, () => layout(page));
      await run(`${mode}/${file}: increased text spacing at 320px`, page, async () => {
        const sheet = await page.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
        try { await layout(page); } finally { await sheet.evaluate(e => e.remove()); }
      });
    }
  }
  activeMode = "preview";
  // Representative shared patterns are tested in fallback modes, including draft-only FSE.
  for (const file of ['index.html', 'about/index.html', 'log/pablo-the-polargraph/index.html',
    'log/first-step-epoch/index.html', 'log/pablo-the-polargraph/interactive/index.html']) {
    await run(`preview/${file}: CSS off, content order and navigation`, page, async () => {
      await page.goto(`${origin}/preview/${file}`);
      const before = await page.locator('main h1, main h2, main h3').allTextContents();
      await page.evaluate(() => { for (const sheet of document.styleSheets) sheet.disabled = true; });
      assert.deepEqual(await page.locator('main h1, main h2, main h3').allTextContents(), before);
      await expect(page.locator('main h1')).toBeVisible();
      for (const heading of await page.locator('main h2, main h3').all()) await expect(heading).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
    });
  }
  await run('FSE: timeline breakpoint geometry and chronological order', page, async () => {
    await page.goto(`${origin}/preview/log/first-step-epoch/`);
    for (const width of [1104, 1110, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await layout(page);
      const positions = await page.locator('.science-card').evaluateAll(es => es.map(e => e.getBoundingClientRect().top));
      assert.ok(positions.slice(2).every((top, i) => top > positions[i]), `same-side order at ${width}`);
    }
  });
  const pabloUrl = `${origin}/preview/log/pablo-the-polargraph/interactive/`;
  await run('Pablo: keyboard controls, live readouts, clear, reset and live reduced motion', page, async () => {
    await page.setViewportSize({ width: 1100, height: 900 }); await page.goto(pabloUrl);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const frame = page.frameLocator('iframe');
    const board = frame.getByRole('group', { name: 'Interactive polargraph drawing board' });
    const x = frame.locator('#x');
    await board.focus(); await board.press('ArrowRight');
    await expect(x).toHaveValue('340');
    const first = Number(await x.inputValue());
    await board.press('Shift+ArrowRight');
    await expect(x).toHaveValue(String(first + 20));
    await x.focus(); const prior = await x.inputValue(); await x.press('ArrowLeft');
    await expect.poll(() => x.inputValue()).not.toBe(prior);
    assert.match(await x.getAttribute('aria-valuetext'), /millimetres/);
    const y = frame.locator('#y'); await y.focus(); const previousY = await y.inputValue(); await y.press('ArrowDown');
    await expect.poll(() => y.inputValue()).not.toBe(previousY);
    assert.match(await y.getAttribute('aria-valuetext'), /millimetres/);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await frame.locator('#play').focus(); await page.keyboard.press('Enter');
    await expect(frame.locator('#status')).toContainText('Drawing Tesla');
    const drawingPosition=await frame.locator('#position').textContent();
    await expect.poll(() => frame.locator('#position').textContent()).not.toBe(drawingPosition);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(frame.locator('#status')).toContainText('reduced motion');
    await frame.locator('#clear').focus(); await page.keyboard.press('Enter');
    await expect(frame.locator('#status')).toHaveText('Paper cleared');
    await frame.locator('#reset').click(); await expect(x).toHaveValue('335');
    await frame.locator('#play').click(); await expect(frame.locator('#status')).toContainText('reduced motion');
    await frame.locator('#reset').focus(); await frame.locator('#reset').press('Tab');
    await expect(x).toBeFocused();
    await y.focus(); await y.press('Tab');
    await expect(page.getByRole('link', { name: 'View the static illustration', exact: true })).toBeFocused();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
  await run('JavaScript off: article, explanation, static alternative and return path', page, async () => {
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    // Use the same routing and privacy rules for this context.
    await noJs.route('**/*', async route => {
      const u = new URL(route.request().url());
      if (u.origin !== origin) { await route.abort(); return; }
      if (!u.pathname.startsWith('/preview/')) { await route.continue({ url: `${origin}/preview${u.pathname}${u.search}` }); return; }
      await route.continue();
    });
    try {
      const fallback = await noJs.newPage(); await fallback.goto(pabloUrl);
      await expect(fallback.getByRole('heading', { name: 'How Pablo works', exact: true })).toBeVisible();
      await expect(fallback.getByRole('heading', { name: 'What the simulation shows', exact: true })).toBeVisible();
      const staticLink = fallback.getByRole('link', { name: 'View the static illustration', exact: true });
      assert.ok(await staticLink.count());
      await expect(fallback.frameLocator('iframe').getByRole('img', { name: 'Illustration of Pablo on a wooden easel', exact: false })).toBeVisible();
      await fallback.getByRole('link', { name: 'Back to the Pablo retrospective', exact: true }).first().click();
      await expect(fallback.locator('main h1')).toContainText('Pablo');
      await fallback.goto(`${origin}/preview/log/first-step-epoch/`);
      await fallback.locator('summary').click();
      assert.equal(await fallback.locator('details').evaluate(e => e.open), true);
      await expect(fallback.locator('.science-card')).toHaveCount(20);
    } finally { await noJs.close(); }
  });
  await context.close();
} catch (error) {
  report.failures.push({ name: 'suite setup', message: error.message });
  console.error(error.message);
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
  report.blockedRequests = [...new Set(report.blockedRequests)];
  await mkdir(reports, { recursive: true });
  await writeFile(path.join(reports, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  const summary = `${report.browser || 'Browser unavailable'}\n${report.checks.length} checks passed; ${report.scans.length} axe scans; ${report.failures.length} failures; ${report.incomplete.length} inconclusive scan findings.\n${report.coverage}\nSee .a11y/report.json and failure screenshots.\n`;
  await writeFile(path.join(reports, 'summary.txt'), summary);
  console.log(summary);
  process.exitCode = report.failures.length ? 1 : 0;
}
