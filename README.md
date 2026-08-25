# Projekty LEGO — website

Static Astro site listing the LEGO models archived in `sets/`. Every page is
generated at build time — there is no server runtime, no API routes, no
client-side framework.

## How it works

`scripts/prepare-assets.mjs` runs before `astro dev` / `astro build` (via the
`predev` / `prebuild` lifecycle hooks). For every folder under `sets/` it:

- unzips the `.io` (BrickLink Studio) file and copies its internal
  `thumbnail.png` into `public/thumbnails/<slug>.png`
- copies the folder's `.pdf` instructions (if any) into `public/pdfs/<slug>.pdf`
- reads the part count out of the `.io`'s `.info` metadata

and writes the result to `src/data/sets-manifest.json`, which
`src/data/projects.ts` combines with hand-written Polish titles to produce the
`projects` list used by the pages. All of this is generated output — nothing
under `public/thumbnails`, `public/pdfs`, or `src/data/sets-manifest.json` is
committed; it's rebuilt from `sets/` every time.

To give a new set a title, add an entry to the `titles` map in
`src/data/projects.ts` keyed by its folder name under `sets/`.

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

## Deploying to Cloudflare Pages

Cloudflare Pages is connected to this repository and deploys automatically on
push. Its project settings are:

- **Root directory**: `/` (repo root)
- **Build command**: `pnpm install && pnpm build`
- **Build output directory**: `dist`

No adapter or Pages Functions are needed since the output is fully static.
