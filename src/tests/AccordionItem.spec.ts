import { render, screen } from '@testing-library/svelte/svelte5';

import userEvent from '@testing-library/user-event';
import { AccordionItem } from '$lib';
import html from '@playpilot/svelte-htm';

describe('Accordion Component', () => {
	const AccordionItemProps = {
		open: false,
		disabled: false,
		showBody: true,
		clickLogic: null,
		animationDurationForShowingBody: 200,
		animationDurationForHidingBody: 0,
		buttonTestId: `testAccordionItemButton`,
		bodyTestId: 'testAccordionItemBody',
		buttonClasses: '',
		bodyClasses: ''
	};

	test('should render accordionItem with all props', async () => {
		render(AccordionItem, { props: AccordionItemProps });

		const accordionItemButton = screen.getByRole(`button`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toBeEnabled();
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');
	});

	test('should render accordionItem disabled', async () => {
		render(AccordionItem, { props: { ...AccordionItemProps, disabled: true } });

		const accordionItemButton = screen.getByRole(`button`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemButton).toHaveClass('accordion-button__disabled');
		expect(accordionItemButton).toHaveAttribute('data-cy-id', 'testAccordionItemButton');
	});

	test('should render accordionItem with the body opened', async () => {
		render(html`
            <${AccordionItem} open=${true}>
                <div slot="button">Click</div>
                <div slot="body">Clicked</div>
            </${AccordionItem}>
        `);

		const accordionItemButton = screen.getByText(`Click`);
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemButton).toBeInTheDocument();
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should open the accordionItem body on click on the AccordionItem button', async () => {
		const user = userEvent.setup();
		render(
			html`
            <${AccordionItem}>
                <div slot="button">Click</div>
                <div slot="body">Clicked</div>
            </${AccordionItem}>
        `,
			{ props: AccordionItemProps }
		);

		const accordionItemButton = screen.getByText(`Click`);
		expect(accordionItemButton).toBeInTheDocument();

		await user.click(accordionItemButton);

		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should test click event', async () => {
		const clickFunc = vi.fn();
		const user = userEvent.setup();
		render(html`
            <${AccordionItem} clickLogic=${clickFunc}>
                <div slot="button">Click</div>
                <div slot="body">Clicked</div>
            </${AccordionItem}>
        `);
		const accordionItemButton = screen.getByText('Click');

		await user.click(accordionItemButton);
		expect(clickFunc).toHaveBeenCalled();
	});

	test('should not hide the accordionItem body on click inside the AccordionItem', async () => {
		const user = userEvent.setup();
		render(
			html`
				<${AccordionItem} open=${true}>
					<div slot="button">Click</div>
					<div slot="body">Clicked</div>
				</${AccordionItem}>
			`,
			{ props: AccordionItemProps }
		);
		const accordionItemButton = screen.getByText(`Click`);
		expect(accordionItemButton).toBeInTheDocument();
		await user.click(accordionItemButton);
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
	});

	test('should not hide the accordionItem body on click inside the AccordionItem body', async () => {
		const user = userEvent.setup();
		render(
			html`
				<${AccordionItem} open=${true}>
					<div slot="button">Click</div>
					<div slot="body">Clicked</div>
				</${AccordionItem}>
			`,
			{ props: AccordionItemProps }
		);
		const accordionItemButton = screen.getByText(`Click`);
		expect(accordionItemButton).toBeInTheDocument();
		const accordionItemBody = screen.getByText(`Clicked`);
		expect(accordionItemBody).toBeInTheDocument();
		await user.click(accordionItemBody);
		expect(accordionItemBody).toBeInTheDocument();
	});
});
