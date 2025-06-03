import { render } from '@testing-library/svelte';

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
});
