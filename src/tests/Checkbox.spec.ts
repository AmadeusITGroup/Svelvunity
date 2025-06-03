import { Checkbox } from '$lib';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick, type ComponentProps } from 'svelte';

let checkBoxOptions: ComponentProps<typeof Checkbox> = getCheckBoxOptions();

function getCheckBoxOptions () {
	return {
			classes: 'test-class',
			classesForInput: 'test1 test2',
			classesForLabel: 'test3 test4',
			labelName: 'label-name',
			inputId: 'checkbox-id',
			id: 'input-id',
			required: true,
			inputValue: true,
			testId: 'test-checkbox',
			onInputChange: undefined
	};
} 

beforeEach(() => {
	checkBoxOptions = getCheckBoxOptions();
});

describe('Checkbox Component', () => {
	test('should render a checkbox', async () => {
		const onInputChangeHandler = vi.fn();
		checkBoxOptions.onInputChange = onInputChangeHandler;
		const { container } = render(Checkbox, checkBoxOptions);
		const wrapper = container.getElementsByClassName('checkbox-wrapper')[0] as HTMLLabelElement;
		const labelForInput = container.getElementsByClassName('input-label')[0] as HTMLLabelElement;
		await fireEvent.click(labelForInput);

		expect(labelForInput).toHaveTextContent(`${checkBoxOptions.labelName}`);
		expect(wrapper).toBeInTheDocument();
		expect(onInputChangeHandler).toHaveBeenCalled();
	});

	test('should render a disabled checkbox', async () => {
		checkBoxOptions.inputValue = false;
		checkBoxOptions.isDisabled = true;
		const { container } = render(Checkbox, checkBoxOptions);
		const inputElement = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(inputElement).toBeDisabled();
		expect(inputElement).toHaveProperty('checked', false);
	});

	test('should have false value after clicking', async () => {
		const { container } = render(Checkbox, checkBoxOptions);
		const inputCheckbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(inputCheckbox).toBeChecked();
		await fireEvent.click(inputCheckbox);
		await tick();
		expect(inputCheckbox).not.toBeChecked();
	});

	test('should render a input type as checkbox', async () => {
		const onInputChangeHandler = vi.fn();
		checkBoxOptions.onInputChange = onInputChangeHandler;
		const { container } = render(Checkbox, checkBoxOptions);
		const input = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(input).toHaveAttribute('type', 'checkbox');
		expect(onInputChangeHandler).not.toHaveBeenCalled();
	});

	test('should render the checkbox with the provided label and value', () => {
		checkBoxOptions.labelName = 'Label';
		checkBoxOptions.inputValue = true;
		checkBoxOptions.testId = 'test-checkbox';

		render(Checkbox, checkBoxOptions);

		const labelElement = screen.getByText('Label');
		const inputElement = screen.getByRole('checkbox');

		checkBoxOptions.classesForLabel?.split(' ').forEach((cls) => {
  		  expect(labelElement.classList.contains(cls)).toBe(true);
  		});

		checkBoxOptions.classesForInput?.split(' ').forEach((cls) => {
  		  expect(inputElement.classList.contains(cls)).toBe(true);
  		});

		expect(labelElement).toBeInTheDocument();
		expect(inputElement).toHaveProperty('checked', true);
		expect(labelElement.getAttribute('for')).toBe(checkBoxOptions.inputId);
 		expect(labelElement.textContent).toBe(checkBoxOptions.labelName);
	});
});
