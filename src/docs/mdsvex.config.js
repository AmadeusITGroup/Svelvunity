import { defineMDSveXConfig as defineConfig } from 'mdsvex';

const config = defineConfig({
    extensions: ['.md', '.svx'],
    smartypants: { dashes: 'oldschool' },
    highlight: { alias: { yavascript: "javascript" }}
});

export default config;
