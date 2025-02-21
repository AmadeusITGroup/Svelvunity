import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/setupTest.js'],
		exclude: ['dist/**', '**/node_modules/**'],
		coverage: {
			provider: 'v8', 
			reporter: ['text', 'lcov'],
			exclude: ['**config.**', '**.eslintrc.**', '**/src/routes/**', '.svelte-kit/**', 'dist/**', '**/app.d.ts'],
		}
	}
});
