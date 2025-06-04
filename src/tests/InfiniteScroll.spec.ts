import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, describe, expect, beforeEach } from 'vitest';
import { InfiniteScroll } from '$lib';

describe('InfiniteScroll Component', () => {
	let onLoadMoreMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		onLoadMoreMock = vi.fn();
	});

	test('should render without error', () => {
		const { container } = render(InfiniteScroll);
		expect(container).toBeInTheDocument();
	});

	test('should render without error with reverse', () => {
		const { container } = render(InfiniteScroll, { props: { reverse: true } });
		expect(container).toBeInTheDocument();
	});

	test('should not call the loadMore function when not scrolling to the bottom', () => {
		const loadMoreMock = vi.fn();
		const { container } = render(InfiniteScroll);

		const scrollableElement = container.querySelector('.scrollable');
		if (scrollableElement) {
			fireEvent.scroll(scrollableElement, {
				target: { scrollTop: 50, clientHeight: 100, scrollHeight: 200 }
			});
		}

		expect(loadMoreMock).not.toHaveBeenCalled();
	});

	test('renders container div if no window and no elementScroll', () => {
		const { container } = render(InfiniteScroll, {
			props: { window: false, elementScroll: null }
		});

		expect(container.querySelector('#svelte-infinite-scroll')).toBeInTheDocument();
	});

	test('does not render container div if window=true', () => {
		const { container } = render(InfiniteScroll, {
			props: { window: true }
		});

		expect(container.querySelector('#svelte-infinite-scroll')).not.toBeInTheDocument();
	});

	test('calls onLoadMore when scrolled near threshold', async () => {
		const onLoadMoreMock = vi.fn();

		// Create real DOM element for scrolling
		const scrollEl = document.createElement('div');

		// Mock scrollHeight, clientHeight properties
		Object.defineProperty(scrollEl, 'scrollHeight', { get: () => 1000 });
		Object.defineProperty(scrollEl, 'clientHeight', { get: () => 600 });
		// Initial scrollTop, close to threshold offset = scrollHeight - clientHeight - scrollTop
		scrollEl.scrollTop = 390; // offset = 1000 - 600 - 390 = 10

		render(InfiniteScroll, {
			props: {
				elementScroll: scrollEl,
				threshold: 10,
				onLoadMore: onLoadMoreMock
			}
		});

		// Fire scroll event, component's internal listener should pick this up
		await fireEvent.scroll(scrollEl);

		// Wait for Svelte reactive updates and effect to run
		await waitFor(() => {
			expect(onLoadMoreMock).toHaveBeenCalled();
		});
	});

	test('does not call onLoadMore if hasMore is false', async () => {
		const scrollEl = document.createElement('div');

		Object.defineProperty(scrollEl, 'scrollHeight', { get: () => 1000 });
		Object.defineProperty(scrollEl, 'clientHeight', { get: () => 600 });
		scrollEl.scrollTop = 390;

		render(InfiniteScroll, {
			props: {
				elementScroll: scrollEl,
				hasMore: false,
				onLoadMore: onLoadMoreMock
			}
		});

		scrollEl.scrollTop = 390;
		await fireEvent.scroll(scrollEl);

		// Wait a bit to check that callback is NOT called
		await waitFor(() => {
			expect(onLoadMoreMock).not.toHaveBeenCalled();
		});
	});

	test('cleans up event listeners on destroy', () => {
		const scrollEl = document.createElement('div');

		// Spy on removeEventListener
		const removeSpy = vi.spyOn(scrollEl, 'removeEventListener');

		const { unmount } = render(InfiniteScroll, {
			props: { elementScroll: scrollEl }
		});

		unmount();

		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

		removeSpy.mockRestore();
	});
});
