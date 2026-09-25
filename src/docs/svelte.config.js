import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	// style: false - vite-plugin-svelte 7 mis-parses the <style> string inside svelte-highlight's
	// HighlightEditable.svelte; component CSS still goes through postcss.config.js via Vite
	preprocess: [vitePreprocess({ style: false }), mdsvex(mdsvexConfig)],
	extensions: ['.svelte', '.svx', '.md']
};
