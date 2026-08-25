import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Curated per-set copy (Polish title, optional description in the markdown
// body). The entry id (filename minus extension) must match the folder name
// under sets/ — that's how src/data/projects.ts joins this with the
// build-generated manifest.
const sets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sets' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { sets };
