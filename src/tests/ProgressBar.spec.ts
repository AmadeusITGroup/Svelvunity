import { render } from '@testing-library/svelte';
import { ProgressBar } from '$lib';

describe('ProgressBar', () => {
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

    test('badge position corresponds to progress value', () => {
        const { container } = render(ProgressBar, {
            props: { progressValue: 40 }
        });

        const badge = container.querySelector('.badge') as HTMLElement;
        const badgeStyle = window.getComputedStyle(badge);
        const leftPosition = parseInt(badgeStyle.left);

        expect(leftPosition).toBeCloseTo(40);
    });

    test('progress value does not go below zero', () => {
        const { getByRole } = render(ProgressBar, {
            props: { progressValue: -10 }
        });

        const progress = getByRole('progressbar') as HTMLProgressElement;
        expect(progress).toHaveAttribute('value', '0');
    });

    test('progress value updates correctly', async () => {
        const { component, getByRole } = render(ProgressBar, {
            props: { progressValue: 30 }
        });

        const progress = getByRole('progressbar') as HTMLProgressElement;
        expect(progress).toHaveAttribute('value', '30');

        await component.$set({ progressValue: 60 });
        expect(progress).toHaveAttribute('value', '60');
    });

    test('badge updates when progressValue changes', async () => {
        const { component, getByText } = render(ProgressBar, {
            props: { progressValue: 50 }
        });

        const badge = getByText('50%');
        expect(badge).toBeInTheDocument();

        await component.$set({ progressValue: 80 });
        const updatedBadge = getByText('80%');
        expect(updatedBadge).toBeInTheDocument();
    });
});