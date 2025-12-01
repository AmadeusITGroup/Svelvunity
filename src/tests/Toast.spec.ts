import { render, screen } from '@testing-library/svelte';
import SvelteToast from '$lib/components/Toast/SvelteToast.svelte';
import type { ComponentProps } from 'svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const g = globalThis as any;
if (g.HTMLElement && !g.HTMLElement.prototype.animate) {
	g.HTMLElement.prototype.animate = () => ({
		onfinish: undefined,
		cancel() {}
	});
}

type ToastItem = {
	id: number;
	target?: string;
	classes?: string[];
	theme?: Record<string, string>;
	intro?: Record<string, unknown>;
	component?: unknown;
};

const { subscribe, setItems, mockInit } = vi.hoisted(() => {
	type Subscriber = (value: ToastItem[]) => void;

	let value: ToastItem[] = [];
	const subscribers = new Set<Subscriber>();

	return {
		subscribe(run: Subscriber) {
			subscribers.add(run);
			run(value);
			return () => {
				subscribers.delete(run);
			};
		},
		setItems(items: ToastItem[]) {
			value = items;
			for (const fn of subscribers) fn(value);
		},
		mockInit: vi.fn()
	};
});

vi.mock('$lib/components/Toast/stores', () => {
	return {
		toast: {
			subscribe,
			_init: mockInit,
			pop: vi.fn()
		}
	};
});

type Props = ComponentProps<typeof SvelteToast>;

const renderToast = (props?: Partial<Props>) =>
	render(SvelteToast, {
		props: {
			options: {},
			target: 'default',
			...props
		}
	});

describe('SvelteToast (container)', () => {
	beforeEach(() => {
		setItems([]);
		mockInit.mockClear();
	});

	it('calls toast._init with target and options on mount', () => {
		const options = { duration: 1234, position: 'top-right' };
		const target = 'custom-target';

		renderToast({ options, target });

		expect(mockInit).toHaveBeenCalledTimes(1);
		expect(mockInit).toHaveBeenCalledWith(target, options);
	});

	it('renders only items that match the given target', () => {
		setItems([
			{ id: 1, target: 'default' },
			{ id: 2, target: 'default' },
			{ id: 3, target: 'other' }
		]);

		renderToast({ target: 'default' });

		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(2);
	});

	it('applies classes and theme style from each item', () => {
		setItems([
			{
				id: 1,
				target: 'default',
				classes: ['toast', 'toast-error'],
				theme: { color: 'red', 'background-color': 'black' }
			}
		]);

		const { container } = renderToast();

		const li = container.querySelector('li');
		expect(li).not.toBeNull();

		expect(li!.className).toContain('toast');
		expect(li!.className).toContain('toast-error');

		const style = li!.getAttribute('style') ?? '';
		expect(style).toContain('color: red;');
		expect(style).toContain('background-color: black;');
	});

	it('renders a toast container <ul> with list items', () => {
		setItems([
			{ id: 1, target: 'default' },
			{ id: 2, target: 'default' }
		]);

		renderToast();

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list.className).toContain('_toastContainer');

		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(2);
	});
});
