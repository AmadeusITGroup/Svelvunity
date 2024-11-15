import { render } from '@testing-library/svelte';

import { Direction } from '$lib/enums/direction.enum';
import { FILTER_SVG } from '$lib/config/constants';
import { SymbolIcon } from '$lib';

describe('SymbolIcon Component', () => {
	const iconProps = {
		iconSVG: 'string',
		viewBox: '0 0 448 512',
		height: 22,
		width: 22,
		fill: 'fill-amadeustest',
		direction: Direction.Left,
		classes: 'test-class',
		testId: 'test-icon'
	};

	test('should render a symbolIcon with all props', async () => {
		iconProps.iconSVG = FILTER_SVG;
		const { container } = render(SymbolIcon, { props: iconProps });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('-rotate-90 test-class');
		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});

	test('should render a symbolIcon with direction right prop', async () => {
		iconProps.direction = Direction.Right;
		const { container } = render(SymbolIcon, { props: iconProps });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as HTMLImageElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('rotate-90 test-class');
		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});
});
