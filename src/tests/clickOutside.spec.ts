import { vi, type Mock } from 'vitest';
describe('clickOutside', () => {
	let node: HTMLDivElement | null;
	let mockDispatchEvent: Mock<any, any> | null;
	beforeEach(() => {
		node = document.createElement('div');
		mockDispatchEvent = vi.fn();
		node.dispatchEvent = mockDispatchEvent;
	});
	afterEach(() => {
		node = null;
		mockDispatchEvent = null;
	});
	test('should not dispatch click_outside event when clicked inside of node', () => {
		const event = new MouseEvent('click', { bubbles: true });
		node?.appendChild(document.createElement('div')).dispatchEvent(event);
		expect(mockDispatchEvent).not.toHaveBeenCalled();
	});
	test('should not dispatch click_outside event when event default is prevented', () => {
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		event.preventDefault();
		document.body.appendChild(node ?? document.createElement('div'));
		document.body.dispatchEvent(event);
		expect(mockDispatchEvent).not.toHaveBeenCalled();
	});
	test('should not dispatch click_outside event when node is not in the document', () => {
		const event = new MouseEvent('click', { bubbles: true });
		document.body.dispatchEvent(event);
		expect(mockDispatchEvent).not.toHaveBeenCalled();
	});
	test('should not dispatch click_outside event when event target is a descendant of the node', () => {
		const event = new MouseEvent('click', { bubbles: true });
		const child = document.createElement('div');
		node?.appendChild(child);
		child.dispatchEvent(event);
		expect(mockDispatchEvent).not.toHaveBeenCalled();
	});
});
