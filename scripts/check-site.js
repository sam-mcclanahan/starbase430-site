import assert from "node:assert/strict";
import { parser } from "posthtml-parser";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkOutput } from "./check-output.js";

const repository = fileURLToPath(new URL("../", import.meta.url));
export async function checkSite() {
  const temporary = await mkdtemp(path.join(tmpdir(), "starbase430-structure-"));
  const siteData = JSON.parse(await readFile(path.join(repository, "src/_data/site.json"), "utf8"));
  const reports = [];
  try {
    for (const mode of ["build", "watch"]) {
      const output = path.join(temporary, mode);
      execFileSync(process.execPath, ["--input-type=module", "-e", `
        import Eleventy from '@11ty/eleventy';
        const site = new Eleventy('src', ${JSON.stringify(output)}, { source: 'cli', runMode: ${JSON.stringify(mode)}, quietMode: true });
        await site.write();
      `], { cwd: repository, timeout: 30_000, stdio: "pipe" });
      // Required pages/feeds prevent an empty or incomplete build from passing.
      for (const route of ["index.html", "about/index.html", "links/index.html", "colophon/index.html", "projects/index.html", "log/index.html", "feed.xml", "projects/feed.xml", "log/feed.xml"]) {
        assert.ok((await readFile(path.join(output, route), "utf8")).trim(), `${mode}: missing/empty ${route}`);
      }
      if (mode === "watch") {
        assert.ok((await readFile(path.join(output, "log/pablo-the-polargraph/index.html"), "utf8")).includes("Pablo"));
      }
      // Header navigation and conditional chapter rails are independent landmarks.
      const flatten = nodes => nodes.flatMap(n => typeof n === "object" ? [n, ...flatten(n.content ?? [])] : []);
      const hasClass = (n, cls) => n.attrs?.class?.split(/\s+/).includes(cls);
      let withChapters = 0, withoutChapters = 0;
      for (const file of (await readdir(output, { recursive: true })).filter(p => p.endsWith(".html"))) {
        const html = await readFile(path.join(output, file), "utf8");
        const nodes = flatten(parser(html));
        // The reviewed embedded document has its own main/skip link, not site navigation.
        // checkOutput still validates its metadata and all resource/link targets.
        if (file === "assets/illustrations/pablo/polargraph.html") continue;
        const header = nodes.find(n => n.tag === "header" && hasClass(n, "station"));
        const primary = nodes.filter(n => n.tag === "nav" && n.attrs?.["aria-label"] === "Primary");
        assert.equal(primary.length, 1, `${file}: one primary navigation`);
        assert.ok(flatten(header?.content ?? []).includes(primary[0]), `${file}: primary navigation belongs to header`);
        assert.ok(!nodes.some(n => hasClass(n, "sky-window")), `${file}: no photographic spacer`);
        const rails = nodes.filter(n => hasClass(n, "rail"));
        const chapters = nodes.filter(n => hasClass(n, "chapter-nav"));
        assert.equal(rails.length, chapters.length, `${file}: no empty rail`);
        if (chapters.length) {
          withChapters++;
          assert.ok(flatten(rails[0].content).includes(chapters[0]));
          assert.ok(flatten(chapters[0].content).filter(n => n.tag === "a").length > 1);
        } else {
          withoutChapters++;
          assert.ok(nodes.some(n => hasClass(n, "layout--without-chapters")), `${file}: single reading column without chapters`);
        }
      }
      assert.ok(withChapters > 0 && withoutChapters > 0, "exercise both rail layouts");
      const report = await checkOutput(output, siteData.url);
      assert.deepEqual(report.errors, [], `${mode} structural errors:\n${report.errors.join("\n")}`);
      reports.push(`${mode === "build" ? "Production" : "Preview"}: ${report.pages} HTML pages passed`);
    }
    return reports;
  } finally {
    // This directory belongs exclusively to this invocation.
    await rm(temporary, { recursive: true, force: true });
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const report of await checkSite()) console.log(report);
}
