import { fireEvent, render } from '@testing-library/svelte';

import { Direction } from '$lib/enums/direction.enum';
import { FILTER_SVG } from '$lib/config/constants';
import { Icon } from '$lib';

describe('Icon Component', () => {
	const iconProps = {
		iconSVG: 'string',
		viewBox: '0 0 448 512',
		height: 22,
		width: 22,
		fill: 'fill-amadeustest',
		direction: Direction.Left,
		classes: 'test-class',
		testId: 'test-icon',
		clickLogic: vi.fn(),
		label: 'test-label'
	};

	test('should render a icon with all props', () => {
		iconProps.iconSVG = FILTER_SVG;
		const { container } = render(Icon, iconProps);
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('-rotate-90 test-class');
		expect(svgIcon).toHaveAttribute('viewBox', iconProps.viewBox);
		expect(svgIcon).toHaveAttribute('fill', iconProps.fill);
		expect(svgIcon).toHaveAttribute('width', iconProps.width.toString());
		expect(svgIcon).toHaveAttribute('height', iconProps.height.toString());
		expect(svgIcon).toHaveAttribute('data-cy-id', iconProps.testId);
	});

	test("should render the icon's button correctly", () => {
		const { getByRole } = render(Icon, iconProps);
		const button = getByRole('button', { name: iconProps.label });

		expect(button).toBeInTheDocument();
	});

	test('should trigger click function as expected', async () => {
		const onClickHandler = vi.fn();
		iconProps.clickLogic = onClickHandler;

		const { getByRole } = render(Icon, iconProps);
		const button = getByRole('button', { name: iconProps.label });
		await fireEvent.click(button);

		expect(button).toBeInTheDocument();
		expect(onClickHandler).toHaveBeenCalled();
	});

	test('should trigger onkeypress function as expected', async () => {
		const onClickHandler = vi.fn();
		iconProps.clickLogic = onClickHandler;

		const { getByRole } = render(Icon, iconProps);
		const button = getByRole('button', { name: iconProps.label });
		await fireEvent.keyPress(button, { key: 'Enter', code: 'Enter', charCode: 13 });

		expect(button).toBeInTheDocument();
		expect(onClickHandler).toHaveBeenCalled();
	});
});
