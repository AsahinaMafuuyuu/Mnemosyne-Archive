// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://asahinamafuyu.top/",
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()]
  }
});