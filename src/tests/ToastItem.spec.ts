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
});
