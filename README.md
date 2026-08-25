# Projekty LEGO — website

Static Astro site listing the LEGO models archived in `sets/`. Every page is
generated at build time — there is no server runtime, no API routes, no
client-side framework. The one exception is the PDF instructions viewer
(`src/components/PdfViewer.astro`), which uses `pdfjs-dist` to render PDF
pages to a `<canvas>` in the browser, with prev/next arrows and a step
slider.

## How it works

`scripts/prepare-assets.mjs` runs before `astro dev` / `astro build` (via the
`predev` / `prebuild` lifecycle hooks). For every folder under `sets/` it:

- unzips the `.io` (BrickLink Studio) file and copies its internal
  `thumbnail.png` into `public/thumbnails/<slug>.png`
- copies the folder's `.pdf` instructions (if any) into `public/pdfs/<slug>.pdf`
- reads the part count out of the `.io`'s `.info` metadata

and writes the result to `src/data/sets-manifest.json`, which
`src/data/projects.ts` combines with the `sets` content collection
(`src/content/sets/*.md`) to produce the `projects` list used by the pages.
All of this is generated output — nothing under `public/thumbnails`,
`public/pdfs`, or `src/data/sets-manifest.json` is committed; it's rebuilt
from `sets/` every time.

To give a new set a title, add `src/content/sets/<slug>.md` with a `title`
frontmatter field, where `<slug>` matches its folder name under `sets/`.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

Output goes to `dist/`.

## Deploying to Cloudflare

Cloudflare is connected to this repository and deploys automatically on push,
via Wrangler's static-assets deployment (Cloudflare Pages has been folded
into Workers). Its project settings are:

- **Root directory**: `/` (repo root)
- **Build command**: `pnpm install && pnpm build`
- **Build output directory**: `dist`

`wrangler.jsonc` at the repo root is what makes this a static-assets deploy
rather than a Worker script: it has no `main` entry point, just
`assets.directory` pointing at `dist/`. Without it, Wrangler errors with
"Missing entry-point to Worker script or to assets directory". No adapter or
Pages Functions are needed since the output is fully static.
