import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, vi } from 'vitest';
import Select from '$lib/components/Select.svelte';
import type { ComponentProps } from 'svelte';

let selectOptions: ComponentProps<typeof Select> = getSelectOptions();

function getSelectOptions() {
	return {
		labelName: 'Test Label',
		inputName: 'test-select',
		options: [
			{ id: '1', value: 'Option 1' },
			{ id: '2', value: 'Option 2' }
		],
		placeholder: 'Select an option',
		testId: 'my-select'
	};
}

beforeEach(() => {
	selectOptions = getSelectOptions();
});

describe('Select Component', () => {
	test('should render label, options, and placeholder', () => {
		const { getByLabelText, getByText } = render(Select, selectOptions);

		expect(getByLabelText('Test Label')).toBeInTheDocument();
		expect(getByText('Option 1')).toBeInTheDocument();
		expect(getByText('Option 2')).toBeInTheDocument();
		expect(getByText('Select an option')).toBeInTheDocument();
	});

	test('should be rendered with disabled property', () => {
		selectOptions.isDisabled = true;
		const { getByLabelText, getByText } = render(Select, selectOptions);

		expect(getByLabelText('Test Label')).toBeInTheDocument();
		expect(getByText('Option 1')).toBeInTheDocument();
		expect(getByText('Option 2')).toBeInTheDocument();
		expect(getByText('Select an option')).toBeInTheDocument();
	});

	test('should call onSelectChange when value changes', async () => {
		const onSelectChange = vi.fn();
		selectOptions.onSelectChange = onSelectChange;
		const { getByLabelText } = render(Select, selectOptions);

		const select = getByLabelText('Test Label');
		await fireEvent.change(select, { target: { value: '2' } });

		expect(onSelectChange).toHaveBeenCalled();
	});

	test('should call onInputBlur when blurred', async () => {
		const onInputBlur = vi.fn();
		selectOptions.onInputBlur = onInputBlur;
		const { getByLabelText } = render(Select, selectOptions);

		const select = getByLabelText('Test Label');
		await fireEvent.blur(select);

		expect(onInputBlur).toHaveBeenCalled();
	});

	test('should show error message when inputError is set', () => {
		selectOptions.inputError = 'This is an error';
		const { getByText } = render(Select, selectOptions);

		expect(getByText('This is an error')).toBeInTheDocument();
	});
});
