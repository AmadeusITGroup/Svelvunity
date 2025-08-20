import type { SvelteComponent } from 'svelte';

export interface ITabItem {
	label: string;
	value: number;
	component: SvelteComponent;
}
