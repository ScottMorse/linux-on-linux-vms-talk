# Linux on Linux

View at: https://scottmorse.github.io/linux-on-linux-vms-talk/

A [Marp](https://marp.app/) presentation about VMs and overlays for local sandboxes.

## Develop

```bash
bun install
bun run dev
```

`bun run dev` starts the Marp server at <http://localhost:8080>, serving the
`slides/` directory with live reload as you edit the markdown.

Slides live in [`slides/index.md`](./slides/index.md). The custom theme is in
[`themes/linux-on-linux.css`](./themes/linux-on-linux.css), registered through
[`marp.config.mjs`](./marp.config.mjs).

## Diagrams

Diagrams are authored as [D2](https://d2lang.com/) sources in
`slides/diagrams/*.d2` and rendered to sibling `.svg` files that the deck
references with `![](diagrams/foo.svg)`.

```bash
bun run diagrams         # render every .d2 source to .svg
bun run diagrams:watch   # live-render overlayfs.d2 while editing
```

The generated SVGs are committed so `bun run dev` and `bun run build` work
without the d2 binary. CI installs d2 and reruns `bun run diagrams` on deploy,
so the published slides always reflect the latest source. `bun run build` copies
the SVGs into `dist/diagrams/` so the relative image paths resolve on Pages.

## Build

```bash
bun run build        # -> dist/index.html
bun run build:pdf    # -> dist/index.pdf
bun run build:pptx   # -> dist/index.pptx
```

## Deploy

Pushing to `main` builds the HTML and publishes it to GitHub Pages via
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). Enable it once
under **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
