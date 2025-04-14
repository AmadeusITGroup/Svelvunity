
import { fireEvent, render, screen } from '@testing-library/svelte/svelte5';
import Datepicker from '../lib/components/Datepicker.svelte';
describe('Datepicker Component', () => {
    test('should render the component', () => {
        const { container } = render(Datepicker);
        expect(container).toBeInTheDocument();
    });
    test('should render the component with disabled dates', () => {
        const disabledDates = ['2024-06-05', '2024-06-15', '2024-06-25'];
        render(Datepicker, { props: { disabledDates } });
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });
    test('should render the component with enabled dates', () => {
        const enabledDates = ['2024-06-05', '2024-06-15', '2024-06-25'];
        render(Datepicker, { props: { enabledDates } });
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });
    test('should display the correct month and year when navigating', () => {
        const today = new Date();
        const { container } =  render(Datepicker);
        const prevButton = container.getElementsByClassName('icon-previous-month')[0] as HTMLElement;
        const nextButton = container.getElementsByClassName('icon-next-month')[0] as HTMLElement;
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
        nextButton.click();
        prevButton.click();
    });
    test('should select a date when clicked', () => {
        const selectedDate =  new Date();
        render(Datepicker, { props: { selectedDate } });
        const dateElement = screen.getByText(selectedDate.getDay().toString());
        dateElement.click();
        expect(dateElement).toBeTruthy();
    });
    test('should select a date when mouse is entered', () => {
        const selectedDate =  new Date();
        render(Datepicker, { props: { selectedDate } });
        const dateElement = screen.getByText(selectedDate.getDay().toString());
        fireEvent.mouseEnter(dateElement);
        expect(dateElement).not.toBeDisabled();
    });
    test('should disable past dates', () => {
        const today = new Date();
        const pastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        render(Datepicker, { props: {selectedDate: pastDate } });
        const pastDateElement = screen.getByText(pastDate.getDate().toString());
        expect(pastDateElement).toBeInTheDocument();
    });
    test('should disable future dates', () => {
        const today = new Date();
        const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        render(Datepicker, { props: { selectedDate: futureDate } });
        const futureDateElement = screen.getByText(futureDate.getDate().toString());
        expect(futureDateElement).toBeInTheDocument();
    });
});
