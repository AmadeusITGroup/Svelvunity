import { render } from '@testing-library/svelte';

import { Direction } from '$lib/enums/direction.enum';
import { FILTER_SVG } from '$lib/config/constants';
import { SymbolIcon } from '$lib';

describe('SymbolIcon Component', () => {
	const baseProps = {
		iconSVG: FILTER_SVG,
		viewBox: '0 0 448 512',
		height: 22,
		width: 22,
		fill: 'fill-amadeustest',
		direction: Direction.Left,
		classes: 'test-class',
		testId: 'test-icon'
	};

	test('should render a SymbolIcon with all props', async () => {
		const { container } = render(SymbolIcon, { props: { ...baseProps } });
		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as SVGElement;

		expect(svgIcon).toBeInTheDocument();

		expect(svgIcon).toHaveClass('test-class');

		expect(svgIcon.getAttribute('style')).toEqual(expect.stringContaining('rotate(-90deg)'));
		expect(svgIcon.getAttribute('style')).toEqual(
			expect.stringContaining('transform-origin: center')
		);
		expect(svgIcon.getAttribute('style')).toEqual(
			expect.stringContaining('transform-box: fill-box')
		);

		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});

	test('should render a SymbolIcon with direction right prop', async () => {
		const { container } = render(SymbolIcon, {
			props: { ...baseProps, direction: Direction.Right }
		});

		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as SVGElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon).toHaveClass('test-class');

		expect(svgIcon.getAttribute('style')).toEqual(expect.stringContaining('rotate(90deg)'));
		expect(svgIcon.getAttribute('style')).toEqual(
			expect.stringContaining('transform-origin: center')
		);
		expect(svgIcon.getAttribute('style')).toEqual(
			expect.stringContaining('transform-box: fill-box')
		);

		expect(svgIcon).toHaveAttribute('viewBox', '0 0 448 512');
		expect(svgIcon).toHaveAttribute('fill', 'fill-amadeustest');
		expect(svgIcon).toHaveAttribute('width', '22');
		expect(svgIcon).toHaveAttribute('height', '22');
		expect(svgIcon).toHaveAttribute('data-cy-id', 'test-icon');
	});

	test('should render a SymbolIcon with direction down prop', async () => {
		const { container } = render(SymbolIcon, {
			props: { ...baseProps, direction: Direction.Down }
		});

		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as SVGElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon.getAttribute('style')).toEqual(expect.stringContaining('rotate(180deg)'));
	});

	test('should render a SymbolIcon with direction up prop (default)', async () => {
		const { container } = render(SymbolIcon, {
			props: { ...baseProps, direction: Direction.Up }
		});

		const svgIcon = container.querySelector("[data-cy-id='test-icon']") as SVGElement;

		expect(svgIcon).toBeInTheDocument();
		expect(svgIcon.getAttribute('style')).toEqual(expect.stringContaining('rotate(0deg)'));
	});
});
