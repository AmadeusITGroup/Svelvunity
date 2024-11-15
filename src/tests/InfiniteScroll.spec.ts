import { InfiniteScroll } from '$lib';
import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';

describe('InfiniteScroll Component', () => {
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
});
