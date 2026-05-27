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

	test('should render a group label when labelText is provided', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, labelText: 'Pick one' }
		});

		const groupLabel = container.querySelector(
			`label[for='${radioInputProps.inputName}']`
		) as HTMLLabelElement;

		expect(groupLabel).toBeInTheDocument();
		expect(groupLabel).toHaveTextContent('Pick one');
	});

	test('should not render a group label when labelText is empty', () => {
		const { container } = render(RadioInput, { props: radioInputProps });

		const groupLabel = container.querySelector(`label[for='${radioInputProps.inputName}']`);

		expect(groupLabel).not.toBeInTheDocument();
	});

	test('should append asterisk to group label when isRequired is true', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, labelText: 'Pick one', isRequired: true }
		});

		const groupLabel = container.querySelector(
			`label[for='${radioInputProps.inputName}']`
		) as HTMLLabelElement;

		expect(groupLabel).toHaveTextContent('Pick one*');
	});

	test('should mark inputs as required when isRequired is true', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, isRequired: true }
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLInputElement;

		expect(option1).toBeRequired();
	});

	test('should set aria-required on the wrappers when isRequired is true', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, isRequired: true }
		});

		const wrappers = container.querySelectorAll('[role="textbox"]');

		expect(wrappers.length).toBeGreaterThan(0);
		wrappers.forEach((wrapper) => {
			expect(wrapper).toHaveAttribute('aria-required', 'true');
		});
	});

	test('should apply input-cursor-disabled class to inputs and labels when disabled', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, isDisabled: true }
		});

		const option1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-input']"
		) as HTMLElement;
		const label1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-label']"
		) as HTMLElement;

		expect(option1).toHaveClass('input-cursor-disabled');
		expect(label1).toHaveClass('input-cursor-disabled');
	});

	test('should apply error class to labels when inputError is set', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, inputError: 'Required' }
		});

		const label1 = container.querySelector(
			"[data-cy-id='test-radio-input-0-label']"
		) as HTMLElement;

		expect(label1).toHaveClass('error');
	});

	test('should render the error message in the error wrapper', () => {
		const { container } = render(RadioInput, {
			props: { ...radioInputProps, inputError: 'This field is required' }
		});

		const errorWrapper = container.querySelector("[data-cy-id='errormessage']") as HTMLElement;

		expect(errorWrapper).toHaveTextContent('This field is required');
	});

	test('should invoke onOptionSelected via effect on mount with the initial selectedOption', () => {
		const onOptionSelected = vi.fn();
		render(RadioInput, {
			props: { ...radioInputProps, onOptionSelected, selectedOption: 'option2' }
		});

		expect(onOptionSelected).toHaveBeenCalled();
		expect(onOptionSelected).toHaveBeenCalledWith('option2');
	});

	test('should apply classesForRadioGroup, classesForInput, classesForInputLabel, classesForLabel and classesForError', () => {
		const { container } = render(RadioInput, {
			props: {
				...radioInputProps,
				labelText: 'Choose',
				classesForRadioGroup: 'custom-group',
				classesForInput: 'custom-input',
				classesForInputLabel: 'custom-input-label',
				classesForLabel: 'custom-group-label',
				classesForError: 'custom-error'
			}
		});

		expect(container.querySelector('[role="radiogroup"]')).toHaveClass('custom-group');
		expect(container.querySelector("[data-cy-id='test-radio-input-0-input']")).toHaveClass(
			'custom-input'
		);
		expect(container.querySelector("[data-cy-id='test-radio-input-0-label']")).toHaveClass(
			'custom-input-label'
		);
		expect(container.querySelector(`label[for='${radioInputProps.inputName}']`)).toHaveClass(
			'custom-group-label'
		);
		expect(container.querySelector("[data-cy-id='errormessage']")).toHaveClass('custom-error');
	});
});
