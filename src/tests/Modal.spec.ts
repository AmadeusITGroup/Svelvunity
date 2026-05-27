import { render, fireEvent, createEvent } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Modal from '$lib/components/Modal.svelte';
import { Position } from '$lib/enums/position.enum';
import { Size } from '$lib/enums/size.enum';

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

	test.each([
		[Position.TopLeft, 'modal--top-left'],
		[Position.TopCenter, 'modal--top-center'],
		[Position.TopRight, 'modal--top-right'],
		[Position.CenterLeft, 'modal--center-left'],
		[Position.Center, 'modal--center'],
		[Position.CenterRight, 'modal--center-right'],
		[Position.BottomLeft, 'modal--bottom-left'],
		[Position.BottomCenter, 'modal--bottom-center'],
		[Position.BottomRight, 'modal--bottom-right']
	])('applies "%s" position class -> %s', (position, expectedClass) => {
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Positioned',
			position
		});

		expect(getByRole('dialog')).toHaveClass(expectedClass);
	});

	test.each([
		[Size.XSmall, 'modal-xs'],
		[Size.Small, 'modal-sm'],
		[Size.Medium, 'modal-md'],
		[Size.Large, 'modal-lg'],
		[Size.XLarge, 'modal-xl']
	])('applies "%s" size class -> %s', (size, expectedClass) => {
		const { container } = render(Modal, {
			open: true,
			title: 'Sized',
			size
		});

		const content = container.querySelector('.modal-content') as HTMLElement;
		expect(content).toHaveClass(expectedClass);
	});

	test('Escape key closes modal when dismissable is true', async () => {
		const onClose = vi.fn();
		const { getByRole, queryByRole } = render(Modal, {
			open: true,
			title: 'Escapable',
			dismissable: true,
			onClose
		});

		await fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });

		expect(queryByRole('dialog')).not.toBeInTheDocument();
		expect(onClose).toHaveBeenCalled();
	});

	test('Escape key is ignored when dismissable is false', async () => {
		const onClose = vi.fn();
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Locked',
			dismissable: false,
			onClose
		});

		await fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });

		expect(getByRole('dialog')).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	test('non-Escape key does nothing', async () => {
		const onClose = vi.fn();
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Test',
			dismissable: true,
			onClose
		});

		await fireEvent.keyDown(getByRole('dialog'), { key: 'Enter' });

		expect(getByRole('dialog')).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	test('autoclose hides modal when clicking on a child button', async () => {
		const onClose = vi.fn();
		const children = createRawSnippet(() => ({
			render: () => `<button data-cy-id="inner-btn">Click me</button>`
		}));

		const { container, queryByRole } = render(Modal, {
			open: true,
			title: 'AutoClose',
			autoclose: true,
			onClose,
			children
		});

		const innerBtn = container.querySelector("[data-cy-id='inner-btn']") as HTMLElement;
		await fireEvent.click(innerBtn);

		expect(queryByRole('dialog')).not.toBeInTheDocument();
		expect(onClose).toHaveBeenCalled();
	});

	test('autoclose does not hide modal when clicking a non-button child', async () => {
		const onClose = vi.fn();
		const children = createRawSnippet(() => ({
			render: () => `<span data-cy-id="inner-span">Click me</span>`
		}));

		const { container, getByRole } = render(Modal, {
			open: true,
			title: 'AutoClose',
			autoclose: true,
			onClose,
			children
		});

		const innerSpan = container.querySelector("[data-cy-id='inner-span']") as HTMLElement;
		await fireEvent.click(innerSpan);

		expect(getByRole('dialog')).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	test('does not render close icon when dismissable is false', () => {
		const { container } = render(Modal, {
			open: true,
			title: 'NoDismiss',
			dismissable: false
		});

		expect(container.querySelector('.modal-close-icon')).not.toBeInTheDocument();
	});

	test('renders the modal close icon in the body when no header/title and dismissable is true', () => {
		const { container } = render(Modal, {
			open: true,
			dismissable: true,
			title: ''
		});

		const body = container.querySelector('.modal-body') as HTMLElement;
		expect(body).toBeInTheDocument();
		expect(body.querySelector('.modal-close-icon')).toBeInTheDocument();
	});

	test('renders footerSnippet inside modal-footer', () => {
		const footerSnippet = createRawSnippet(() => ({
			render: () => `<div data-cy-id="footer-content">Footer here</div>`
		}));

		const { container } = render(Modal, {
			open: true,
			title: 'WithFooter',
			footerSnippet
		});

		const footerEl = container.querySelector("[data-cy-id='footer-content']") as HTMLElement;
		expect(footerEl).toBeInTheDocument();
		expect(footerEl).toHaveTextContent('Footer here');
	});

	test('applies frameClasses, backdropClasses and modalClasses', () => {
		const { container, getByRole } = render(Modal, {
			open: true,
			title: 'Custom',
			frameClasses: 'frame-custom',
			backdropClasses: 'backdrop-custom',
			modalClasses: 'modal-custom'
		});

		expect(container.querySelector('.modal-backdrop')).toHaveClass('backdrop-custom');
		expect(getByRole('dialog')).toHaveClass('modal-custom');
	});

	test('forwards extraModalProps onto the dialog element', () => {
		const { getByRole } = render(Modal, {
			open: true,
			title: 'Extra',
			extraModalProps: { 'data-cy-id': 'modal-x', 'data-test': 'extra' }
		});

		const dialog = getByRole('dialog');
		expect(dialog).toHaveAttribute('data-cy-id', 'modal-x');
		expect(dialog).toHaveAttribute('data-test', 'extra');
	});

	test('does not render header section when no title and no headerSnippet', () => {
		const { container } = render(Modal, {
			open: true,
			title: '',
			dismissable: false
		});

		expect(container.querySelector('.modal-header')).not.toBeInTheDocument();
	});

	test('renders headerSnippet inside the header even when title is empty', () => {
		const headerSnippet = createRawSnippet(() => ({
			render: () => `<span data-cy-id="custom-header">Hello header</span>`
		}));

		const { container } = render(Modal, {
			open: true,
			title: '',
			headerSnippet
		});

		expect(container.querySelector("[data-cy-id='custom-header']")).toBeInTheDocument();
	});

	test('does not call onClose when opening (false -> true transition)', async () => {
		const onClose = vi.fn();
		const { rerender } = render(Modal, {
			open: false,
			title: 'Reopen',
			onClose
		});

		expect(onClose).not.toHaveBeenCalled();

		await rerender({ open: true, title: 'Reopen', onClose });

		expect(onClose).not.toHaveBeenCalled();
	});
});
