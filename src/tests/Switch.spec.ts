import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

import Switch from '../lib/components/Switch.svelte';

describe('Switch.svelte', () => {
	let randomSpy: ReturnType<typeof vi.spyOn>;
	beforeEach(() => {
		randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.42);
	});
	afterEach(() => {
		randomSpy.mockRestore();
	});

	it('renders with label and associates it via aria-labelledby', () => {
		const { getByRole, getByText } = render(Switch, {
			props: { label: 'Airplane mode', value: false }
		});

		const btn = getByRole('switch', { name: 'Airplane mode' });
		const labelEl = getByText('Airplane mode');

		expect(btn).toBeInTheDocument();
		expect(labelEl).toBeInTheDocument();
		expect(btn).toHaveAttribute('aria-labelledby', 'switch-42');
		expect(labelEl).toHaveAttribute('id', 'switch-42');
	});

	it('reflects initial props in ARIA and disabled state', () => {
		const { getByRole } = render(Switch, {
			props: { label: 'Wifi', value: true, disabled: false }
		});

		const btn = getByRole('switch', { name: 'Wifi' });
		expect(btn).toHaveAttribute('aria-checked', 'true');
		expect(btn).toHaveAttribute('aria-disabled', 'false');
		expect(btn).not.toBeDisabled();
	});

	it('applies inline fontSize on the wrapper', () => {
		const { getByRole } = render(Switch, {
			props: { label: 'Bluetooth', value: false, fontSize: 24 }
		});

		const btn = getByRole('switch', { name: 'Bluetooth' });
		const wrapper = btn.closest('.switch');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveStyle({ fontSize: '24px' });
	});

	it('toggles from false to true on click and calls toggle with !value', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(Switch, {
			props: { label: 'Location', value: false, toggle }
		});

		const btn = getByRole('switch', { name: 'Location' });

		await fireEvent.click(btn);

		expect(btn).toHaveAttribute('aria-checked', 'true');
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(toggle).toHaveBeenCalledWith(true);
	});

	it('toggles from true to false on click and calls toggle with !value', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(Switch, {
			props: { label: 'Hotspot', value: true, toggle }
		});

		const btn = getByRole('switch', { name: 'Hotspot' });

		await fireEvent.click(btn);

		expect(btn).toHaveAttribute('aria-checked', 'false');
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(toggle).toHaveBeenCalledWith(false);
	});

	it('supports keyboard activation via Space and Enter', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(Switch, {
			props: { label: 'Do Not Disturb', value: false, toggle }
		});

		const btn = getByRole('switch', { name: 'Do Not Disturb' });
		btn.focus();

		await fireEvent.keyDown(btn, { key: ' ', code: 'Space', charCode: 32 });
		await fireEvent.keyUp(btn, { key: ' ', code: 'Space', charCode: 32 });

		await fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
		await fireEvent.keyUp(btn, { key: 'Enter', code: 'Enter' });
	});

	it('does not toggle or call callback when disabled', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(Switch, {
			props: { label: 'NFC', value: false, toggle, disabled: true }
		});

		const btn = getByRole('switch', { name: 'NFC' });

		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute('aria-disabled', 'true');

		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-checked', 'false');
	});
});
