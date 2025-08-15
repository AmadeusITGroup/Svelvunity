import { get } from 'svelte/store';
import { toast } from '$lib/components/Toast/stores.js';

describe('Toast Store', () => {
	test('toast store is initialized correctly', () => {
		const toasts = get(toast);
		expect(toasts).toEqual([]);
	});

	test('push function adds a toast', () => {
		toast?.push('Test message');
		const toasts = get(toast);
		expect(toasts.length).toBe(1);
	});

	test('push function assigns unique ids', () => {
		toast.push('Test message 1');
		toast.push('Test message 2');
		const toasts = get(toast);
		// @ts-expect-error
		expect(toasts[0].id).not.toBe(toasts[1].id);
	});

	test('push function handles string message', () => {
		toast.push('Test message');
		const toasts = get(toast);
		// @ts-expect-error
		expect(toasts[0].msg).toBe('Test message');
	});

	test('push function handles object message', () => {
		toast.push({ msg: 'Test message', duration: 2000 });
		const toasts = get(toast);
		// @ts-expect-error
		expect(toasts[0].msg).toBe('Test message');
		// @ts-expect-error
		expect(toasts[0].duration).toBe(2000);
	});

	test('success function', () => {
		const message = 'Success message';
		const testId = 'testId';

		toast.success(message, testId);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#f2f9f5',
					'--toastBorder': '1px solid #00854066',
					'--toastLeftBorderColor': '#008540'
				}
			}));
	});

	test('success function without testId', () => {
		const message = 'Success message';

		toast.success(message);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#f2f9f5',
					'--toastBorder': '1px solid #00854066',
					'--toastLeftBorderColor': '#008540'
				}
			}));
	});

	test('failure function', () => {
		const message = 'Failure message';
		const testId = 'testId';

		toast.failure(message, testId);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#fcf2f2',
					'--toastBorder': '1px solid #c6000066',
					'--toastLeftBorderColor': '#c60000'
				}
			}));
	});

	test('failure function without testId', () => {
		const message = 'Failure message';

		toast.failure(message);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#fcf2f2',
					'--toastBorder': '1px solid #c6000066',
					'--toastLeftBorderColor': '#c60000'
				}
			}));
	});

	test('warning function', () => {
		const message = 'Warning message';
		const testId = 'testId';

		toast.warning(message, testId);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#fffbf4',
					'--toastBorder': '1px solid #f7a82766',
					'--toastLeftBorderColor': '#f7a827'
				}
			}));
	});

	test('warning function without testId', () => {
		const message = 'Warning message';

		toast.warning(message);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#fffbf4',
					'--toastBorder': '1px solid #f7a82766',
					'--toastLeftBorderColor': '#f7a827'
				}
			}));
	});

	test('info function', () => {
		const message = 'Info message';
		const testId = 'testId';

		toast.info(message, testId);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#F4F9FB',
					'--toastBorder': '1px solid #1a7ead66',
					'--toastLeftBorderColor': '#1a7ead'
				}
			}));
	});

	test('info function without testId', () => {
		const message = 'Info message';

		toast.info(message);

		(expect.stringContaining(message),
			expect.objectContaining({
				theme: {
					'--toastBackground': '#F4F9FB',
					'--toastBorder': '1px solid #1a7ead66',
					'--toastLeftBorderColor': '#1a7ead'
				}
			}));
	});

	test("should update a toast's message", () => {
		const id = toast.push('Old message');
		toast.set(id, { msg: 'New message' });

		const toasts = get(toast);
		// @ts-expect-error
		const updatedToast = toasts.find((t) => t.id === id);

		// @ts-expect-error
		expect(updatedToast.msg).toBe('New message');
	});

	test("should update a toast's duration", () => {
		const id = toast.push('Message', { duration: 5000 });
		toast.set(id, { duration: 10000 });

		const toasts = get(toast);
		// @ts-expect-error
		const updatedToast = toasts.find((t) => t.id === id);

		// @ts-expect-error
		expect(updatedToast.duration).toBe(10000);
	});

	test('exists', () => {
		expect(typeof toast._init).toBe('function');
	});

	test('returns an object', () => {
		const result = toast._init();
		expect(typeof result).toBe('object');
	});
});
