<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
    import type { Placement, Side } from '@floating-ui/dom';
    import { onMount, type Snippet } from 'svelte';
    import { twJoin } from 'tailwind-merge';
    import Frame from './Frame.svelte';

    let {
        border,
        onShow,
        activeContent = false,
        arrow = true,
        placement = 'top',
        trigger = 'hover',
        triggeredBy = undefined,
        reference = undefined,
        open = false,
        children
    }: {
        border: any;
        onShow: any;
        activeContent: boolean;
        arrow: boolean;
        placement: Placement;
        trigger: 'hover' | 'click';
        triggeredBy: string | undefined;
        reference: string | undefined;
        open: boolean;
        children?: Snippet;
    } = $props();

    let clickable: boolean = $derived(trigger === 'click');

    onShow(open);
    $effect(() => {
        if (placement) {
            referenceEl;
        }
    });

    let referenceEl: any = $state(undefined);
    let floatingEl: HTMLElement | undefined = undefined;
    let contentEl: HTMLElement | undefined = $state();
    let triggerEls: HTMLElement[] = [];
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
        open = clickable && ev.type === 'click' && !_blocked ? !open : true;
    };

    const hasHover = (el: any) => el.matches(':hover');
    const hasFocus = (el: any) => el.contains(document.activeElement);

    const hideHandler = (ev: Event) => {
        if (activeContent) {
            setTimeout(() => {
                if (floatingEl) {
                    const elements = [referenceEl, floatingEl, ...triggerEls].filter(Boolean);
                    if (ev.type === 'mouseleave' && elements.some(hasHover)) return;
                    if (ev.type === 'focusout' && elements.some(hasFocus)) return;
                    open = false;
                }
            }, 100);
        } else open = false;
    };

    const oppositeSideMap: Record<Side, Side> = {
        left: 'right',
        right: 'left',
        bottom: 'top',
        top: 'bottom'
    };

    let arrowSide: Side = oppositeSideMap.top;

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
            triggerEls = contentEl?.previousElementSibling
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
</script>

{#if !referenceEl}
    <div bind:this={contentEl}></div>
{/if}

{#if open && referenceEl}
    <Frame
        options={referenceEl}
        role="tooltip"
        onfocusin={optional(activeContent, showHandler)}
        onfocusout={optional(activeContent, hideHandler)}
        onmouseenter={optional(activeContent && !clickable, showHandler)}
        onmouseleave={optional(activeContent && !clickable, hideHandler)}
    >
        {@render children?.()}
        {#if arrow}<div class={arrowClass}></div>{/if}
    </Frame>
{/if}
