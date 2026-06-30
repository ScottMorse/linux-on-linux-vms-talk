#!/usr/bin/env bun
/**
 * Render every D2 source in slides/diagrams/ to a sibling .svg.
 *
 * The generated SVGs are committed so `bun run dev` / `bun run build` work
 * without the d2 binary installed. CI installs d2 and reruns this script so a
 * deploy always reflects the latest source.
 */
import { Glob } from "bun";

const D2_THEME = "200"; // Dark Mauve, sits well on the dark deck.

const hasD2 = Bun.which("d2");
if (!hasD2) {
  console.warn(
    "d2 not found on PATH, skipping diagram generation.\n" +
      "Install it from https://d2lang.com/tour/install and rerun `bun run diagrams`.\n" +
      "Committed SVGs will be used in the meantime.",
  );
  process.exit(0);
}

// Underscore-prefixed files (e.g. _theme.d2) are shared partials meant to be
// imported by other diagrams, not rendered on their own.
const sources = (
  await Array.fromAsync(new Glob("slides/diagrams/*.d2").scan("."))
).filter((src) => !src.split("/").pop()!.startsWith("_"));
if (sources.length === 0) {
  console.log("No .d2 sources found in slides/diagrams/.");
  process.exit(0);
}

let failed = false;
for (const src of sources) {
  const out = src.replace(/\.d2$/, ".svg");
  const proc = Bun.spawn(["d2", "--theme", D2_THEME, "--pad", "16", src, out], {
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code === 0) console.log(`${src} => ${out}`);
  else failed = true;
}

process.exit(failed ? 1 : 0);
