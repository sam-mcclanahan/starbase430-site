import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { parser } from "posthtml-parser";

const asset = (name) => new URL(`../src/assets/illustrations/pablo/${name}`, import.meta.url);
const html = readFileSync(asset("polargraph.html"), "utf8");

// Exercise the actual imported controller without a browser dependency.
function simulation(reduce = false) {
  const elements = new Map();
  const heightReports = [];
  const intersections = [];
  function element(name) {
    if (!elements.has(name)) elements.set(name, {
      value: "", textContent: "", innerHTML: "", dataset: {}, attributes: {}, events: {},
      hidden: true, classList: { add() {}, remove() {} },
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(key, fn) { (this.events[key] ??= []).push(fn); },
      focus() {}, setPointerCapture() {}, getBoundingClientRect() { return { height: 900, bottom: 950 }; },
      querySelector(selector) { return element(selector); }
    });
    return elements.get(name);
  }
  element("svg").getScreenCTM = () => ({ inverse() { return {}; } });
  const frames = new Map();
  let id = 0, now = 0;
  const media = { matches: reduce, addEventListener() {} };
  const context = vm.createContext({
    document: { querySelector: element, hidden: false, addEventListener() {} },
    matchMedia: () => media,
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
    cancelAnimationFrame(key) { frames.delete(key); },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; }
      observe(target) { intersections.push({ target, callback: this.callback }); }
    },
    ResizeObserver: class { observe() {} },
    DOMPoint: class { constructor(x, y) { this.x = x; this.y = y; } matrixTransform() { return this; } },
    parent: { postMessage(message) { heightReports.push(message); } }, location: { origin: "http://localhost" }, window: { scrollY: 0, addEventListener() {} }
  });
  vm.runInContext(html.match(/<script type="module">([\s\S]*?)<\/script>/)[1], context);
  return {
    element,
    heightReports,
    intersections,
    fire(name, event, data = {}) {
      for (const handler of element(name).events[event] ?? []) handler({ preventDefault() {}, ...data });
    },
    step(count = 1) {
      for (let index = 0; index < count; index++) {
        now += 16;
        const pending = [...frames.values()]; frames.clear();
        for (const fn of pending) fn(now);
      }
    },
    get pending() { return frames.size; },
    inspect(expression) { return JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context)); },
    point(x, y) { return vm.runInContext(`q(${x},${y})`, context); }
  };
}

test("Pablo controls update pen, chains and counterweights with keyboard and dragging", () => {
  const sim = simulation();
  const stage = sim.element(".iso-stage");
  const before = sim.element("#weightL").attributes.transform;
  sim.fire(".iso-stage", "keydown", { key: "ArrowRight" }); sim.step(80);
  assert.equal(stage.dataset.x, 340);
  assert.notEqual(sim.element("#weightL").attributes.transform, before);
  assert.match(sim.element("#left").innerHTML, /mm/);
  sim.fire(".iso-stage", "keydown", { key: "ArrowDown", shiftKey: true }); sim.step(80);
  assert.equal(stage.dataset.y, 450);
  const [clientX, clientY] = sim.point(400, 500);
  sim.fire(".iso-stage", "pointerdown", { clientX, clientY, pointerId: 1, button: 0, pointerType: "mouse" });
  sim.step(80); sim.fire(".iso-stage", "pointerup");
  assert.ok(Math.abs(stage.dataset.x - 400) < 0.1);
  assert.ok(Math.abs(stage.dataset.y - 500) < 0.1);
  assert.ok(sim.element("#ink").attributes.d.length > 0);
});

test("drawing is explicit, can pause/resume, clear and reset", () => {
  const sim = simulation();
  assert.equal(sim.pending, 0, "no autoplay");
  sim.element("#play").onclick(); sim.step(20);
  const ink = sim.element("#ink").attributes.d;
  sim.element("#play").onclick(); sim.step(5);
  assert.equal(sim.element("#status").textContent, "Paused");
  assert.equal(sim.element("#ink").attributes.d, ink);
  sim.element("#play").onclick(); sim.step(5);
  assert.ok(sim.element("#ink").attributes.d.startsWith(ink), "resume retains drawing");
  sim.element("#clear").onclick();
  assert.equal(sim.element("#ink").attributes.d, "");
  sim.element("#reset").onclick();
  assert.equal(sim.element(".iso-stage").dataset.x, 335);
  assert.ok(sim.element("#ink").attributes.d.length > 0);
});

test("reduced motion completes Tesla without animation", () => {
  const sim = simulation(true);
  sim.element("#play").onclick();
  assert.equal(sim.pending, 0);
  assert.match(sim.element("#status").textContent, /reduced motion/);
  assert.ok(sim.element("#ink").attributes.d.length > 0);
  sim.fire(".iso-stage", "keydown", { key: "ArrowLeft" }); sim.step();
  assert.equal(sim.pending, 0, "manual movement is immediate");
});

