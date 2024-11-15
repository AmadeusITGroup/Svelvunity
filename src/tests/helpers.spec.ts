import {
	formatVariableKey,
	getMinWidth,
	isInViewport,
	removeLeadingZero
} from '../lib/utils/helpers';

describe('Helper functions', () => {
	let element: HTMLElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);
	});

	afterEach(() => {
		document.body.removeChild(element);
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

	test('should return the maximum value between maxWidth and contentWidth if contentWidth is falsy', () => {
		element.style.width = '100px';
		element.style.height = '100px';
		const maxWidth = 120;

		const result = getMinWidth(element, maxWidth);

		expect(result).toBe(maxWidth);
	});
});
