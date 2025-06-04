import { render, fireEvent } from '@testing-library/svelte';
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

    test('should call restore function when restore button is clicked', async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
        const { getByRole, container } = render(InlineEdit, { value: 'Test Value', classesForEditIcon: 'edit-icon-class', classesForRestoreIcon: 'restore-icon-class', onRestore: () => alert('Restore') });
        
        // Enter edit mode
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        await fireEvent.click(editIcon);
        
        // Change the input value
        const input = getByRole('textbox') as HTMLInputElement;
        await fireEvent.input(input, { target: { value: 'New Value' } });
        
        // Click restore button
        const restoreIcon = container.querySelector('.restore-icon-class') as HTMLElement;
        expect(restoreIcon).toBeInTheDocument();
        await fireEvent.click(restoreIcon);
    
        // Check if alert was called
        expect(alertMock).toHaveBeenCalledWith('Restore');
    
    
        // Restore the original alert implementation
        alertMock.mockRestore();
    });

    test('should call restore function when restore button is clicked', async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
        const { getByRole, container } = render(InlineEdit, { value: 'Test Value', classesForEditIcon: 'edit-icon-class', onRestore: () => alert('Restore') });
        
        // Enter edit mode
        const editIcon = container.querySelector('.edit-icon-class') as HTMLElement;
        await fireEvent.click(editIcon);
        
        // Change the input value
        const input = getByRole('textbox') as HTMLInputElement;
        await fireEvent.input(input, { target: { value: 'New Value' } });
        
        await fireEvent.keyDown(input, { key: 'Escape' });
    
        // Check if alert was called
        expect(alertMock).toHaveBeenCalledWith('Restore');
    
        // Restore the original alert implementation
        alertMock.mockRestore();
    });
});