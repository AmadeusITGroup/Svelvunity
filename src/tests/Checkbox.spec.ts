import { Checkbox } from '$lib';
import { render, fireEvent, screen } from '@testing-library/svelte';

import { tick } from 'svelte';

describe('Checkbox Component', () => {
	let checkboxProps = {
		classes: 'test-class',
		classesForInput: 'test-class-for-input',
		classesForLabel: 'test-class-for-label',
		labelName: 'label-name',
		inputId: 'checkbox-id',
		inputValue: true,
		testId: 'test-checkbox'
	};

	beforeEach(() => {
		checkboxProps = {
			classes: 'test-class',
			classesForInput: 'test-class-for-input',
			classesForLabel: 'test-class-for-label',
			labelName: 'label-name',
			inputId: 'checkbox-id',
			inputValue: true,
			testId: 'test-checkbox'
		};
	});

	test('should render a checkbox', async () => {
		const { container } = render(Checkbox, { props: { ...checkboxProps } });
		const labelForInput = container.getElementsByClassName('input-label')[0] as HTMLLabelElement;

		expect(labelForInput).toHaveTextContent(`${checkboxProps.labelName}`);
	});

	test('should render a disabled checkbox', async () => {
		const { container } = render(Checkbox, { props: { ...checkboxProps, isDisabled: true } });
		const inputCheckbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(inputCheckbox).toBeDisabled();
	});

	test('should have false value after clicking', async () => {
		const { container } = render(Checkbox, { props: checkboxProps });
		const inputCheckbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(inputCheckbox).toBeChecked();
		fireEvent.click(inputCheckbox);
		await tick();
		expect(inputCheckbox).not.toBeChecked();
	});

	test('should render a input type as checkbox', async () => {
		const { container } = render(Checkbox, { props: checkboxProps });
		const input = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(input).toHaveAttribute('type', 'checkbox');
	});

	test('should render the checkbox with the provided label and value', () => {
		render(Checkbox, {
			props: { labelName: 'Test Checkbox', inputValue: true, testId: 'test-checkbox' }
		});

		const labelElement = screen.getByText('Test Checkbox');
		expect(labelElement).toBeInTheDocument();

		const inputElement = screen.getByRole('checkbox');
		expect(inputElement).toHaveProperty('checked', true);
	});
});
