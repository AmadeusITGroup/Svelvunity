import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import AccordionItem from '$lib/components/AccordionItem.svelte';
import { createRawSnippet, type ComponentProps } from 'svelte';

let accordionItemOptions: ComponentProps<typeof AccordionItem> = getAccordionItemOprions();

beforeEach(() => {
	accordionItemOptions = getAccordionItemOprions()
})

function getAccordionItemOprions() {
	return {
		open: false,
		disabled: false,
		showBody: true,
		clickLogic: null,
		animationDurationForShowingBody: 200,
		animationDurationForHidingBody: 0,
		buttonTestId: `testAccordionItemButton`,
		bodyTestId: 'testAccordionItemBody',
		buttonClasses: '',
		bodyClasses: '',
		bodySnippet: createRawSnippet(() => {
			return {
				render: () => `<div>Clicked</div>`,
			};
		}),
        buttonSnippet: createRawSnippet(() => {
			return {
				render: () => `<div>Click</div>`,
			};
		})
	}
}

describe('Accordion Component', () => {
	test('should render accordionItem with all props', async () => {
		accordionItemOptions.bodySnippet = undefined;
		accordionItemOptions.buttonSnippet = undefined;
		render(AccordionItem, { props: accordionItemOptions });

		const accordionItemButton = screen.getByRole(`button`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toBeEnabled();
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');
	});

	test('should render accordionItem disabled', async () => {
		accordionItemOptions.bodySnippet = undefined;
		accordionItemOptions.buttonSnippet = undefined;
		render(AccordionItem, { props: { ...accordionItemOptions, disabled: true } });

		const accordionItemButton = screen.getByRole(`button`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toHaveClass('accordion-button__disabled');
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');
	});

	test('should render accordionItem with the body opened', async () => {
		accordionItemOptions.open = true;
		render(AccordionItem, accordionItemOptions);

		const accordionItemButton = screen.getByText(`Click`);
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should open the accordionItem body on click on the AccordionItem button', async () => {
		const user = userEvent.setup();
		HTMLElement.prototype.animate = vi.fn().mockImplementation(() => ({ cancel: vi.fn() }));
		render(AccordionItem, accordionItemOptions);

		const accordionItemButton = screen.getByText(`Click`);
		expect(accordionItemButton).toBeInTheDocument();

		await user.click(accordionItemButton);

		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should test click event', async () => {
		const clickFunc = vi.fn();
		accordionItemOptions.clickLogic = clickFunc;
		const user = userEvent.setup();
		render(AccordionItem, accordionItemOptions);

		const accordionItemButton = screen.getByText('Click');
		await user.click(accordionItemButton);
		expect(clickFunc).toHaveBeenCalled();
	});

	test('should not hide the accordionItem body on click inside the AccordionItem', async () => {
		const user = userEvent.setup();
		render(AccordionItem, accordionItemOptions);

		const accordionItemButton = screen.getByText(`Click`);
		expect(accordionItemButton).toBeInTheDocument();
		await user.click(accordionItemButton);
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should not hide the accordionItem body on click inside the AccordionItem body', async () => {
		const user = userEvent.setup();
		accordionItemOptions.open = true;
		render(AccordionItem, accordionItemOptions);
		// const accordionItemButton = screen.getByText(`Click`);
		// expect(accordionItemButton).toBeInTheDocument();
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
		await user.click(accordionItemBody);
		expect(accordionItemBody).toBeInTheDocument();
	});
});
