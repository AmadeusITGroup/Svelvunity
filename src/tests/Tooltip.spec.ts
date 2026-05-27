import { Tooltip } from '$lib';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { tick, createRawSnippet, type ComponentProps } from 'svelte';

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

	test('hides tooltip on mouseleave (clears animation, restores initial position)', async () => {
		vi.useFakeTimers();
		tooltipOptions.position = 'top';
		tooltipOptions.animation = 'fade';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		await fireEvent.mouseEnter(span);
		vi.runAllTimers();
		await tick();
		await fireEvent.mouseLeave(span);
		await tick();

		expect(tooltip).not.toHaveClass('show');
		expect(tooltip).not.toHaveClass('animation-fade');
		expect(tooltip).toHaveClass('top');
		vi.useRealTimers();
	});

	test('toggles tooltip via focusin/focusout listeners', async () => {
		vi.useFakeTimers();
		tooltipOptions.animation = '';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		await fireEvent.focusIn(span);
		vi.runAllTimers();
		await tick();
		expect(tooltip).toHaveClass('show');

		await fireEvent.focusOut(span);
		await tick();
		expect(tooltip).not.toHaveClass('show');

		vi.useRealTimers();
	});

	test('renders without arrow when arrow=false (arrowless class applied)', () => {
		tooltipOptions.arrow = false;
		const { container } = render(Tooltip, tooltipOptions);

		expect(container.querySelector('div.tooltip') as HTMLElement).toHaveClass('arrowless');
	});

	test('renders with a theme class when theme is provided', () => {
		tooltipOptions.theme = 'dark';
		const { container } = render(Tooltip, tooltipOptions);

		expect(container.querySelector('div.tooltip') as HTMLElement).toHaveClass('dark');
	});

	test('sets CSS custom properties from style prop on mount', async () => {
		const setPropertySpy = vi.spyOn(CSSStyleDeclaration.prototype, 'setProperty');
		tooltipOptions.style = {
			backgroundColor: 'red',
			fontSize: '14px'
		};
		render(Tooltip, tooltipOptions);
		await tick();

		expect(setPropertySpy).toHaveBeenCalledWith('--tooltip-background-color', 'red');
		expect(setPropertySpy).toHaveBeenCalledWith('--tooltip-font-size', '14px');

		setPropertySpy.mockRestore();
	});

	test('uses delay of 0 when no animation, so tooltip shows on hover', async () => {
		vi.useFakeTimers();
		tooltipOptions.animation = '';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		await fireEvent.mouseEnter(span);
		vi.runAllTimers();
		await tick();

		expect(tooltip).toHaveClass('show');
		vi.useRealTimers();
	});

	test('applies animation class while hover-shown when animation is set', async () => {
		vi.useFakeTimers();
		tooltipOptions.animation = 'slide';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		await fireEvent.mouseEnter(span);
		vi.advanceTimersByTime(250);

		expect(tooltip).toHaveClass('animation-slide');
		vi.useRealTimers();
	});

	test('flips position via INVERSE when autoPosition is true and tooltip is out of viewport', async () => {
		tooltipOptions.autoPosition = true;
		tooltipOptions.position = 'top';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
			top: -100,
			left: 0,
			bottom: -50,
			right: 100,
			width: 100,
			height: 50,
			x: 0,
			y: -100,
			toJSON() {}
		} as DOMRect);

		await fireEvent.mouseEnter(span);

		expect(tooltip).toHaveClass('bottom');
	});

	test('does not flip position when autoPosition is true and tooltip is in viewport', async () => {
		tooltipOptions.autoPosition = true;
		tooltipOptions.position = 'top';
		const { container } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const tooltip = container.querySelector('div.tooltip') as HTMLElement;

		vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			bottom: 50,
			right: 100,
			width: 90,
			height: 40,
			x: 10,
			y: 10,
			toJSON() {}
		} as DOMRect);

		await fireEvent.mouseEnter(span);

		expect(tooltip).toHaveClass('top');
	});

	test('omits the testId attribute when testId is empty', () => {
		tooltipOptions.testId = '';
		const { container } = render(Tooltip, tooltipOptions);

		expect(container.querySelector('span')).not.toHaveAttribute('data-cy-id');
	});

	test('removes container event listeners on unmount', () => {
		const { container, unmount } = render(Tooltip, tooltipOptions);
		const span = container.querySelector('span') as HTMLElement;
		const removeSpy = vi.spyOn(span, 'removeEventListener');

		unmount();

		const removed = removeSpy.mock.calls.map((c) => c[0]);
		expect(removed).toEqual(
			expect.arrayContaining(['focusin', 'focusout', 'mouseenter', 'mouseleave'])
		);
	});
});
