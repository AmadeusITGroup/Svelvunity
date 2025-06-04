import { describe, expect, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import { handle } from '../hooks.server';

describe('handle function', () => {
	test('returns 204 response for /.well-known/appspecific/com.chrome.devtools path', async () => {
		const event = {
			url: new URL('http://localhost/.well-known/appspecific/com.chrome.devtools/something')
		} as unknown as RequestEvent;
		const resolve = vi.fn();

		const response = await handle({ event, resolve });

		expect(response.status).toBe(204);
		// Check response body is null (empty)
		const text = await response.text();
		expect(text).toBe('');
		expect(resolve).not.toHaveBeenCalled();
	});

	test('calls resolve and returns its response for other paths', async () => {
		const event = {
			url: new URL('http://localhost/other-path')
		} as unknown as RequestEvent;
		const mockResponse = new Response('OK', { status: 200 });
		const resolve = vi.fn(() => Promise.resolve(mockResponse));

		const response = await handle({ event, resolve });

		expect(resolve).toHaveBeenCalledWith(event);
		expect(response).toBe(mockResponse);
	});
});
