#!/usr/bin/env bun
/**
 * Run the Marp dev server and the D2 diagram watcher together so a single
 * `bun run dev` previews slides and regenerates diagrams on change.
 */
const procs = [
  Bun.spawn(["bun", "run", "./scripts/build-diagrams.ts", "--watch"], {
    stdout: "inherit",
    stderr: "inherit",
  }),
  Bun.spawn(["portless", "linux-on-linux", "marp", "--server", "./slides"], {
    stdout: "inherit",
    stderr: "inherit",
  }),
];

const shutdown = () => {
  for (const proc of procs) proc.kill();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);

// If either process exits, tear down the other so the script never hangs.
await Promise.race(procs.map((proc) => proc.exited));
shutdown();
