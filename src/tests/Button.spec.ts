import { render, screen, fireEvent } from '@testing-library/svelte';
import { ButtonType } from '$lib/enums/buttontype.enum';
import { Size } from '$lib/enums/size.enum';
import Button from '$lib/components/Button.svelte';
import { type ComponentProps } from 'svelte';

const buttonOptions: ComponentProps<typeof Button> = getButtonOptions();

function getButtonOptions() {
	return {
		label: 'Test Button',
		isDisabled: true,
		additionalClasses: 'test-class',
		type: ButtonType.Primary,
		buttonSize: Size.Large,
		testId: 'my-test-id',
		clickLogic: () => vi.fn(),
		loading: false
	};
}

describe('Button Component', () => {
	test('should render a button with all props', async () => {
		render(Button, buttonOptions);

		expect(screen.getByText(buttonOptions.label)).toBeInTheDocument();
		expect(screen.getByText(buttonOptions.label)).toBeDisabled();
		expect(screen.getByText(buttonOptions.label)).toHaveClass(
			'test-class am-c-df_btn am-c-df_btn-primary am-c-df_btn__lg'
		);
		expect(screen.getByText(buttonOptions.label)).toHaveAttribute(
			'data-cy-id',
			buttonOptions.testId
		);
	});

	test('should test click event', async () => {
		const clickFunc = vi.fn();
		buttonOptions.clickLogic = clickFunc;
		const { getByRole } = render(Button, buttonOptions);
		const button = getByRole('button');

		await fireEvent.click(button);
		expect(clickFunc).toHaveBeenCalled();
	});

	test('should render a button with small size prop', async () => {
		buttonOptions.buttonSize = Size.Small;
		render(Button, buttonOptions);

		const buttonLabel = screen.getByText(buttonOptions.label);

		expect(buttonLabel).toBeInTheDocument();
		expect(buttonLabel).toBeDisabled();
		expect(buttonLabel).toHaveClass('test-class am-c-df_btn am-c-df_btn-primary am-c-df_btn__sm');
		expect(buttonLabel).toHaveAttribute('data-cy-id', buttonOptions.testId);
	});

	test('should render a button with xlarge size prop', async () => {
		buttonOptions.buttonSize = Size.XLarge;
		render(Button, buttonOptions);

		const buttonLabel = screen.getByText(buttonOptions.label);

		expect(buttonLabel).toBeInTheDocument();
		expect(buttonLabel).toBeDisabled();
		expect(buttonLabel).toHaveClass('test-class am-c-df_btn am-c-df_btn-primary am-c-df_btn__xl');
		expect(buttonLabel).toHaveAttribute('data-cy-id', buttonOptions.testId);
	});

	test('should render a button with outline button prop', async () => {
		buttonOptions.type = ButtonType.OutlinePrimary;
		buttonOptions.buttonSize = Size.Large;
		render(Button, buttonOptions);

		const buttonLabel = screen.getByText(buttonOptions.label);

		expect(buttonLabel).toBeInTheDocument();
		expect(buttonLabel).toBeDisabled();
		expect(buttonLabel).toHaveClass(
			'test-class am-c-df_btn am-c-df_btn-outline-primary am-c-df_btn__lg'
		);
		expect(buttonLabel).toHaveAttribute('data-cy-id', buttonOptions.testId);
	});

	test('should render a button with primary-danger prop', async () => {
		buttonOptions.type = ButtonType.PrimaryDanger;
		buttonOptions.buttonSize = Size.Large;
		render(Button, buttonOptions);
		const buttonLabel = screen.getByText(buttonOptions.label);

		expect(buttonLabel).toBeInTheDocument();
		expect(buttonLabel).toBeDisabled();
		expect(buttonLabel).toHaveClass(
			'test-class am-c-df_btn am-c-df_btn-primary-danger am-c-df_btn__lg'
		);
		expect(buttonLabel).toHaveAttribute('data-cy-id', buttonOptions.testId);
	});

	test('should render a button with outline-primary-danger prop', async () => {
		buttonOptions.type = ButtonType.OutlinePrimaryDanger;
		buttonOptions.buttonSize = Size.XLarge;
		render(Button, buttonOptions);
		const buttonLabel = screen.getByText(buttonOptions.label);

		expect(buttonLabel).toBeInTheDocument();
		expect(buttonLabel).toBeDisabled();
		expect(buttonLabel).toHaveClass(
			'test-class am-c-df_btn am-c-df_btn-outline-primary-danger am-c-df_btn__xl'
		);
		expect(buttonLabel).toHaveAttribute('data-cy-id', buttonOptions.testId);
	});

	test('should render loading componnent with size based on the button [small]', async () => {
		buttonOptions.buttonSize = Size.Small;
		buttonOptions.loading = true;
		const { container } = render(Button, buttonOptions);
		const loader = container.querySelector(
			`[data-cy-id='${buttonOptions.testId}-loader'`
		) as HTMLDivElement;

		expect(loader).toBeInTheDocument();
		expect(loader).toHaveClass('am-c-spinner__sm');
	});

	test('should render loading componnent with size based on the button [large]', async () => {
		buttonOptions.buttonSize = Size.Large;
		buttonOptions.loading = true;
		const { container } = render(Button, buttonOptions);
		const loader = container.querySelector(
			`[data-cy-id='${buttonOptions.testId}-loader'`
		) as HTMLDivElement;

		expect(loader).toBeInTheDocument();
		expect(loader).toHaveClass('am-c-spinner__lg');
	});

	test('should render loading componnent with size based on the button [xlarge]', async () => {
		buttonOptions.buttonSize = Size.XLarge;
		buttonOptions.loading = true;
		const { container } = render(Button, buttonOptions);
		const loader = container.querySelector(
			`[data-cy-id='${buttonOptions.testId}-loader'`
		) as HTMLDivElement;

		expect(loader).toBeInTheDocument();
		expect(loader).toHaveClass('am-c-spinner__xl');
	});
});
