import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { siteBudgets } from "./page-budgets.js";

const args = process.argv.slice(2);
if (args.some((arg) => !["--preview", "--json"].includes(arg))) throw new Error("Usage: npm run check:budgets -- [--preview] [--json]");
const preview = args.includes("--preview");
const temporary = await mkdtemp(path.join(tmpdir(), "starbase430-budgets-"));
try {
  const output = path.join(temporary, preview ? "preview" : "production");
  const repository = fileURLToPath(new URL("../", import.meta.url));
  execFileSync(process.execPath, ["--input-type=module", "-e", `
    import Eleventy from '@11ty/eleventy';
    await new Eleventy('src', ${JSON.stringify(output)}, { source: 'cli', runMode: '${preview ? "watch" : "build"}', quietMode: true }).write();
  `], { cwd: repository, stdio: "pipe", timeout: 30_000 });
  const pages = await siteBudgets(output);
  const mode = preview ? "draft preview" : "production";
  if (args.includes("--json")) console.log(JSON.stringify({ mode, warningBytes: 100_000, maxBytes: 512_000, pages }, null, 2));
  else {
    console.log(`${mode}: static uncompressed bytes; warn >100000, fail >512000 (not a browser measurement)`);
    for (const page of pages) {
      console.log(`${page.status} ${page.bytes} bytes /${page.page}`);
      for (const issue of page.issues) console.log(`  ERROR ${issue}`);
      if (page.downloads.length) console.log(`  Optional links/downloads (excluded unless embedded): ${page.downloads.join(", ")}`);
    }
  }
  if (pages.some((page) => page.status === "FAIL")) process.exitCode = 1;
} finally {
  await rm(temporary, { recursive: true, force: true });
}
