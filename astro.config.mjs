// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// 导入react
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
   
  site: "https://asahinamafuyu.top/",
  integrations: [preact(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()]
  },
  devToolbar: {
    enabled: false
  }
});