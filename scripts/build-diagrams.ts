#!/usr/bin/env bun
/**
 * Render every D2 source in slides/diagrams/ to a sibling .svg.
 *
 * The generated SVGs are committed so `bun run dev` / `bun run build` work
 * without the d2 binary installed. CI installs d2 and reruns this script so a
 * deploy always reflects the latest source.
 *
 * Pass --watch to re-render on change (used by scripts/dev.ts).
 */
import { Glob } from "bun";
import { existsSync, watch } from "node:fs";
import { basename } from "node:path";

const D2_THEME = "200"; // Dark Mauve, sits well on the dark deck.
const DIAGRAMS_DIR = "slides/diagrams";
const FONT_DIR = "assets/fonts";

// Embed IBM Plex Sans to match the deck. Each flag is only added when the file
// is present, so a missing font degrades to d2's default rather than erroring.
const FONT_FLAGS: string[] = [];
for (const [flag, file] of [
  ["--font-regular", "IBMPlexSans-Regular.ttf"],
  ["--font-bold", "IBMPlexSans-Bold.ttf"],
  ["--font-italic", "IBMPlexSans-Italic.ttf"],
] as const) {
  const path = `${FONT_DIR}/${file}`;
  if (existsSync(path)) FONT_FLAGS.push(flag, path);
}

const listSources = async () =>
  // Underscore-prefixed files (e.g. _theme.d2) are shared partials meant to be
  // imported by other diagrams, not rendered on their own.
  (await Array.fromAsync(new Glob(`${DIAGRAMS_DIR}/*.d2`).scan("."))).filter(
    (src) => !basename(src).startsWith("_"),
  );

const render = async (src: string) => {
  const out = src.replace(/\.d2$/, ".svg");
  const proc = Bun.spawn(
    ["d2", "--layout", "elk", "--theme", D2_THEME, "--pad", "16", ...FONT_FLAGS, src, out],
    { stdout: "inherit", stderr: "inherit" },
  );
  const ok = (await proc.exited) === 0;
  if (ok) console.log(`${src} => ${out}`);
  return ok;
};

const renderAll = async () => {
  const sources = await listSources();
  if (sources.length === 0) {
    console.log(`No .d2 sources found in ${DIAGRAMS_DIR}/.`);
    return true;
  }
  let ok = true;
  for (const src of sources) ok = (await render(src)) && ok;
  return ok;
};

if (!Bun.which("d2")) {
  console.warn(
    "d2 not found on PATH, skipping diagram generation.\n" +
      "Install it from https://d2lang.com/tour/install and rerun `bun run diagrams`.\n" +
      "Committed SVGs will be used in the meantime.",
  );
  process.exit(0);
}

const ok = await renderAll();

if (!process.argv.includes("--watch")) process.exit(ok ? 0 : 1);

console.log(`Watching ${DIAGRAMS_DIR}/ for changes...`);
const pending = new Set<string>();
let timer: ReturnType<typeof setTimeout> | undefined;
watch(DIAGRAMS_DIR, (_event, filename) => {
  if (!filename || !filename.endsWith(".d2")) return;
  // A change to a shared partial (_*) invalidates every diagram that imports it.
  pending.add(basename(filename).startsWith("_") ? "*" : `${DIAGRAMS_DIR}/${filename}`);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const items = new Set(pending);
    pending.clear();
    if (items.has("*")) {
      await renderAll();
    } else {
      for (const src of items) if (existsSync(src)) await render(src);
    }
  }, 100);
});
