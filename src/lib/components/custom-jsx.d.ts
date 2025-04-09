import type { HTMLAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	interface HTMLAttributes<T> {
		onclick_outside?: (event: CustomEvent<void>) => void;
	}
}
