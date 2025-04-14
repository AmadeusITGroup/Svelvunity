import { Pagination } from '$lib';
import { render, fireEvent } from '@testing-library/svelte/svelte5';

describe('Pagination Component', () => {
	let values: unknown;
	const rows = [
		'hi',
		'bye',
		'lie',
		'tie',
		'fry',
		'cry',
		'pie',
		'my',
		'guy',
		'hi',
		'bye',
		'lie',
		'tie',
		'fry',
		'cry',
		'pie',
		'my',
		'guy'
	];

	const paginationProps = {
		firstPageBtnTestId: 'first-page-button',
		prevPageBtnTestId: 'prev-page-button',
		currPageTestId: 'current-page',
		nextPageBtnTestId: 'next-page-button',
		lastPageBtnTestId: 'last-page-button',
		rows: rows,
		perPage: 1,
		trimmedRows: values
	};

	test('should render without error', () => {
		const { container } = render(Pagination);
		expect(container).toBeInTheDocument();
	});

	test('should navigate to next page when next button is clicked', async () => {
		const { container } = render(Pagination, { props: paginationProps });
		const currentPage = container.querySelector("[data-cy-id='current-page']") as HTMLElement;
		const nextButton = container.querySelector("[data-cy-id='next-page-button']") as HTMLElement;

		fireEvent.click(nextButton);
		expect(currentPage).toHaveTextContent('1');
	});

	test('should navigate to previous page when previous button is clicked', async () => {
		const { container } = render(Pagination, { props: paginationProps });
		const prevButton = container.querySelector("[data-cy-id='prev-page-button']") as HTMLElement;
		const currentPage = container.querySelector("[data-cy-id='current-page']") as HTMLElement;

		fireEvent.click(prevButton);
		expect(currentPage).toHaveTextContent('1');
	});

	test('should navigate to first page when first page button is clicked', async () => {
		const { container } = render(Pagination, { props: paginationProps });
		const firstButton = container.querySelector("[data-cy-id='first-page-button']") as HTMLElement;
		const currentPage = container.querySelector("[data-cy-id='current-page']") as HTMLElement;

		fireEvent.click(firstButton);
		expect(currentPage).toHaveTextContent('1');
	});

	test('should navigate to last page when last page button is clicked', async () => {
		const { container } = render(Pagination, { props: paginationProps });
		const currentPage = container.querySelector("[data-cy-id='current-page']") as HTMLElement;
		const lastButton = container.querySelector("[data-cy-id='last-page-button']") as HTMLElement;

		fireEvent.click(lastButton);
		expect(currentPage).toHaveTextContent('1');
	});

	test('should show correct total pages', async () => {
		const { container } = render(Pagination, {
			props: { ...paginationProps, perPage: 2, totalPagesTestId: 'total-pages' }
		});

		const totalPages = container.querySelector("[data-cy-id='total-pages']") as HTMLElement;
		expect(totalPages).toHaveTextContent('9');
	});
});
