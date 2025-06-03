import { Checkbox } from '$lib';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick, type ComponentProps } from 'svelte';

let checkBoxOptions: ComponentProps<typeof Checkbox> = getCheckBoxOptions();

function getCheckBoxOptions () {
	return {
			classes: 'test-class-1 test-class-2',
			classesForInput: 'test1 test2',
			classesForLabel: 'test3 test4',
			labelName: 'label-name',
			inputId: 'checkbox-id',
			id: 'input-id',
			required: true,
			inputValue: true,
			testId: 'test-checkbox',
			onInputChange: undefined,
			isDisabled: false
	};
} 

beforeEach(() => {
	checkBoxOptions = getCheckBoxOptions();
});

describe('Checkbox Component', () => {
	test('should render a checkbox', async () => {
		const onInputChangeHandler = vi.fn();
		checkBoxOptions.labelName = 'Label';
		checkBoxOptions.onInputChange = onInputChangeHandler;
		const { container } = render(Checkbox, checkBoxOptions);
		const wrapper = container.getElementsByClassName('checkbox-wrapper')[0] as HTMLLabelElement;
		const inputLabel = screen.getByText('Label');
		const checkbox = screen.getByRole('checkbox');
		
		await fireEvent.click(inputLabel);

		expect(wrapper).toBeInTheDocument();
		expect(checkbox).toBeInTheDocument();
		expect(inputLabel).toHaveTextContent(`${checkBoxOptions.labelName}`);
		expect(checkbox).toHaveAttribute('data-cy-id', checkBoxOptions.testId);
		expect(checkbox).toHaveAttribute('aria-label', checkBoxOptions.labelName);
		expect(checkbox).toHaveAttribute('type', 'checkbox');

		checkBoxOptions.classes?.split(' ').forEach((cls) => {
  		  expect(wrapper.classList.contains(cls)).toBe(true);
  		});

		expect(onInputChangeHandler).toHaveBeenCalled();
	});

	test('should render a disabled checkbox', async () => {
		checkBoxOptions.inputValue = false;
		checkBoxOptions.isDisabled = true;
		const { container } = render(Checkbox, checkBoxOptions);
		const checkbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(checkbox).toBeDisabled();
		expect(checkbox).toHaveAttribute('disabled', '');
		expect(checkbox).toHaveProperty('checked', false);
	});

	test('should have false value after clicking', async () => {
		const { container } = render(Checkbox, checkBoxOptions);
		const checkbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(checkbox).toBeChecked();
		await fireEvent.click(checkbox);
		await tick();
		expect(checkbox).not.toBeChecked();
	});

	test('should render a input type as checkbox', async () => {
		const onInputChangeHandler = vi.fn();
		checkBoxOptions.onInputChange = onInputChangeHandler;
		const { container } = render(Checkbox, checkBoxOptions);
		const checkbox = container.getElementsByClassName('input-checkbox')[0] as HTMLElement;

		expect(checkbox).toHaveAttribute('type', 'checkbox');
		expect(onInputChangeHandler).not.toHaveBeenCalled();
	});

	test('should render the checkbox with the provided label and value', () => {
		checkBoxOptions.labelName = 'Label';
		checkBoxOptions.inputValue = true;
		checkBoxOptions.testId = 'test-checkbox';

		render(Checkbox, checkBoxOptions);

		const checkboxLabel = screen.getByText('Label');
		const checkbox = screen.getByRole('checkbox');

		checkBoxOptions.classesForLabel?.split(' ').forEach((cls) => {
  		  expect(checkboxLabel.classList.contains(cls)).toBe(true);
  		});

		checkBoxOptions.classesForInput?.split(' ').forEach((cls) => {
  		  expect(checkbox.classList.contains(cls)).toBe(true);
  		});

		expect(checkboxLabel).toBeInTheDocument();
		expect(checkbox).toHaveProperty('checked', true);
		expect(checkboxLabel.getAttribute('for')).toBe(checkBoxOptions.inputId);
 		expect(checkboxLabel.textContent).toBe(checkBoxOptions.labelName);
	});
});
