import { render } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import { ProgressBar } from '$lib';
describe('ProgressBar Component', () => {
    test('renders progress bar with initial value', () => {
        const { getByRole } = render(ProgressBar, {
            props: { progressValue: 50 }
        });

        const progress = getByRole('progressbar') as HTMLProgressElement;
        expect(progress).toHaveAttribute('value', '50');
        expect(progress).toHaveAttribute('max', '100');
    });

    test('renders progress badge with correct percentage value', () => {
        const { getByText } = render(ProgressBar, {
            props: { progressValue: 75 }
        });

        const badge = getByText('75%');
        expect(badge).toBeInTheDocument();
    });

    test('badge is positioned correctly according to progressValue', () => {
        const { container } = render(ProgressBar, {
            props: { progressValue: 40 }
        });

        const badge = container.querySelector('.badge') as HTMLSpanElement;
        expect(badge).not.toBeNull();
        expect(badge.style.left).toBe('40%');
    });
    
    test.each([
        { progressValue: -10, expected: '0' },
        { progressValue: 0, expected: '0' },
        { progressValue: 50, expected: '50' },
        { progressValue: 100, expected: '100' },
        { progressValue: 150, expected: '100' },
    ])('renders progress bar with correct value', ({ progressValue, expected }) => {
        const { getByRole } = render(ProgressBar, { progressValue });
        const progress = getByRole('progressbar');
        expect(progress).toHaveAttribute('value', expected);
    });
});