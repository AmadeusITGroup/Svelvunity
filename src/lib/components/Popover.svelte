<script lang="ts">
    import { Frame } from '$lib';
    import type { ComputePositionReturn, Middleware, Placement, Side } from '@floating-ui/dom';
    import * as dom from '@floating-ui/dom';
    import { onMount, type Snippet } from 'svelte';
    import { twJoin } from 'tailwind-merge';

    let {
        border = false,
        rounded = false,
        shadow = false,
        onShow,
        classes = '',
        activeContent = false,
        arrow = true,
        placement = 'top',
        trigger = 'hover',
        triggeredBy = undefined,
        reference = undefined,
        open = false,
        offset = 8,
        strategy = 'absolute',
        yOnly = false,
        children
    }: {
        border: boolean;
        rounded: boolean;
        shadow: boolean;
        classes?: string;
        onShow: (open: boolean) => void;
        activeContent: boolean;
        arrow: boolean;
        placement: Placement;
        trigger: 'hover' | 'click';
        triggeredBy: string | undefined;
        reference: string | undefined;
        open: boolean;
        offset: number;
        strategy: 'absolute' | 'fixed';
        yOnly: boolean;
        children?: Snippet;
    } = $props();

    // extra floating UI middleware list
    let middlewares: Middleware[] = [dom.flip(), dom.shift()];

    let clickable: boolean = $derived(trigger === 'click');
    let isOpen = $state(open);
    onShow(isOpen);

    let referenceEl: Element | undefined = $state();
    let hasArrow: boolean = $state(arrow);

    let floatingEl: HTMLElement;
    let arrowEl: HTMLElement | null = $state(null);
    let contentEl: HTMLElement;
    let triggerEls: HTMLElement[] = [];

    let middleware = $derived([
        ...middlewares,
        dom.offset(+offset),
        arrowEl && dom.arrow({ element: arrowEl, padding: 10 })
    ]);

    let _blocked = false; // management of the race condition between focusin and click events
    const block = () => ((_blocked = true), setTimeout(() => (_blocked = false), 250));

    const showHandler = (ev: Event) => {
        if (referenceEl === undefined) console.error('trigger undefined');
        if (
            !reference &&
            triggerEls.includes(ev.target as HTMLElement) &&
            referenceEl !== ev.target
        ) {
            referenceEl = ev.target as HTMLElement;
            block();
        }
        if (clickable && ev.type === 'focusin' && !open) block();
        isOpen = clickable && ev.type === 'click' && !_blocked ? !isOpen : true;
    };

    const hasHover = (el: Element | undefined) => el?.matches(':hover');
    const hasFocus = (el: Element | undefined) => el?.contains(document.activeElement);
    const px = (n: number | undefined) => (n != null ? `${n}px` : '');

    const hideHandler = (ev: Event) => {
        if (activeContent) {
            setTimeout(() => {
                const elements = [referenceEl, floatingEl, ...triggerEls].filter(Boolean);
                if (ev.type === 'mouseleave' && elements.some(hasHover)) return;
                if (ev.type === 'focusout' && elements.some(hasFocus)) return;
                isOpen = false;
            }, 100);
        } else isOpen = false;
    };

    const oppositeSideMap: Record<Side, Side> = {
        left: 'right',
        right: 'left',
        bottom: 'top',
        top: 'bottom'
    };
    let arrowSide: Side = oppositeSideMap.top;

    function updatePosition() {
        if (referenceEl) {
            dom.computePosition(referenceEl, floatingEl, { placement, strategy, middleware }).then(
                ({ x, y, middlewareData, placement, strategy }: ComputePositionReturn) => {
                    floatingEl.style.position = strategy;
                    floatingEl.style.left = yOnly ? '0' : px(x);
                    floatingEl.style.top = px(y);

                    if (middlewareData.arrow && arrowEl instanceof HTMLDivElement) {
                        arrowEl.style.left = px(middlewareData.arrow.x);
                        arrowEl.style.top = px(middlewareData.arrow.y);

                        arrowSide = oppositeSideMap[placement.split('-')[0] as Side];
                        arrowEl.style[arrowSide] = px(-arrowEl.offsetWidth / 2 - (border ? 1 : 0));
                    }
                }
            );
        }
    }

    function init(node: HTMLElement, _referenceEl: HTMLElement) {
        floatingEl = node;
        let cleanup = dom.autoUpdate(_referenceEl, floatingEl, updatePosition);

        return {
            update(_referenceEl: HTMLElement) {
                cleanup();
                cleanup = dom.autoUpdate(_referenceEl, floatingEl, updatePosition);
            },
            destroy() {
                cleanup();
            }
        };
    }

    onMount(() => {
        const events: [string, any, boolean][] = [
            ['focusin', showHandler, true],
            ['focusout', hideHandler, true],
            ['click', showHandler, clickable],
            ['mouseenter', showHandler, !clickable],
            ['mouseleave', hideHandler, !clickable]
        ];

        if (triggeredBy) triggerEls = [...document.querySelectorAll<HTMLElement>(triggeredBy)];
        else
            triggerEls = contentEl.previousElementSibling
                ? [contentEl.previousElementSibling as HTMLElement]
                : [];

        if (!triggerEls.length) {
            console.error('No triggers found.');
        }

        triggerEls.forEach((element: HTMLElement) => {
            if (element.tabIndex < 0) element.tabIndex = 0; // trigger must be focusable
            for (const [name, handler, cond] of events)
                if (cond) element.addEventListener(name, handler);
        });

        if (reference) {
            referenceEl = document.querySelector(reference) ?? document.body;
            if (referenceEl === document.body) {
                console.error(`Popup reference not found: '${reference}'`);
            } else {
                referenceEl.addEventListener('focusout', hideHandler);
                if (!clickable) referenceEl.addEventListener('mouseleave', hideHandler);
            }
        } else {
            referenceEl = triggerEls[0];
        }

        return () => {
            // This is onDestroy function
            triggerEls.forEach((element: HTMLElement) => {
                if (element) {
                    for (const [name, handler] of events)
                        element.removeEventListener(name, handler);
                }
            });
            if (referenceEl) {
                referenceEl.removeEventListener('focusout', hideHandler);
                referenceEl.removeEventListener('mouseleave', hideHandler);
            }
        };
    });

    function optional(pred: boolean, func: (ev: Event) => void) {
        return pred ? func : () => undefined;
    }

    let arrowClass: string = $state(
        twJoin(
            'absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit',
            border && arrowSide === 'bottom' && 'border-b border-e',
            border && arrowSide === 'top' && 'border-t border-s ',
            border && arrowSide === 'right' && 'border-t border-e ',
            border && arrowSide === 'left' && 'border-b border-s '
        )
    );

    function initArrow(node: HTMLElement) {
        arrowEl = node;
        return {
            destroy() {
                arrowEl = null;
            }
        };
    }
</script>

{#if !referenceEl}
    <div bind:this={contentEl} />
{/if}

{#if isOpen && referenceEl}
    <Frame
        action={init}
        options={referenceEl}
        role="tooltip"
        {border}
        {rounded}
        {shadow}
        {classes}
        tabindex={activeContent ? -1 : undefined}
        onfocusin={optional(activeContent, showHandler)}
        onfocusout={optional(activeContent, hideHandler)}
        onmouseenter={optional(activeContent && !clickable, showHandler)}
        onmouseleave={optional(activeContent && !clickable, hideHandler)}
    >
        {@render children?.()}
        {#if hasArrow}<div use:initArrow class={arrowClass} />{/if}
    </Frame>
{/if}
