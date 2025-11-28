import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import AccordionItem from '$lib/components/AccordionItem.svelte';
import { createRawSnippet, type ComponentProps } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const g = globalThis as any;
if (g.HTMLElement && !g.HTMLElement.prototype.animate) {
	g.HTMLElement.prototype.animate = () => ({
		cancel() {},
		onfinish: null
	});
}

let accordionItemOptions: ComponentProps<typeof AccordionItem> = getAccordionItemOptions();

beforeEach(() => {
	accordionItemOptions = getAccordionItemOptions();
});

function getAccordionItemOptions(): ComponentProps<typeof AccordionItem> {
	return {
		open: false,
		disabled: false,
		showBody: true,
		fillEmptyChevronSpace: false,
		clickLogic: null,
		animationDurationForShowingBody: 200,
		animationDurationForHidingBody: 0,
		buttonTestId: `testAccordionItemButton`,
		bodyTestId: 'testAccordionItemBody',
		buttonClasses: '',
		bodyClasses: '',
		bodySnippet: createRawSnippet(() => {
			return {
				render: () => `<div>Clicked</div>`
			};
		}),
		buttonSnippet: createRawSnippet(() => {
			return {
				render: () => `<div>Click</div>`
			};
		})
	};
}

describe('Accordion Component', () => {
	it('renders accordion item button with test id and without snippets', () => {
		accordionItemOptions.bodySnippet = undefined;
		accordionItemOptions.buttonSnippet = undefined;

		const { container } = render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByRole('button');
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toBeEnabled();
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');

		expect(container.querySelector('.accordion-button-chevron')).toBeNull();
	});

	it('renders accordion item in disabled state, including wrapper class', () => {
		accordionItemOptions.bodySnippet = undefined;
		accordionItemOptions.buttonSnippet = undefined;

		const { container } = render(AccordionItem, {
			props: { ...accordionItemOptions, disabled: true }
		});

		const accordionItemButton = screen.getByRole('button');
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toHaveClass('accordion-button__disabled');
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');

		const wrapper = accordionItemButton.parentElement;
		expect(wrapper).toHaveClass('accordion-button__not-allowed');

		expect(container.querySelector('.accordion-body')).toBeNull();
	});

	it('renders accordion item with body open and chevron when open=true', () => {
		accordionItemOptions.open = true;
		const { container } = render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByText('Click');
		const accordionItemBody = screen.getByText('Clicked');
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemBody).toBeInTheDocument();

		expect(container.querySelector('.accordion-button-chevron')).not.toBeNull();
	});

	it('opens body on click when bodySnippet is present and showBody is true', async () => {
		const user = userEvent.setup();
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByText('Click');
		expect(accordionItemButton).toBeInTheDocument();

		await user.click(accordionItemButton);

		const accordionItemBody = screen.getByText('Clicked');
		expect(accordionItemBody).toBeInTheDocument();
	});

	it('does NOT open on click if showBody is false even if bodySnippet exists', async () => {
		const user = userEvent.setup();
		accordionItemOptions.showBody = false;

		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByText('Click');
		await user.click(accordionItemButton);

		expect(screen.queryByText('Clicked')).toBeNull();
	});

	it('calls clickLogic on mouse click when bodySnippet & showBody are truthy', async () => {
		const clickFunc = vi.fn();
		accordionItemOptions.clickLogic = clickFunc;

		const user = userEvent.setup();
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByText('Click');
		await user.click(accordionItemButton);

		expect(clickFunc).toHaveBeenCalledTimes(1);
	});

	it('does NOT call clickLogic when bodySnippet is missing', async () => {
		const clickFunc = vi.fn();
		accordionItemOptions.clickLogic = clickFunc;
		accordionItemOptions.bodySnippet = undefined;

		const user = userEvent.setup();
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByRole('button');
		await user.click(accordionItemButton);

		expect(clickFunc).not.toHaveBeenCalled();
		expect(screen.queryByText('Clicked')).toBeNull();
	});

	it('does not open on keydown when disabled', async () => {
		const user = userEvent.setup();
		const clickFunc = vi.fn();
		accordionItemOptions.clickLogic = clickFunc;
		accordionItemOptions.disabled = true;

		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByRole('button');

		await user.type(accordionItemButton, '{Enter}');
		await user.type(accordionItemButton, ' ');

		expect(screen.queryByText('Clicked')).toBeNull();
	});

	it('keeps the body visible when clicking inside the header', async () => {
		const user = userEvent.setup();
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByText('Click');
		await user.click(accordionItemButton);

		const accordionItemBody = screen.getByText('Clicked');
		expect(accordionItemBody).toBeInTheDocument();
	});

	it('keeps the body visible when clicking inside the body', async () => {
		const user = userEvent.setup();
		accordionItemOptions.open = true;
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemBody = screen.getByText('Clicked');
		expect(accordionItemBody).toBeInTheDocument();

		await user.click(accordionItemBody);
		expect(accordionItemBody).toBeInTheDocument();
	});

	it('renders an empty chevron space filler when no body but fillEmptyChevronSpace is true', () => {
		accordionItemOptions.bodySnippet = undefined;
		accordionItemOptions.showBody = false;
		accordionItemOptions.fillEmptyChevronSpace = true;

		const { container } = render(AccordionItem, { props: accordionItemOptions });

		const filler = container.querySelector('.accordion-button-chevron-space-filler');
		expect(filler).not.toBeNull();
		expect(container.querySelector('.accordion-button-chevron')).toBeNull();
	});

	it('applies custom buttonClasses and bodyClasses plus bodyTestId', () => {
		accordionItemOptions.open = true;
		accordionItemOptions.buttonClasses = 'my-button-class';
		accordionItemOptions.bodyClasses = 'my-body-class';

		render(AccordionItem, { props: accordionItemOptions });

		const button = screen.getByRole('button');
		const body = screen.getByText('Clicked').closest('.accordion-body');

		expect(button).toHaveClass('my-button-class');
		expect(body).toHaveClass('my-body-class');
		expect(body).toHaveAttribute('data-cy-id', 'testAccordionItemBody');
	});
});
