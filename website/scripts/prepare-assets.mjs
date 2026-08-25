// Build-time only: reads the LEGO Studio project archive in ../sets and
// materializes the assets the site needs into public/, plus a manifest
// consumed by src/data/projects.ts. Runs before both `astro dev` and
// `astro build` — never at request time, so it has no bearing on the
// "no runtime" static output.
import { readdirSync, statSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = join(__dirname, '..');
const setsRoot = join(websiteRoot, '..', 'sets');
const thumbnailsDir = join(websiteRoot, 'public', 'thumbnails');
const pdfsDir = join(websiteRoot, 'public', 'pdfs');
const manifestPath = join(websiteRoot, 'src', 'data', 'sets-manifest.json');

rmSync(thumbnailsDir, { recursive: true, force: true });
rmSync(pdfsDir, { recursive: true, force: true });
mkdirSync(thumbnailsDir, { recursive: true });
mkdirSync(pdfsDir, { recursive: true });

const manifest = [];

for (const slug of readdirSync(setsRoot).sort()) {
  const folder = join(setsRoot, slug);
  if (!statSync(folder).isDirectory()) continue;

  const entries = readdirSync(folder);
  const ioFile = entries.find((name) => name.endsWith('.io'));
  if (!ioFile) continue;

  const zip = new AdmZip(join(folder, ioFile));

  const thumbnailEntry = zip.getEntry('thumbnail.png');
  if (thumbnailEntry) {
    writeFileSync(join(thumbnailsDir, `${slug}.png`), zip.readFile(thumbnailEntry));
  }

  let totalParts = null;
  const infoEntry = zip.getEntry('.info');
  if (infoEntry) {
    try {
      totalParts = JSON.parse(zip.readFile(infoEntry).toString('utf-8')).total_parts ?? null;
    } catch {
      // Malformed Studio metadata — fall back to no part count rather than failing the build.
    }
  }

  const pdfFile = entries.find((name) => name.toLowerCase().endsWith('.pdf'));
  if (pdfFile) {
    writeFileSync(join(pdfsDir, `${slug}.pdf`), readFileSync(join(folder, pdfFile)));
  }

  manifest.push({
    slug,
    hasThumbnail: Boolean(thumbnailEntry),
    hasPdf: Boolean(pdfFile),
    totalParts,
  });
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`prepare-assets: wrote ${manifest.length} project(s) to ${manifestPath}`);
