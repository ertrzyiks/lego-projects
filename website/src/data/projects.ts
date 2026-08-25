import manifest from './sets-manifest.json';

export interface Project {
  slug: string;
  title: string;
  totalParts: number | null;
  thumbnail: string | null;
  pdf: string | null;
}

// Polish display copy, keyed by the set's folder name under ../sets.
// Anything appearing in the manifest without an entry here just falls
// back to its slug as the title.
const titles: Record<string, string> = {
  controlpanel: 'Panel sterowania',
  smigacz: 'Śmigacz',
  tank: 'Czołg',
};

export const projects: Project[] = manifest.map((entry) => ({
  slug: entry.slug,
  title: titles[entry.slug] ?? entry.slug,
  totalParts: entry.totalParts,
  thumbnail: entry.hasThumbnail ? `/thumbnails/${entry.slug}.png` : null,
  pdf: entry.hasPdf ? `/pdfs/${entry.slug}.pdf` : null,
}));

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
