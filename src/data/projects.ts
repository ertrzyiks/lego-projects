import { getCollection } from 'astro:content';
import manifest from './sets-manifest.json';

export interface Project {
  slug: string;
  title: string;
  totalParts: number | null;
  thumbnail: string | null;
  pdf: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('sets');
  const titles = new Map(entries.map((entry) => [entry.id, entry.data.title]));

  return manifest.map((entry) => ({
    slug: entry.slug,
    title: titles.get(entry.slug) ?? entry.slug,
    totalParts: entry.totalParts,
    thumbnail: entry.hasThumbnail ? `/thumbnails/${entry.slug}.png` : null,
    pdf: entry.hasPdf ? `/pdfs/${entry.slug}.pdf` : null,
  }));
}
