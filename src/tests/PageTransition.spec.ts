import { PageTransition } from '$lib';
import { render } from '@testing-library/svelte/svelte5';

describe('PageTransition Component', () => {
	test('should render without error', () => {
		const { container } = render(PageTransition);
		expect(container).toBeInTheDocument();
	});
});
