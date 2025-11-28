import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ComponentProps } from 'svelte';

import Popover from '$lib/components/Popover.svelte';

vi.mock('@floating-ui/dom', () => {
	const computePosition = vi.fn(async () => ({
		x: 10,
		y: 20,
		middlewareData: { arrow: { x: 1, y: 2 } },
		placement: 'top',
		strategy: 'absolute'
	}));

	const autoUpdate = vi.fn((_ref: any, _floating: any, cb: () => void) => {
		cb();
		return () => {};
	});

	const flip = () => ({ name: 'flip' });
	const shift = () => ({ name: 'shift' });
	const offset = () => ({ name: 'offset' });
	const arrow = () => ({ name: 'arrow' });

	return {
		computePosition,
		autoUpdate,
		flip,
		shift,
		offset,
		arrow
	};
});

type Props = ComponentProps<typeof Popover>;

let triggerEl: HTMLButtonElement;

const createTrigger = () => {
	triggerEl = document.createElement('button');
	triggerEl.className = 'popup-trigger';
	triggerEl.textContent = 'Trigger';
	document.body.appendChild(triggerEl);
};

const removeTrigger = () => {
	if (triggerEl && triggerEl.parentNode) {
		triggerEl.parentNode.removeChild(triggerEl);
	}
};

const renderPopup = (overrides: Partial<Props> = {}) => {
	const onShow = overrides.onShow ?? vi.fn();

	const baseProps: Props = {
		border: false,
		rounded: false,
		shadow: false,
		classes: '',
		onShow,
		activeContent: false,
		arrow: true,
		placement: 'top',
		trigger: 'hover',
		triggeredBy: '.popup-trigger',
		reference: undefined,
		open: false,
		offset: 8,
		strategy: 'absolute',
		yOnly: false,
		children: undefined
	};

	return {
		...render(Popover, {
			props: {
				...baseProps,
				...overrides,
				onShow
			}
		}),
		onShow
	};
};

describe('Popup component', () => {
	beforeEach(() => {
		createTrigger();
	});

	afterEach(() => {
		removeTrigger();
		document.body.innerHTML = '';
	});

	it('calls onShow with the initial open state', () => {
		const { onShow } = renderPopup({ open: false });

		expect(onShow).toHaveBeenCalledTimes(1);
		expect(onShow).toHaveBeenCalledWith(false);
	});

	it('opens on hover when trigger="hover" and closes on mouseleave', async () => {
		renderPopup({
			trigger: 'hover',
			open: false
		});

		await fireEvent.mouseEnter(triggerEl);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toBeInTheDocument();

		await fireEvent.mouseLeave(triggerEl);

		await waitFor(() => {
			expect(screen.queryByRole('tooltip')).toBeNull();
		});
	});

	it('toggles open/closed on click when trigger="click"', async () => {
		renderPopup({
			trigger: 'click',
			open: false
		});

		await fireEvent.mouseEnter(triggerEl);
		expect(screen.queryByRole('tooltip')).toBeNull();

		await fireEvent.click(triggerEl);
		const tooltip1 = await screen.findByRole('tooltip');
		expect(tooltip1).toBeInTheDocument();

		await fireEvent.click(triggerEl);
		await waitFor(() => {
			expect(screen.queryByRole('tooltip')).toBeNull();
		});
	});

	it('renders the arrow by default when arrow=true', async () => {
		renderPopup({
			trigger: 'hover',
			arrow: true
		});

		await fireEvent.mouseEnter(triggerEl);
		const tooltip = await screen.findByRole('tooltip');

		const arrowEl = tooltip.querySelector('.rotate-45');
		expect(arrowEl).not.toBeNull();
	});

	it('does not render the arrow when arrow=false', async () => {
		renderPopup({
			trigger: 'hover',
			arrow: false
		});

		await fireEvent.mouseEnter(triggerEl);
		const tooltip = await screen.findByRole('tooltip');

		const arrowEl = tooltip.querySelector('.rotate-45');
		expect(arrowEl).toBeNull();
	});
});
