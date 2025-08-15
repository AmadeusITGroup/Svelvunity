import { render, fireEvent, createEvent } from '@testing-library/svelte';
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

	test('backdrop dialog surface mousedown hides when outsideclose is true', async () => {
		const onClose = vi.fn();
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Test Modal',
			outsideclose: true,
			onClose
		});

		const dialog = getByRole('dialog');

		const evt = createEvent.mouseDown(dialog);
		await fireEvent(dialog, evt);

		expect(onClose).toHaveBeenCalled();
	});

	test('backdrop dialog surface mousedown prevents default and does not close when outsideclose is false', async () => {
		const onClose = vi.fn();
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Test Modal',
			outsideclose: false,
			onClose
		});

		const dialog = getByRole('dialog');

		const evt = createEvent.mouseDown(dialog);
		evt.preventDefault = vi.fn();

		await fireEvent(dialog, evt);

		expect(evt.preventDefault).toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	test('mousedown inside modal content does not trigger outside close', async () => {
		const onClose = vi.fn();
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Inner Content',
			outsideclose: true,
			onClose
		});

		const content = getByRole('document');

		await fireEvent.mouseDown(content);

		expect(onClose).not.toHaveBeenCalled();
	});

	test('clicking the close icon calls onClose and hides the modal', async () => {
		const onClose = vi.fn();
		const { container, queryByRole } = render(Modal, {
			open: true,
			title: 'Update Comment',
			dismissable: true,
			onClose
		});

		const closeIcon = container.querySelector('.modal-close-icon') as HTMLElement;
		expect(closeIcon).toBeTruthy();

		await fireEvent.click(closeIcon);

		expect(onClose).toHaveBeenCalledTimes(2);
		expect(queryByRole('dialog')).not.toBeInTheDocument();
	});
});
