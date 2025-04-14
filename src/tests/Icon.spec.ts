import { render, fireEvent } from '@testing-library/svelte/svelte5';

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
		clickLogic: () => {
			console.log('clickLogic function executed');
		}
	};

	test('should render a icon with all props', async () => {
		iconProps.iconSVG = FILTER_SVG;
		const { container } = render(Icon, { props: iconProps });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('-rotate-90 test-class');
		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});

	test('should render a icon with direction right prop', async () => {
		iconProps.direction = Direction.Right;
		const { container } = render(Icon, { props: iconProps });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('rotate-90 test-class');
		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});

	test('should test click event', async () => {
		const clickFunc = vi.fn();
		const { container } = render(Icon, { props: { ...iconProps, clickLogic: clickFunc } });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		await fireEvent.click(svgIcon);
		expect(clickFunc).toHaveBeenCalled();
	});

	test('should test without click event', async () => {
		const clickFunc = vi.fn();
		const { container } = render(Icon, { props: { ...iconProps, clickLogic: null } });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		await fireEvent.click(svgIcon);
		expect(clickFunc).not.toHaveBeenCalled();
	});

	test('should fire click logic on keypress', async () => {
		const clickFunc = vi.fn();
		const { container } = render(Icon, { props: { ...iconProps, clickLogic: clickFunc } });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		await fireEvent.keyPress(svgIcon, { key: 'Enter', code: 13, charCode: 13 });
		expect(clickFunc).toHaveBeenCalled();
	});
});
