import { describe, it, expect, vi } from 'vitest';
import { handle } from '../hooks.server';

describe('handle function', () => {
  it('returns 204 response for /.well-known/appspecific/com.chrome.devtools path', async () => {
    const event = {
      url: new URL('http://localhost/.well-known/appspecific/com.chrome.devtools/something'),
    };
    const resolve = vi.fn();

    const response = await handle({ event, resolve });

    expect(response.status).toBe(204);
    // Check response body is null (empty)
    const text = await response.text();
    expect(text).toBe('');
    expect(resolve).not.toHaveBeenCalled();
  });

  it('calls resolve and returns its response for other paths', async () => {
    const event = {
      url: new URL('http://localhost/other-path'),
    };
    const mockResponse = new Response('OK', { status: 200 });
    const resolve = vi.fn(() => Promise.resolve(mockResponse));

    const response = await handle({ event, resolve });

    expect(resolve).toHaveBeenCalledWith(event);
    expect(response).toBe(mockResponse);
  });
});