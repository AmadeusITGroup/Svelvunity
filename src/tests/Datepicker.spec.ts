import { render, screen, fireEvent } from '@testing-library/svelte';
import Datepicker from '../lib/components/Datepicker.svelte';

const baseToday = new Date(2024, 5, 15); // 15 June 2024

function findDateButtonByDay(day: number | string) {
    const dayText = String(day);
    const spans = Array.from(document.querySelectorAll('.date span'));
    for (const s of spans) {
        if (s.textContent?.trim() === dayText) {
            return s.closest('.date') as HTMLElement | null;
        }
    }
    return null;
}

describe('Datepicker.svelte — full behaviour', () => {
    test('renders open calendar with correct month/year', () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true
            }
        });

        expect(screen.getByText('June 2024')).toBeInTheDocument();
        expect(document.querySelector('.calendar-card.show')).toBeTruthy();
    });

    test('next/previous month navigation via click and Enter key', async () => {
        const { container } = render(Datepicker, {
            props: { today: baseToday, defaultYear: 2024, defaultMonth: 5, isOpen: true }
        });

        const next = container.getElementsByClassName('icon-next-month')[0] as HTMLElement;
        const prev = container.getElementsByClassName('icon-previous-month')[0] as HTMLElement;

        await fireEvent.click(next);
        expect(screen.getByText('July 2024')).toBeInTheDocument();

        await fireEvent.keyDown(prev, { key: 'Enter' });
        expect(screen.getByText('June 2024')).toBeInTheDocument();
    });

    test('month wrap-around updates year correctly', async () => {
        const { container } = render(Datepicker, {
            props: { today: new Date(2024, 11, 1), defaultYear: 2024, defaultMonth: 11, isOpen: true }
        });

        const next = container.getElementsByClassName('icon-next-month')[0] as HTMLElement;
        await fireEvent.click(next);
        expect(screen.getByText('January 2025')).toBeInTheDocument();

        const prev = container.getElementsByClassName('icon-previous-month')[0] as HTMLElement;
        await fireEvent.click(prev);
        expect(screen.getByText('December 2024')).toBeInTheDocument();
    });

    test('showYears renders year controls and they change year', async () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                showYears: true,
                ariaLabelNextYear: 'next-year',
                ariaLabelPreviousYear: 'prev-year'
            }
        });

        const inc = screen.getByLabelText('next-year');
        const dec = screen.getByLabelText('prev-year');

        await fireEvent.click(inc);
        expect(screen.getByText('June 2025')).toBeInTheDocument();

        await fireEvent.click(dec);
        expect(screen.getByText('June 2024')).toBeInTheDocument();
    });

    test('selecting an enabled date closes calendar when alwaysShow is false', async () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                alwaysShow: false
            }
        });

        const btn = findDateButtonByDay(15);
        expect(btn).toBeTruthy();
        await fireEvent.click(btn as Element);
        expect(document.querySelector('.calendar-card.show')).toBeNull();
    });

    test('selecting a date does NOT close when alwaysShow is true', async () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                alwaysShow: true
            }
        });

        const btn = findDateButtonByDay(15);
        expect(btn).toBeTruthy();
        await fireEvent.click(btn as Element);
        expect(document.querySelector('.calendar-card.show')).toBeTruthy();
    });

    test('disabledDates marks day disabled and clicking it does NOT close calendar', async () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                disabledDates: ['2024-06-05']
            }
        });

        const btn = findDateButtonByDay(5);
        expect(btn).toBeTruthy();
        expect(btn!.classList.contains('disabled')).toBe(true);

        await fireEvent.click(btn as Element);
        // clicking disabled should not close calendar
        expect(document.querySelector('.calendar-card.show')).toBeTruthy();
    });

    test('enabledDates keeps specified day enabled', () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                enabledDates: ['2024-06-05']
            }
        });

        const btn = findDateButtonByDay(5);
        expect(btn).toBeTruthy();
        expect(btn!.classList.contains('disabled')).toBe(false);
    });

    test('disableDatesBefore applies "past" class to earlier dates', () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                disableDatesBefore: '2024-06-10'
            }
        });

        const beforeBtn = findDateButtonByDay(5);
        expect(beforeBtn).toBeTruthy();
        expect(beforeBtn!.classList.contains('past')).toBe(true);
    });

    test('disableDatesAfter applies "future" class to later dates', () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                disableDatesAfter: '2024-06-20'
            }
        });

        const afterBtn = findDateButtonByDay(25);
        expect(afterBtn).toBeTruthy();
        expect(afterBtn!.classList.contains('future')).toBe(true);
    });

    test('today is marked with "today" class', () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true
            }
        });

        const todayBtn = findDateButtonByDay(15);
        expect(todayBtn).toBeTruthy();
        expect(todayBtn!.classList.contains('today')).toBe(true);
    });

    test('selectedDate produces range/start/end classes for that day', () => {
        const selectedTimestamp = new Date(2024, 5, 15).getTime();
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                selectedDate: selectedTimestamp
            }
        });

        const btn = findDateButtonByDay(15);
        expect(btn).toBeTruthy();
        // selected date should have range/start/end classes (single-date range)
        expect(btn!.classList.contains('range')).toBe(true);
        expect(btn!.classList.contains('start')).toBe(true);
        expect(btn!.classList.contains('end')).toBe(true);
    });

    test('mouseenter/leave handlers run (selectedDate unset and set)', async () => {
        // when no selectedDate: mouseenter should run
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true
            }
        });

        const btn = findDateButtonByDay(15);
        expect(btn).toBeTruthy();
        await fireEvent.mouseEnter(btn as Element);
        await fireEvent.mouseLeave(btn as Element);

        // when selectedDate set, handlers return early (no error)
        const selectedTimestamp = new Date(2024, 5, 15).getTime();
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true,
                selectedDate: selectedTimestamp
            }
        });

        const btn2 = findDateButtonByDay(15);
        expect(btn2).toBeTruthy();
        await fireEvent.mouseEnter(btn2 as Element);
        await fireEvent.mouseLeave(btn2 as Element);
    });

    test('clickOutside closes the calendar', async () => {
        render(Datepicker, {
            props: {
                today: baseToday,
                defaultYear: 2024,
                defaultMonth: 5,
                isOpen: true
            }
        });

        // click outside - body
        await fireEvent.click(document.body);
        expect(document.querySelector('.calendar-card.show')).toBeNull();
    });
});