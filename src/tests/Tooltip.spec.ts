import { Tooltip } from '$lib';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { createRawSnippet, type ComponentProps } from 'svelte';

let tooltipOptions: ComponentProps<typeof Tooltip> = getTooltipOptions();

beforeEach(() => {
	tooltipOptions = getTooltipOptions();
});

function getTooltipOptions() {
	return {
		content: 'Test tooltip content',
		position: 'bottom',
		align: 'center',
		animation: 'fade',
		testId: 'tooltip-test-id',
		maxWidth: 200,
		autoPosition: false,
		arrow: true,
		theme: '',
		style: null,
		children: createRawSnippet(() => {
			return {
				render: () => `<div></div>`
			};
		})
	};
}

describe('Tooltip Component', () => {
	test('renders tooltip component correctly', () => {
		render(Tooltip, tooltipOptions);

		expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
	});

	test('shows tooltip content when hovered', () => {
		tooltipOptions.testId = 'test-tooltip';
		const { container } = render(Tooltip, tooltipOptions);

		fireEvent.mouseEnter(container.querySelector('span') as HTMLElement);

		expect(container.querySelector('span') as HTMLElement).toHaveAttribute(
			'data-cy-id',
			'test-tooltip'
		);
		expect(screen.getByText('Test tooltip content')).toBeVisible();
	});

	test('renders tooltip with correct content', () => {
		tooltipOptions.children = createRawSnippet(() => {
			return {
				render: () => `<div class="tooltip-button" role="button">Click</div>`
			};
		});

		const { container } = render(Tooltip, tooltipOptions);

		const icon = container.querySelector('.tooltip-button') as HTMLElement;
		fireEvent.mouseEnter(icon);
		expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
	});

	test('renders tooltip with correct position', () => {
		const { container } = render(Tooltip, tooltipOptions);

		expect(container.querySelector('span > div.tooltip') as HTMLElement).toHaveClass('bottom');
		expect(container.querySelector('span') as HTMLElement).toBeInTheDocument();
	});
});
