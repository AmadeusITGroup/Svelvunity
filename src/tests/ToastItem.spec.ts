import { render, fireEvent } from '@testing-library/svelte';
import ToastItem from '$lib/components/Toast/ToastItem.svelte';
import type { ComponentProps } from 'svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockPop } = vi.hoisted(() => ({
	mockPop: vi.fn()
}));

vi.mock('$lib/components/Toast/stores', () => {
	return {
		toast: {
			pop: mockPop
		}
	};
});

type Props = ComponentProps<typeof ToastItem>;

const renderItem = (props: Props) =>
	render(ToastItem, {
		props
	});

describe('ToastItem (single toast)', () => {
	beforeEach(() => {
		mockPop.mockClear();
	});
	const baseItem = {
		id: 1,
		initial: 0,
		next: 1,
		duration: 2000,
		pausable: true,
		dismissable: true,
		msg: 'Hello world',
		component: undefined,
		onpop: undefined
	};

	it('renders the message when no custom component is provided', () => {
		const { container } = renderItem({ item: { ...baseItem, component: undefined } });

		const msgDiv = container.querySelector('._toastMsg');
		expect(msgDiv).not.toBeNull();
		expect(msgDiv!.innerHTML).toContain('Hello world');
	});

	it('calls toast.pop when the dismiss button is clicked', async () => {
		const { container } = renderItem({ item: { ...baseItem, dismissable: true } });

		const button = container.querySelector('._toastBtn');
		expect(button).not.toBeNull();

		await fireEvent.click(button!);

		expect(mockPop).toHaveBeenCalledTimes(1);
		expect(mockPop).toHaveBeenCalledWith(baseItem.id);
	});

	it('calls toast.pop when pressing Enter/Space on the dismiss button', async () => {
		const { container } = renderItem({ item: { ...baseItem, dismissable: true } });

		const button = container.querySelector('._toastBtn');
		expect(button).not.toBeNull();

		await fireEvent.keyDown(button!, { key: 'Enter' });
		await fireEvent.keyDown(button!, { key: ' ' });

		expect(mockPop).toHaveBeenCalled();
		expect(mockPop).toHaveBeenCalledWith(baseItem.id);
	});

	it('calls item.onpop when the component is destroyed', () => {
		const onpop = vi.fn();
		const { unmount } = renderItem({
			item: { ...baseItem, onpop }
		});

		unmount();

		expect(onpop).toHaveBeenCalledTimes(1);
		expect(onpop).toHaveBeenCalledWith(baseItem.id);
	});

	it('does not render dismiss button when dismissable is false', () => {
		const { container } = renderItem({ item: { ...baseItem, dismissable: false } });

		expect(container.querySelector('._toastBtn')).toBeNull();
	});

	it('does not call close on non-Enter/Space keys on the dismiss button', async () => {
		const { container } = renderItem({ item: { ...baseItem, dismissable: true } });

		const button = container.querySelector('._toastBtn');
		await fireEvent.keyDown(button!, { key: 'a' });
		await fireEvent.keyDown(button!, { key: 'Escape' });

		expect(mockPop).not.toHaveBeenCalled();
	});

	it('renders a custom component when item.component.src is provided', () => {
		const SrcComponent = vi.fn(() => null);
		const { container } = renderItem({
			item: {
				...baseItem,
				component: {
					src: SrcComponent as any,
					props: { foo: 'bar' },
					sendIdTo: 'toastId'
				} as any
			}
		});

		expect(SrcComponent).toHaveBeenCalled();
		const msgDiv = container.querySelector('._toastMsg');
		expect(msgDiv?.innerHTML).not.toContain('Hello world');
	});

	it('passes props and sendIdTo onto the custom component', () => {
		const SrcComponent = vi.fn(() => null);
		renderItem({
			item: {
				...baseItem,
				component: {
					src: SrcComponent as any,
					props: { greeting: 'hi' },
					sendIdTo: 'toastId'
				} as any
			}
		});

		const callArgs = SrcComponent.mock.calls[0] as unknown as [unknown, Record<string, unknown>];
		const passedProps = callArgs[1];

		expect(passedProps).toMatchObject({ greeting: 'hi', toastId: baseItem.id });
	});

	it('omits sendIdTo key when not provided', () => {
		const SrcComponent = vi.fn(() => null);
		renderItem({
			item: {
				...baseItem,
				component: {
					src: SrcComponent as any,
					props: { greeting: 'hi' }
				} as any
			}
		});

		const callArgs = SrcComponent.mock.calls[0] as unknown as [unknown, Record<string, unknown>];
		const passedProps = callArgs[1];

		expect(passedProps).toMatchObject({ greeting: 'hi' });
		expect(passedProps).not.toHaveProperty('toastId');
	});

	it('does not pause on mouseenter when pausable is false', async () => {
		const { container } = renderItem({ item: { ...baseItem, pausable: false } });
		const toastItem = container.querySelector('._toastItem') as HTMLElement;

		expect(toastItem).not.toHaveClass('pe');

		await fireEvent.mouseEnter(toastItem);

		expect(mockPop).not.toHaveBeenCalled();
	});

	it('adds the pe class when pausable is true', () => {
		const { container } = renderItem({ item: { ...baseItem, pausable: true } });
		const toastItem = container.querySelector('._toastItem') as HTMLElement;

		expect(toastItem).toHaveClass('pe');
	});

	it('responds to mouseenter/mouseleave without throwing when pausable is true', async () => {
		const { container } = renderItem({ item: { ...baseItem, pausable: true } });
		const toastItem = container.querySelector('._toastItem') as HTMLElement;

		await expect(fireEvent.mouseEnter(toastItem)).resolves.toBeDefined();
		await expect(fireEvent.mouseLeave(toastItem)).resolves.toBeDefined();
	});

	it('registers and unregisters a visibilitychange listener on document', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const removeSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderItem({ item: baseItem });

		const added = addSpy.mock.calls.map((c) => c[0]);
		expect(added).toContain('visibilitychange');

		unmount();

		const removed = removeSpy.mock.calls.map((c) => c[0]);
		expect(removed).toContain('visibilitychange');

		addSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it('does not throw if no onpop function is provided on destroy', () => {
		const { unmount } = renderItem({ item: { ...baseItem, onpop: undefined } });
		expect(() => unmount()).not.toThrow();
	});
});
