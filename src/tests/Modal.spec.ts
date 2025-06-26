import { render, fireEvent } from '@testing-library/svelte';
import Modal from '$lib/components/Modal.svelte';

describe('Modal', () => {
	test('renders when open is true', () => {
		const { getByRole } = render(Modal, { open: true, title: 'Test Modal' });
		expect(getByRole('dialog')).toBeInTheDocument();
	});

	test('does not render when open is false', () => {
		const { queryByRole } = render(Modal, { open: false, title: 'Test Modal' });
		expect(queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('renders the title', () => {
		const { getByText } = render(Modal, { open: true, title: 'My Modal Title' });
		expect(getByText('My Modal Title')).toBeInTheDocument();
	});

	test('calls onClose when close icon is clicked', async () => {
		const onClose = vi.fn();
		const { getAllByRole } = render(Modal, { open: true, dismissable: true, onClose });
		const closeButtons = getAllByRole('button');
		await fireEvent.click(closeButtons[0]);
		expect(onClose).toHaveBeenCalled();
	});
});
