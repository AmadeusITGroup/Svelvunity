import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';

import { InputTypes } from '../lib/enums/inputtypes.enum';
import { Input } from '$lib';

describe('Input Component', () => {
	let inputProps = {
		classes: 'test-class',
		classesForInput: 'test-class-for-input',
		labelName: 'label-name',
		inputName: 'input-name',
		inputError: '',
		inputValue: 'input-value',
		placeholder: 'placeholder',
		min: '',
		max: '',
		type: InputTypes.Text,
		extraSign: '',
		required: false,
		isReadOnly: false,
		isDisabled: false,
		textareaInput: false,
		testId: 'test-input'
	};

	beforeEach(() => {
		inputProps = {
			classes: 'test-class',
			classesForInput: 'test-class-for-input',
			labelName: 'label-name',
			inputName: 'input-name',
			inputError: '',
			inputValue: 'input-value',
			placeholder: 'placeholder',
			min: '',
			max: '',
			type: InputTypes.Text,
			extraSign: '',
			required: false,
			isReadOnly: false,
			isDisabled: false,
			textareaInput: false,
			testId: 'test-input'
		};
	});

	test('should render an input with all default props', async () => {
		const { container } = render(Input, { props: inputProps });
		const labelForInput = container.querySelector("[for='input-name']") as HTMLLabelElement;
		const outerDiv = container.querySelector('.test-class') as HTMLDivElement;
		const errorDiv = container.querySelector("[data-cy-id='errormessage']") as HTMLDivElement;

		expect(outerDiv).toBeInTheDocument();
		expect(outerDiv).toHaveClass('test-class');
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toBeInTheDocument();
		expect(labelForInput).toBeInTheDocument();
		expect(labelForInput).toHaveTextContent(inputProps.labelName);
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveValue('input-value');
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveClass('test-class-for-input');
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveAttribute(
			'placeholder',
			'placeholder'
		);
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveAttribute('type', 'text');
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveAttribute(
			'name',
			'input-name'
		);
		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveAttribute(
			'data-cy-id',
			'test-input'
		);

		expect(errorDiv).toBeInTheDocument();
		expect(errorDiv).toContainHTML('');
	});

	test('should render a required input', async () => {
		const { container } = render(Input, { props: { ...inputProps, required: true } });
		const labelForInput = container.querySelector("[for='input-name']") as HTMLLabelElement;

		expect(labelForInput).toHaveTextContent(`${inputProps.labelName}*`);
	});

	test('should render a read-only input', async () => {
		render(Input, { props: { ...inputProps, isReadOnly: true } });

		expect(screen.getByPlaceholderText(inputProps.placeholder)).toHaveAttribute('readonly', '');
	});

	test('should render a disabled input', async () => {
		render(Input, { props: { ...inputProps, isDisabled: true } });

		expect(screen.getByPlaceholderText(inputProps.placeholder)).toBeDisabled();
	});

	test('should render an input with extra sign', async () => {
		render(Input, { props: inputProps });

		const { container } = render(Input, { props: { ...inputProps, extraSign: '$' } });
		const extraSignDiv = container.querySelector('absolute bottom-2 z-50 left-1') as HTMLDivElement;

		waitFor(() => expect(extraSignDiv).toBeInTheDocument());
	});

	test('should render a numeric input', async () => {
		render(Input, { props: { ...inputProps, type: InputTypes.Number } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).toHaveAttribute('type', 'number');
	});

	test('should render a input without label', async () => {
		render(Input, { props: { ...inputProps, labelName: '' } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).not.toHaveClass('svelvunity-input--wrapper-padding');
	});

	test('should render a textareaInput', async () => {
		render(Input, { props: { ...inputProps, textareaInput: true } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).not.toHaveClass('svelvunity-input--field-error-border');
	});

	test('should render a textareaInput with error', async () => {
		render(Input, { props: { ...inputProps, textareaInput: true, inputError: 'error' } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).toHaveClass('svelvunity-input--field-error-border');
	});

	test('should correctly bind value to textareaInput', async () => {
		render(Input, { props: { ...inputProps, textareaInput: true } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		fireEvent.change(input, { target: { value: 'test value' } });
		await tick();

		expect(input.value).toEqual('test value');
	});

	test('should correctly bind value to textareaInput with input event', async () => {
		render(Input, { props: { ...inputProps, textareaInput: true } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		fireEvent.input(input, { target: { value: 'test value' } });
		await tick();

		expect(input.value).toEqual('test value');
	});

	test('should correctly bind value to textareaInput when it is blured', async () => {
		render(Input, { props: { ...inputProps, textareaInput: true } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		fireEvent.blur(input, { target: { value: 'test value' } });
		await tick();

		expect(input.value).toEqual('test value');
	});

	test('should render a numeric input with min value', async () => {
		render(Input, { props: { ...inputProps, type: InputTypes.Number, min: '2' } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).toHaveAttribute('min', '2');
	});

	test('should render a numeric input with max value', async () => {
		render(Input, { props: { ...inputProps, type: InputTypes.Number, max: '2' } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).toHaveAttribute('max', '2');
	});

	test('should render a numeric input with min & max value', async () => {
		render(Input, { props: { ...inputProps, type: InputTypes.Number, min: '0', max: '10' } });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('max', '10');
	});

	test('should render an error message', async () => {
		inputProps.inputError = 'Error Test!';
		render(Input, { props: inputProps });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;
		const errorDiv = document.querySelector("[data-cy-id='errormessage']") as HTMLDivElement;

		expect(input).toBeInTheDocument();
		expect(errorDiv).toBeInTheDocument();
		expect(errorDiv).toContainHTML('Error Test!');
	});

	test('should correctly bind value', async () => {
		render(Input, { props: inputProps });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		fireEvent.change(input, { target: { value: 'test value' } });
		await tick();

		expect(input.value).toEqual('test value');
	});

	test('should correctly bind value with input event', async () => {
		render(Input, { props: inputProps });
		const input = screen.getByPlaceholderText(inputProps.placeholder) as HTMLInputElement;

		fireEvent.input(input, { target: { value: 'test value' } });
		await tick();

		expect(input.value).toEqual('test value');
	});
});
