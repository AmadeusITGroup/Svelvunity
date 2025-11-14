import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { trapFocus } from '$lib/utils/actions.svelte';

function createContainerWithFocusable(count = 3) {
    const container = document.createElement('div');
    for (let i = 0; i < count; i++) {
        const btn = document.createElement('button');
        btn.textContent = `btn-${i}`;
        container.appendChild(btn);
    }
    document.body.appendChild(container);
    return container;
}

describe('trapFocus action', () => {
    let container: HTMLDivElement | null = null;
    let actionReturn: { destroy: () => void } | undefined;

    afterEach(() => {
        if (actionReturn && typeof actionReturn.destroy === 'function') {
            actionReturn.destroy();
        }
        if (container && container.parentElement) {
            container.parentElement.removeChild(container);
        }
        container = null;
        actionReturn = undefined;
        // reset focus
        (document.activeElement as HTMLElement | null)?.blur?.();
    });

    it('returns early for non-Tab keys (does not prevent default)', () => {
        container = createContainerWithFocusable();
        actionReturn = trapFocus(container);

        const ev = new KeyboardEvent('keydown', {
            key: 'a',
            bubbles: true,
            cancelable: true
        });
        const dispatched = document.dispatchEvent(ev);
        // not prevented and dispatch returns true in DOM spec when not canceled
        expect(ev.defaultPrevented).toBe(false);
        expect(dispatched).toBe(true);
    });

    it('cycles focus forward on Tab and prevents default', () => {
        container = createContainerWithFocusable(3);
        actionReturn = trapFocus(container);

        const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
        buttons[0].focus();
        expect(document.activeElement).toBe(buttons[0]);

        const ev = new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(ev);

        // focus should move to the next tabbable (buttons[1])
        expect(document.activeElement).toBe(buttons[1]);
        // event should have been prevented by the handler
        expect(ev.defaultPrevented).toBe(true);
    });

    it('when activeElement is outside and Shift+Tab pressed, focuses last element (covers index === -1 && e.shiftKey)', () => {
        container = createContainerWithFocusable(4);
        actionReturn = trapFocus(container);

        // ensure activeElement is something outside (body)
        (document.activeElement as HTMLElement | null)?.blur?.();
        document.body.focus?.();
        expect(container.contains(document.activeElement)).toBe(false);

        const ev = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(ev);

        const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
        // With index === -1 and shiftKey true the handler should select the last element
        expect(document.activeElement).toBe(buttons[buttons.length - 1]);
        expect(ev.defaultPrevented).toBe(true);
    });

    it('destroy removes the event listener (no trapping after destroy)', () => {
        container = createContainerWithFocusable(2);
        actionReturn = trapFocus(container);

        const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
        buttons[0].focus();
        expect(document.activeElement).toBe(buttons[0]);

        // destroy the action
        actionReturn?.destroy();

        const ev = new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(ev);

        // After destroy, focus should not be changed by the handler
        // (it might still move by browser default in real browsers; in jsdom we assert it remains unchanged)
        expect(document.activeElement).toBe(buttons[0]);
    });
});