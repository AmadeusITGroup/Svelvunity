import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from "mdsvex"
import mdsvexConfig from './mdsvex.config.js';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(), 
    mdsvex(mdsvexConfig)
  ],
  extensions: ['.svelte', '.svx', '.md'],
  compilerOptions: {
    compatibility: {
      componentApi: 4
    }
  }
}