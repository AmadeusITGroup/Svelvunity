import { Button, Tabs } from '$lib';
import { render, screen, fireEvent } from '@testing-library/svelte';

describe('Tabs Component', () => {
	const items = [
		{ label: 'Applications', value: 1, component: Button },
		{ label: 'Header', value: 2, component: Button },
		{ label: 'Tab 3', value: 3, component: Button }
	];
	test('renders tabs component correctly', () => {
		render(Tabs, { props: { items: items } });

		expect(screen.getByText('Applications')).toBeInTheDocument();
	});

	test('shows tabs correctly when clicked', async () => {
		const { getByText } = render(Tabs, {
			props: { items: items }
		});

		const tab1 = getByText('Applications');
		const tab2 = getByText('Header');

		await fireEvent.click(tab2);

		expect(tab1).toBeInTheDocument();
		expect(tab2).toBeInTheDocument();
		expect(tab1).not.toHaveClass('active active-item');
	});
});
