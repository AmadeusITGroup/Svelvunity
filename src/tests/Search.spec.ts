import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import { Search } from '$lib';

describe('Search.svelte', () => {
	it('renders input and search icon', () => {
		const { getByPlaceholderText } = render(Search, {
			placeholder: 'Search...',
			value: '',
			onInput: vi.fn(),
			onClear: vi.fn()
		});

		expect(getByPlaceholderText('Search...')).toBeInTheDocument();

		const { container } = render(Search, {
			placeholder: 'Search...',
			value: '',
			onInput: vi.fn(),
			onClear: vi.fn()
		});
		const svgIcon = container.querySelector('[data-cy-id="search-symbol-icon-search"]');
		expect(svgIcon).toBeInTheDocument();
	});
	it('calls onInput when typing', async () => {
		const onInput = vi.fn();
		const { getByPlaceholderText } = render(Search, {
			placeholder: 'Search...',
			value: '',
			onInput,
			onClear: vi.fn()
		});

		const input = getByPlaceholderText('Search...');
		await fireEvent.input(input, { target: { value: 'test' } });

		expect(onInput).toHaveBeenCalled();
	});

	it('shows clear icon only when value is non-empty', async () => {
		const { container, rerender } = render(Search, {
			placeholder: 'Search...',
			value: '',
			onInput: vi.fn(),
			onClear: vi.fn()
		});
		expect(container.querySelector('[data-cy-id="search-icon-clear"]')).not.toBeInTheDocument();
		await rerender({ value: 'something' });
		expect(container.querySelector('[data-cy-id="search-icon-clear"]')).toBeInTheDocument();
	});

	it('calls onClear when clear icon is clicked', async () => {
		const onClear = vi.fn();
		const { container } = render(Search, {
			placeholder: 'Search...',
			value: 'something',
			onInput: vi.fn(),
			onClear
		});

		const clearIcon = container.querySelector('svg[viewBox="-90 -90 448 512"]');
		expect(clearIcon).toBeInTheDocument();

		await fireEvent.click(clearIcon!);

		expect(onClear).toHaveBeenCalled();
	});
});
