import { PageTransition } from '$lib';
import { render } from '@testing-library/svelte';

describe('PageTransition Component', () => {
	test('should render without error', () => {
		//https://github.com/testing-library/svelte-testing-library/issues/416
		HTMLElement.prototype.animate = vi.fn().mockImplementation(() => ({ cancel: vi.fn() }));

		const { container } = render(PageTransition);
		expect(container).toBeInTheDocument();
	});
});
