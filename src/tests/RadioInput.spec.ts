import { RadioInput } from '$lib';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';

describe('RadioInput Component', () => {
	const radioInputProps = {
		inputName: 'radio-input-name',
		inputError: '',
		options: [
			{ name: 'Option 1', value: 'option1' },
			{ name: 'Option 2', value: 'option2' },
			{ name: 'Option 3', value: 'option3' }
		],
		classesForInput: 'test-class-for-input',
		classesForInputLabel: 'test-class-for-input-label',
		classesForLabel: 'test-class-for-label',
		testId: 'test-radio-input',
		selectedOption: 'option1',
		onOptionSelected: () => {}
	};

	test('should render the radio inputs and labels', () => {
		const { getByRole, container } = render(RadioInput, {
			props: radioInputProps
		});

		expect(getByRole('radiogroup')).toBeInTheDocument();
		const labelForRadioInput1 = container.querySelector(
			`[for='${radioInputProps.options[0].name}']`
		) as HTMLLabelElement;
		expect(labelForRadioInput1).toBeInTheDocument();
				const labelForRadioInput2 = container.querySelector(
			`[for='${radioInputProps.options[0].name}']`
		) as HTMLLabelElement;
		expect(labelForRadioInput2).toBeInTheDocument();
	});

	test('should select a radio input when clicked', () => {
		const { container } = render(RadioInput, {
			props: radioInputProps
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;
		const option2 = container.querySelector(
			"[data-cy-id='test-radio-input-1-input']"
		) as HTMLElement;

		option1.click();
		expect(option1).toBeChecked();

		option2.click();
		expect(option2).toBeChecked();
	});

	test('should dispatch an event when a radio input is blurred', async () => {
		const { container } = render(RadioInput, {
			props: radioInputProps
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;

		fireEvent.blur(option1);
		await tick();

		expect(option1).toBeChecked();
	});

	test('should have a default selected option', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, selectedOption: 'option3' }
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;
		const option2 = container.querySelector(
			"[data-cy-id='test-radio-input-1-input']"
		) as HTMLElement;
		const option3 = container.querySelector(
			"[data-cy-id='test-radio-input-2-input']"
		) as HTMLElement;

		expect(option1).not.toBeChecked();
		expect(option2).not.toBeChecked();
		expect(option3).toBeChecked();
	});

	test('should disable the radio inputs when disabled prop is true', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, isDisabled: true }
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;
		const option2 = container.querySelector(
			"[data-cy-id='test-radio-input-1-input']"
		) as HTMLElement;
		const option3 = container.querySelector(
			"[data-cy-id='test-radio-input-2-input']"
		) as HTMLElement;

		expect(option1).toBeDisabled();
		expect(option2).toBeDisabled();
		expect(option3).toBeDisabled();
	});

	test('should select when label is clicked', async () => {
		const { container } = render(RadioInput, {
			props: radioInputProps
		});

		const labelForRadioInput = container.querySelector(
			`[for='${radioInputProps.options[0].name}']`
		) as HTMLLabelElement;

		fireEvent.click(labelForRadioInput);
		await tick();
		const inputElement = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;

		expect(inputElement).toHaveClass('normal');
		expect(inputElement).toBeChecked();
	});

	test('should error class when input has error', async () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, inputError: 'Test Error' }
		});

		const inputElement = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;

		expect(inputElement).toHaveClass('error');
	});
});
