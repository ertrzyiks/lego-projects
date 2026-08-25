import { defineConfig } from 'astro/config';

// Fully static output — no server runtime, no adapter. Deployed as plain
// HTML/CSS/PDF/PNG files to Cloudflare Pages.
export default defineConfig({
  output: 'static',
});
