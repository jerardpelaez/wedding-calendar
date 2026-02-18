// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jerardpelaez.github.io',
  base: '/wedding-calendar',
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
});
