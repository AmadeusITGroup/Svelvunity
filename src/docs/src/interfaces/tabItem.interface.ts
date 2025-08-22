import type { Component, ComponentProps } from 'svelte';

export interface ITabItem {
	label: string;
	value: number;
	component: Component;
	disabled?: boolean;
	testingId?: string;
	props?: ComponentProps<Component>[];
}
