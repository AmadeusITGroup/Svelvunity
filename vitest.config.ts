import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

const excludeFiles = [
	'**config.**',
	'**.eslintrc.**',
	'**/src/routes/**',
	'.svelte-kit/**',
	'dist/**',
	'**/app.d.ts',
	'**/node_modules/**'
];

export default defineConfig(() =>
	mergeConfig(
		viteConfig,
		defineConfig({
			test: {
				globals: true,
				setupFiles: './src/setupTest.js',
				environment: 'jsdom',
				include: ['src/tests/**/*.spec.ts'],
				exclude: [...configDefaults.exclude, ...excludeFiles],
				coverage: {
					provider: 'v8',
					reporter: ['text', 'lcov'],
					exclude: [...configDefaults.exclude, ...excludeFiles.concat('src/tests/**')]
				}
			}
		})
	)
);