test("compact illustration has local fallback, optional controls and no external requests", () => {
  assert.match(html, /<noscript><img[^>]+src="pablo.png"/);
  assert.match(html, /id="interactive" hidden/);
  assert.ok(!/https?:\/\//.test(html.replaceAll("http://www.w3.org/2000/svg", "")));
  assert.ok(!html.includes("Meet Pablo."));
  assert.ok(!html.includes("id=\"theme\""));
  assert.match(html, /role="status"/);
  assert.ok(statSync(asset("pablo.png")).size > 0);
  assert.match(readFileSync(asset("polargraph.svg"), "utf8"), /<svg/);
});

test("illustration retains a light surface and visible outlines without CSS", () => {
  const flatten = nodes => nodes.flatMap(node => typeof node === "object"
    ? [node, ...flatten(node.content ?? [])] : []);
  const svg = flatten(parser(html)).find(node => node.tag === "svg");
  assert.equal(svg.attrs.fill, "#f4f1e7", "CSS-off shapes inherit a light fill");
  const paths = flatten(svg.content).filter(node => node.tag === "path");
  const outlines = paths.filter(node => /(?:^|\s)(iso-line|chain)(?:\s|$)/.test(node.attrs?.class ?? ""));
  assert.ok(outlines.length > 0);
  for (const outline of outlines) {
    assert.equal(outline.attrs.fill, "none", "outline paths must not become solid shapes");
    assert.match(outline.attrs.stroke, /^#[0-9a-f]{6}$/i);
    assert.ok(Number(outline.attrs["stroke-width"]) > 0);
  }
  const ink = paths.find(node => node.attrs?.id === "ink");
  assert.equal(ink.attrs.fill, "none");
  assert.equal(ink.attrs.stroke, "#8b5542", "ink remains visible on the fallback surface");
});

test("range controls have separate block containers without author CSS", () => {
  const flatten = nodes => nodes.flatMap(node => typeof node === "object"
    ? [node, ...flatten(node.content ?? [])] : []);
  const nodes = flatten(parser(html));
  const rows = ["x", "y"].map(id => nodes.find(node => node.tag === "div"
    && (node.content ?? []).some(child => child?.tag === "input" && child.attrs?.id === id)));
  assert.ok(rows.every(Boolean));
  assert.notEqual(rows[0], rows[1]);
});

test("reported frame height includes content before main and bottom spacing", () => {
  const sim = simulation();
  assert.equal(sim.heightReports.at(-1).height, 982);
});

test("animation visibility follows the complete illustration and controls", () => {
  const sim = simulation();
  const observer = sim.intersections[0];
  assert.equal(observer.target, sim.element("#interactive"), "controls remain active when only the board leaves view");
  observer.callback([{ isIntersecting: true }]);
  sim.element("#play").onclick();
  sim.step(20);
  const before = sim.element("#ink").attributes.d;
  sim.step(20);
  assert.notEqual(sim.element("#ink").attributes.d, before);
  observer.callback([{ isIntersecting: false }]);
  const stopped = sim.element("#ink").attributes.d;
  sim.step(20);
  assert.equal(sim.element("#ink").attributes.d, stopped, "offscreen widget still suspends work");
  observer.callback([{ isIntersecting: true }]);
  sim.step(20);
  assert.notEqual(sim.element("#ink").attributes.d, stopped);
});

test("frame resizes through its HTML height attribute and ignores untrusted messages", () => {
  const handlers = {};
  const frame = { height: "1150", style: {}, contentWindow: {}, addEventListener() {} };
  vm.runInNewContext(readFileSync(asset("polargraph-frame.js"), "utf8"), {
    document: { querySelector: () => frame },
    location: { origin: "http://localhost" },
    window: { addEventListener: (type, handler) => { handlers[type] = handler; } }
  });
  const send = overrides => handlers.message({ origin: "http://localhost",
    source: frame.contentWindow, data: { type: "pablo-height", height: 1260.3 }, ...overrides });
  send({ origin: "https://example.com" });
  send({ source: {} });
  send({ data: { type: "pablo-height", height: Infinity } });
  send({ data: { type: "pablo-height", height: 6001 } });
  assert.equal(frame.height, "1150");
  send({});
  assert.equal(frame.height, "1263", "HTML sizing survives disabled CSS");
  assert.equal(frame.style.height, "1263px");
});


test("Tesla keeps pen-up travel unmarked and both drawing modes finish the same portrait", () => {
  const animated = simulation(), reduced = simulation(true);
  const strokes = animated.inspect("TESLA_STROKES");
  const steps = animated.inspect("TESLA_STEPS");
  assert.ok(strokes.length > 50, "portrait has separate detail strokes");
  for (const [x, y] of steps) {
    assert.ok(x >= 95 && x <= 505 && y >= 200 && y <= 700, "route stays in drawing bounds");
  }
  animated.element("#play").onclick();
  animated.step(Math.ceil(steps.length / 1.6) + 5);
  reduced.element("#play").onclick();
  assert.equal(animated.element("#status").textContent, "Tesla complete");
  assert.equal(animated.element("#play").textContent, "Draw Tesla");
  const ink = animated.element("#ink").attributes.d;
  assert.equal(ink, reduced.element("#ink").attributes.d);
  assert.equal((ink.match(/M/g) ?? []).length, strokes.length, "every stroke begins with a move, never a connector line");
  animated.element("#reset").onclick();
  assert.equal((animated.element("#ink").attributes.d.match(/M/g) ?? []).length, strokes.length);
});
