# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A personal archive of LEGO digital models designed in [BrickLink Studio](https://www.bricklink.com/v3/studio/download.page)
(Stud.io), organized one subfolder per build under `sets/`. The repo root is
also a static Astro site (see below) that publishes that archive as a
browsable, downloadable catalog.

Current builds:
- `sets/controlpanel/` — `controlpanel.io` (20 parts)
- `sets/smigacz/` — `smigacz.io` (11 parts), plus a rendered `smigacz.png` and printable `smigacz.pdf` instructions
- `sets/tank/` — `Czołg.io` (59 parts, Polish for "tank"), plus printable `czolg.pdf` instructions

## File formats

- **`.io`** — a BrickLink Studio project file. It's a **zip archive**; inspect it with a zip tool
  rather than a text editor, e.g.:
  ```bash
  python3 -c "import zipfile; print(zipfile.ZipFile('sets/tank/Czołg.io').namelist())"
  ```
  Typical contents:
  - `model.ldr`, `model2.ldr`, `modelv2.ldr` — LDraw-format model geometry (plain text, part-by-part placement)
  - `model.lxfml` — LEGO Digital Designer XML export of the same model
  - `model.ins` — building instructions (when present)
  - `thumbnail.png`, `ImageResource/*.png` — rendered preview images
  - `errorPartList.err` — parts Studio couldn't resolve against its parts database
  - `.info` — JSON metadata: Studio version and total part count, e.g. `{"version":"2.26.7_1","total_parts":59,"parts_db_version":238}`
- **`.pdf`** — printable step-by-step building instructions, exported from Studio.
- **`.png`** at the set root (not inside `ImageResource/`) — a standalone rendered image of the finished build.

## Working with this repo

- Treat `.io`, `.pdf`, and `.png` files as opaque binary assets — don't try to open or diff them
  as text. If you need to inspect a model's contents, unzip the `.io` and read the `.ldr`/`.lxfml`/`.info`
  inside.
- To add a new build, create a new folder under `sets/<name>/` with its exported `.io` (and
  optionally a `.pdf` instructions file), matching the pattern of the existing folders, then add
  `src/content/sets/<name>.md` with a Polish `title` in its frontmatter (see below) — the website
  picks it up automatically on the next build.
- `.DS_Store` files are macOS Finder metadata and are gitignored — don't commit them.

## The Astro site (repo root)

Static site (`output: 'static'`, no adapter, no server runtime) built with
Astro and pnpm, deployed to Cloudflare Pages. Every page is prerendered HTML;
the only client-side JavaScript is the PDF viewer described below. Full
details, dev/build commands, and the Cloudflare project settings are in
`README.md`.

Per-set copy lives in the `sets` content collection: `src/content/sets/<slug>.md`,
one file per `sets/<slug>/` folder, with a `title` frontmatter field (schema in
`src/content.config.ts`). Everything else about a set — thumbnail, part count,
whether a PDF exists — is derived at build time, not hand-authored: nothing in
`src/` reads `.io`/`.pdf` files directly. `scripts/prepare-assets.mjs` runs
before both `pnpm dev` and `pnpm build` (via `predev`/`prebuild` hooks),
unzips each `sets/*/*.io` to pull out its embedded `thumbnail.png` and part
count, copies any sibling `.pdf` into `public/`, and writes
`src/data/sets-manifest.json`. `src/data/projects.ts` merges that generated
manifest with the content collection's titles (joined on `sets/` folder name
== markdown filename) to produce the list every page renders from. Everything
under `public/thumbnails`, `public/pdfs`, and `sets-manifest.json` is
generated output — never edit it directly or commit it; it's gitignored and
gets rebuilt from `sets/` every time.

Detail pages (`/projekty/[slug]/`) render the PDF both as a plain download
link and as a custom step-by-step viewer, `src/components/PdfViewer.astro`:
prev/next arrows plus a range slider (with a `<datalist>` tick per page) step
through the PDF's pages, each rendered to a `<canvas>` on the fly via
`pdfjs-dist` in the browser (no PDF pre-rasterization at build time — the
client fetches the PDF and renders whichever page is current). This is the one
piece of client-side JavaScript on the site; the viewer stays `hidden` until
the PDF's page count is known, falling back to the plain download link if it
never loads.
