import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: {
      base: process.env.BASE_PATH ?? ''
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path.startsWith('/docs')) return;
        throw new Error(message);
      }
    }
  }
};

export default config;
