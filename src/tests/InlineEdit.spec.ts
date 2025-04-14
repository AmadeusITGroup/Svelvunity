import { render, fireEvent } from '@testing-library/svelte/svelte5';
import { describe, expect } from 'vitest';
import InlineEdit from '../lib/components/InlineEdit.svelte';

describe('InlineEdit Component', () => {
    test('should render correctly with default props', () => {
        const { getByText } = render(InlineEdit, { value: 'Test Value' });
        expect(getByText('Test Value')).toBeInTheDocument();
    });

    test('should enter edit mode when edit button is clicked', async () => {
        const { container } = render(InlineEdit, { value: 'Test Value' , classesForEditIcon:'edit-icon-class'});
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        expect(editIcon).toBeInTheDocument();
        await fireEvent.click(editIcon);
        expect(editIcon).not.toBeInTheDocument();
    });

    test('should submit new value when submit button is clicked', async () => {
        const { getByRole, container } = render(InlineEdit, { value: 'Test Value' , classesForEditIcon:'edit-icon-class',classesForSubmitIcon:'submit-icon-class'});
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        await fireEvent.click(editIcon);
        const input = getByRole('textbox');
        await fireEvent.input(input, { target: { value: 'New Value' } });
        const submitIcon = container.querySelector('.submit-icon-class') as HTMLElement;
        await fireEvent.click(submitIcon);
        expect(input).toHaveDisplayValue('New Value');
    });

    test('should restore original value when restore button is clicked', async () => {
        const { getByRole, container } = render(InlineEdit, { value: 'Test Value' , classesForEditIcon:'edit-icon-class',classesForRestoreIcon:'restore-icon-class'});
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        await fireEvent.click(editIcon);
        const input = getByRole('textbox');
        const restoreIcon = container.querySelector('.restore-icon-class') as HTMLElement;
        await fireEvent.click(restoreIcon);
        expect(input).toHaveDisplayValue('Test Value');
    });

    test('should submit value on Enter key press', async () => {
        const { getByRole,container } = render(InlineEdit, { value: 'Test Value' , classesForEditIcon:'edit-icon-class'});
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        expect(editIcon).toBeInTheDocument();
        await fireEvent.click(editIcon);
        const input = getByRole('textbox');
        await fireEvent.input(input, { target: { value: 'New Value' } });
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(input).toHaveDisplayValue('New Value');
    });

    test('should restore value on Escape key press', async () => {
        const { getByRole,container } = render(InlineEdit, { value: 'Test Value' , classesForEditIcon:'edit-icon-class'});
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        await fireEvent.click(editIcon);
        const input = getByRole('textbox');
        await fireEvent.keyDown(input, { key: 'Escape' });
        expect(input).toHaveDisplayValue('Test Value');
    });
});