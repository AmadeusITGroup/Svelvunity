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
    	    ...rect,
    	  }),
    	} as HTMLElement;
 	}

	beforeEach(() => {
		originalInnerHeight = window.innerHeight;
    	originalInnerWidth = window.innerWidth;
		element = document.createElement('div');
		document.body.appendChild(element);
		Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
    	Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
	});

	afterEach(() => {
		document.body.removeChild(element);
		Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
    	Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
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
  	    right: 1100,
  	  });

  	  expect(isInViewport(el)).toBe(true);
  	});

	test('returns false when top is negative', () => {
    	const el = createElementWithRect({
    	  top: -1,
    	  left: 10,
    	  bottom: 700,
    	  right: 1100,
    	});

    	expect(isInViewport(el)).toBe(false);
  	});
	
	test('returns false when bottom is below viewport height', () => {
    const el = createElementWithRect({
      top: 10,
      left: 10,
      bottom: 900, // greater than window.innerHeight = 800
      right: 1100,
    });

    expect(isInViewport(el)).toBe(false);
  });

  test('returns false when right is beyond viewport width', () => {
    const el = createElementWithRect({
      top: 10,
      left: 10,
      bottom: 700,
      right: 1300, // greater than window.innerWidth = 1200
    });

    expect(isInViewport(el)).toBe(false);
  });
  
	it('should return the maximum value between maxWidth and contentWidth if contentWidth is falsy', () => {
		element.style.width = '100px';
		element.style.height = '100px';
		const maxWidth = 120;

		const result = getMinWidth(element, maxWidth);

		expect(result).toBe(maxWidth);
	});
});
