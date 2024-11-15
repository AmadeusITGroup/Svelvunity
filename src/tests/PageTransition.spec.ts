import { PageTransition } from '$lib';
import { render } from '@testing-library/svelte';

describe('PageTransition Component', () => {
	test('should render without error', () => {
		const { container } = render(PageTransition);
		expect(container).toBeInTheDocument();
	});
});
