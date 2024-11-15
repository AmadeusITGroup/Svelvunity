import { ErrorPage } from '$lib';
import { render, screen } from '@testing-library/svelte';

describe('ErrorPage Component', () => {
	test('should render an error page with all props', async () => {
		const errorPageProps = {
			errorCode: 404,
			headMessage: 'Page Not Found',
			message: 'The page you are looking for does not exist.',
			testId: 'error-page-404'
		};

		const { container } = render(ErrorPage, { props: errorPageProps });

		expect(screen.getByText(errorPageProps.errorCode)).toBeInTheDocument();
		expect(screen.getByText(errorPageProps.headMessage)).toBeInTheDocument();
		expect(screen.getByText(errorPageProps.message)).toBeInTheDocument();

		expect(container.querySelector('main')).toHaveAttribute('data-cy-id', 'error-page-404');
	});

	test('should render an error page without any props', async () => {
		const { container } = render(ErrorPage);

		expect(screen.getByText('403')).toBeInTheDocument();
		expect(
			screen.getByText("The page you're trying to reach has restricted access.")
		).toBeInTheDocument();
		expect(screen.getByText('Please refer to your administrator.')).toBeInTheDocument();

		expect(container.querySelector('main')).toHaveAttribute('data-cy-id', '');
	});
});
