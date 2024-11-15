import { Tooltip } from '$lib';
import { render, screen, fireEvent } from '@testing-library/svelte';
import html from '@playpilot/svelte-htm';

describe('Tooltip Component', () => {
	test('renders tooltip component correctly', () => {
		render(Tooltip, { props: { content: 'Test tooltip content' } });

		expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
	});

	test('shows tooltip content when hovered', () => {
		const { container } = render(Tooltip, {
			props: { content: 'Test tooltip content', testId: 'test-tooltip' }
		});

		fireEvent.mouseEnter(container.querySelector('span') as HTMLElement);

		expect(container.querySelector('span') as HTMLElement).toHaveAttribute(
			'data-cy-id',
			'test-tooltip'
		);
		expect(screen.getByText('Test tooltip content')).toBeVisible();
	});

	test('renders tooltip with correct content', () => {
		const { container } = render(html`
		<${Tooltip} content=${'Test tooltip content'}
				position=${'bottom'}
				align=${'center'}
				animation=${'fade'}
				testId=${'tooltip-test-id'}>
			<div class="tooltip-button" role="button">Click</div>
		</${Tooltip}>
	`);

		const icon = container.querySelector('.tooltip-button') as HTMLElement;
		fireEvent.mouseEnter(icon);
		expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
	});

	test('renders tooltip with correct position', () => {
		const { container } = render(Tooltip, { props: { position: 'bottom' } });

		expect(container.querySelector('span')?.children[0] as HTMLElement).toHaveClass('bottom');
		expect(container.querySelector('span') as HTMLElement).toBeInTheDocument();
	});
});
