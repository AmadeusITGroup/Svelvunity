import {
	formatVariableKey,
	getMinWidth,
	isInViewport,
	removeLeadingZero
} from '../lib/utils/helpers';

describe('Helper functions', () => {
	let element: HTMLElement;
	let originalInnerHeight: number;
	let originalInnerWidth: number;

	function createElementWithRect(rect: Partial<DOMRect>): HTMLElement {
		return {
			getBoundingClientRect: () => ({
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				toJSON() {},
				...rect
			})
		} as HTMLElement;
	}

	beforeEach(() => {
		originalInnerHeight = window.innerHeight;
		originalInnerWidth = window.innerWidth;
		element = document.createElement('div');
		document.body.appendChild(element);
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 800
		});
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1200
		});
	});

	afterEach(() => {
		document.body.removeChild(element);
		Object.defineProperty(window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: originalInnerHeight
		});
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: originalInnerWidth
		});
	});

	test('should test removeLeadingZero', () => {
		expect(removeLeadingZero('01')).toBe('1');
		expect(removeLeadingZero('001')).toBe('1');
		expect(removeLeadingZero('0test')).toBe('test');
		expect(removeLeadingZero('0101')).toBe('101');
		expect(removeLeadingZero('101')).toBe('101');
		expect(removeLeadingZero('0101 0101')).toBe('101 0101');
	});

	test('should test formatVariableKey', () => {
		expect(formatVariableKey('camelCase')).toBe('camel-case');
		expect(formatVariableKey('kebab-case')).toBe('kebab-case');
		expect(formatVariableKey('PascalCase')).toBe('pascal-case');
		expect(formatVariableKey('snake_case')).toBe('snake_case');
		expect(formatVariableKey('UPPER_CASE')).toBe('upper_case');
		expect(formatVariableKey('mixed_Case')).toBe('mixed_case');
		expect(formatVariableKey('123Numbers')).toBe('123-numbers');
	});

	test('should return true if the element is in the viewport', () => {
		element.style.width = '100px';
		element.style.height = '100px';
		document.body.style.margin = '0';
		document.body.style.padding = '0';
		document.body.style.overflow = 'hidden';

		expect(isInViewport(element)).toBe(true);
	});

	test('should return true if the element is partially in the viewport', () => {
		element.style.width = '100px';
		element.style.height = '100px';
		element.style.position = 'absolute';
		element.style.top = '-50px';
		element.style.left = '-50px';
		document.body.style.margin = '0';
		document.body.style.padding = '0';
		document.body.style.overflow = 'hidden';

		expect(isInViewport(element)).toBe(true);
	});

	test('should return true if the element is the entire viewport', () => {
		document.body.style.margin = '0';
		document.body.style.padding = '0';
		document.body.style.overflow = 'hidden';

		expect(isInViewport(document.body)).toBe(true);
	});

	test('returns true when element is fully inside viewport', () => {
		const el = createElementWithRect({
			top: 10,
			left: 10,
			bottom: 700,
			right: 1100
		});

		expect(isInViewport(el)).toBe(true);
	});

	test('returns false when top is negative', () => {
		const el = createElementWithRect({
			top: -1,
			left: 10,
			bottom: 700,
			right: 1100
		});

		expect(isInViewport(el)).toBe(false);
	});

	test('returns false when bottom is below viewport height', () => {
		const el = createElementWithRect({
			top: 10,
			left: 10,
			bottom: 900, // greater than window.innerHeight = 800
			right: 1100
		});

		expect(isInViewport(el)).toBe(false);
	});

	test('returns false when right is beyond viewport width', () => {
		const el = createElementWithRect({
			top: 10,
			left: 10,
			bottom: 700,
			right: 1300 // greater than window.innerWidth = 1200
		});

		expect(isInViewport(el)).toBe(false);
	});

	test('should return contentWidth when contentWidth is less than maxWidth', () => {
		element.style.padding = '10px';
		element.style.width = '100px';

		const result = getMinWidth(element, 500);

		expect(result).toBeLessThanOrEqual(500);
	});

	test('should return maxWidth when contentWidth is greater than maxWidth', () => {
		element.style.padding = '5px';
		element.style.width = '600px';

		const result = getMinWidth(element, 200);

		expect(result).toBeLessThanOrEqual(200);
	});

	test('should handle zero padding correctly', () => {
		element.style.padding = '0px';
		element.style.width = '100px';

		const result = getMinWidth(element, 500);

		expect(result).toBeGreaterThan(0);
		expect(typeof result).toBe('number');
	});

	test('should handle asymmetric padding (left and right)', () => {
		element.style.paddingLeft = '10px';
		element.style.paddingRight = '20px';
		element.style.width = '150px';

		const result = getMinWidth(element, 500);

		expect(typeof result).toBe('number');
		expect(Number.isInteger(result)).toBe(true);
	});

	test('should round the result to nearest integer', () => {
		element.style.padding = '0px';
		element.style.width = '100.7px';

		const result = getMinWidth(element, 500);

		expect(typeof result).toBe('number');
		expect(Number.isInteger(result)).toBe(true);
	});

	test('should return maxWidth when contentWidth is 0 or falsy', () => {
		element.style.padding = '0px';
		element.style.width = '0px';

		const result = getMinWidth(element, 300);

		// Due to extraCharPadding of 2, the minimum width will be 2
		expect(result).toBe(2);
	});

	describe('getMinWidth - return Math.round(Math.min(maxWidth, contentWidth || maxWidth))', () => {
		// extraCharPadding inside getMinWidth
		const EXTRA = 2;

		function mockMeasured(
			el: HTMLElement,
			{
				width,
				paddingLeft = 0,
				paddingRight = 0
			}: { width: number; paddingLeft?: number; paddingRight?: number }
		) {
			vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
				width,
				height: 0,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				x: 0,
				y: 0,
				toJSON() {}
			} as DOMRect);

			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				getPropertyValue: (prop: string) => {
					if (prop === 'padding-left') return `${paddingLeft}px`;
					if (prop === 'padding-right') return `${paddingRight}px`;
					return '';
				}
			} as unknown as CSSStyleDeclaration);
		}

		afterEach(() => {
			vi.restoreAllMocks();
		});

		test('returns contentWidth when contentWidth < maxWidth (Math.min picks contentWidth)', () => {
			// contentWidth = (100 + 2) - (10 + 10) = 82
			mockMeasured(element, { width: 100, paddingLeft: 10, paddingRight: 10 });

			expect(getMinWidth(element, 500)).toBe(82);
		});

		test('returns maxWidth when contentWidth > maxWidth (Math.min picks maxWidth)', () => {
			// contentWidth = (600 + 2) - 0 = 602, but maxWidth = 200
			mockMeasured(element, { width: 600 });

			expect(getMinWidth(element, 200)).toBe(200);
		});

		test('returns the shared value when contentWidth === maxWidth', () => {
			// contentWidth = (100 + 2) - (1 + 1) = 100
			mockMeasured(element, { width: 100, paddingLeft: 1, paddingRight: 1 });

			expect(getMinWidth(element, 100)).toBe(100);
		});

		test('falls back to maxWidth when contentWidth is 0 (falsy via ||)', () => {
			// elementWidth = -2 + 2 = 0; contentWidth = 0 - 0 = 0 → falsy → fallback to maxWidth
			mockMeasured(element, { width: -EXTRA });

			expect(getMinWidth(element, 250)).toBe(250);
		});

		test('does not fall back when contentWidth is a truthy negative number', () => {
			// contentWidth = (10 + 2) - (25 + 25) = -38 (truthy) → Math.min(500, -38) = -38
			mockMeasured(element, { width: 10, paddingLeft: 25, paddingRight: 25 });

			expect(getMinWidth(element, 500)).toBe(-38);
		});

		test('rounds fractional contentWidth down (.3 → floor)', () => {
			// contentWidth = 100.3 + 2 = 102.3 → round → 102
			mockMeasured(element, { width: 100.3 });

			expect(getMinWidth(element, 500)).toBe(102);
		});

		test('rounds fractional contentWidth up (.7 → ceil)', () => {
			// contentWidth = 100.7 + 2 = 102.7 → round → 103
			mockMeasured(element, { width: 100.7 });

			expect(getMinWidth(element, 500)).toBe(103);
		});

		test('rounds fractional maxWidth when maxWidth wins the min', () => {
			// contentWidth = 1000 + 2 = 1002, maxWidth = 200.6 → min = 200.6 → round → 201
			mockMeasured(element, { width: 1000 });

			expect(getMinWidth(element, 200.6)).toBe(201);
		});

		test('rounds fractional maxWidth when fallback path is taken (contentWidth falsy)', () => {
			// contentWidth = 0 → falls back to maxWidth = 199.5 → round → 200
			mockMeasured(element, { width: -EXTRA });

			expect(getMinWidth(element, 199.5)).toBe(200);
		});

		test('always returns an integer', () => {
			mockMeasured(element, { width: 123.456, paddingLeft: 7, paddingRight: 11 });

			const result = getMinWidth(element, 999.9);

			expect(Number.isInteger(result)).toBe(true);
		});
	});
});
