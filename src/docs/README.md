# Svelvunity Docs

The Svelvunity Docs app is a standalone documentation site for the Svelvunity component library. It is built with Svelte 5, Vite, mdsvex, and Tailwind CSS, and showcases reusable UI components with live examples and usage snippets.

## Tech stack

- Svelte 5 + TypeScript
- Vite 7
- mdsvex (.svx pages)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm

## Getting started

From the repository root:

```bash
cd src/docs
npm install
npm run dev
```

Then open the URL printed in the terminal (typically `http://localhost:5173`).

## Available scripts

```bash
# Start the local dev server
npm run dev

# Type-check Svelte + TS
npm run check

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Deploy dist/ to GitHub Pages (gh-pages branch)
npm run deploy
```

## Deployment (GitHub Pages)

This site is configured to be hosted under the `/svelvunity/` base path (see `vite.config.ts`). If your repository or hosting base path differs, update the `base` option accordingly.

1. Ensure the base path is correct in `vite.config.ts`:
   ```ts
   export default defineConfig({
   	base: '/Svelvunity/',
   	plugins: [svelte()]
   });
   ```
2. Build the site and publish the `dist/` folder:
   ```bash
   npm run build && npm run deploy
   ```

The `deploy` script uses `gh-pages` to push the contents of `dist/` to the `gh-pages` branch.

## Project structure

```
src/docs/
  ├─ src/
  │  ├─ app.css
  │  ├─ App.svelte            # Layout + sidebar navigation
  │  ├─ Home.svx              # Getting started page
  │  ├─ lib/                  # Component demo pages (.svx/.svelte)
  │  ├─ css/custom.css
  │  ├─ interfaces/
  │  └─ utils/
  ├─ public/
  │  └─ favicon.png
  ├─ svelte.config.js         # mdsvex + preprocessors
  ├─ mdsvex.config.js
  ├─ vite.config.ts           # base path + svelte plugin
  ├─ package.json
  └─ README.md
```

## Adding a new component page

1. Create a new demo page under `src/lib`, e.g. `src/lib/MyComponent.svx`.
2. Import it in `src/App.svelte` and add it to the `items` array to appear in the sidebar:
   ```svelte
   <script lang="ts">
   	import MyComponent from './lib/MyComponent.svx';
   	let items = $state([
   		// ...existing items
   		{ label: 'My Component', value: 999, component: MyComponent }
   	]);
   </script>
   ```
3. Use Tailwind utility classes in your page content or extend styles in `src/app.css` / `src/css/custom.css` as needed.

## Using the library in examples

Examples in the docs import components from the published package:

```svelte
<script>
  import { Datepicker } from '@amadeus-it-group/svelvunity';
<\/script>

<Datepicker />
```

Refer to the repository root `README.md` for the full library documentation and version compatibility notes.

## Troubleshooting

- 404s on GitHub Pages: verify the `base` path in `vite.config.ts` matches your hosting path.
- Assets not loading: ensure asset URLs include the base (the app references `/svelvunity/favicon.png`).
- Type errors: run `npm run check` for diagnostics.

## License

See the root `LICENSE` file of this repository.
