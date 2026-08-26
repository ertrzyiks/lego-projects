import { getCollection } from 'astro:content';
import manifest from './sets-manifest.json';

export interface Project {
  slug: string;
  title: string;
  difficulty: number;
  totalParts: number | null;
  thumbnail: string | null;
  pdf: string | null;
  model: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('sets');
  const copy = new Map(entries.map((entry) => [entry.id, entry.data]));

  return manifest.map((entry) => {
    const entryCopy = copy.get(entry.slug);
    return {
      slug: entry.slug,
      title: entryCopy?.title ?? entry.slug,
      difficulty: entryCopy?.difficulty ?? 1,
      totalParts: entry.totalParts,
      thumbnail: entry.hasThumbnail ? `/thumbnails/${entry.slug}.png` : null,
      pdf: entry.hasPdf ? `/pdfs/${entry.slug}.pdf` : null,
      model: entry.hasModel ? `/models/${entry.slug}.ldr` : null,
    };
  });
}
