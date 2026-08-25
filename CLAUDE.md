# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a software project** — there is no source code, no build system, and nothing to
lint or test. It's a personal archive of LEGO digital models designed in [BrickLink Studio](https://www.bricklink.com/v3/studio/download.page)
(Stud.io), organized one subfolder per build under `sets/`.

Current builds:
- `sets/controlpanel/` — `controlpanel.io` (20 parts)
- `sets/smigacz/` — `smigacz.io` (11 parts), plus a rendered `smigacz.png` and printable `smigacz.pdf` instructions
- `sets/tank/` — `Czołg.io` (59 parts, Polish for "tank"), plus printable `czolg-3.pdf` instructions

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
  optionally `.pdf`/`.png` renders), matching the pattern of the existing folders.
- `.DS_Store` files are macOS Finder metadata and are gitignored — don't commit them.
