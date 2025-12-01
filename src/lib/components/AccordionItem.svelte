<script lang="ts">
    import { CHEVRON_SVG } from '$lib/config/constants';
    import { Direction } from '$lib/enums/direction.enum';
    import { slide } from 'svelte/transition';
    import SymbolIcon from './SymbolIcon.svelte';
    import { type Snippet } from 'svelte';

    let {
        open = false,
        disabled = false,
        showBody = true,
        fillEmptyChevronSpace = false,
        clickLogic = null,
        animationDurationForShowingBody = 200,
        animationDurationForHidingBody = 0,
        buttonTestId = '',
        bodyTestId = '',
        buttonClasses = '',
        bodyClasses = '',
        bodySnippet,
        buttonSnippet
    }: {
        open?: boolean;
        disabled?: boolean;
        showBody?: boolean;
        fillEmptyChevronSpace?: boolean;
        clickLogic?: null | ((...args: unknown[]) => unknown);
        animationDurationForShowingBody?: number;
        animationDurationForHidingBody?: number;
        buttonTestId?: string;
        bodyTestId?: string;
        buttonClasses?: string;
        bodyClasses?: string;
        bodySnippet?: Snippet<[]> | undefined;
        buttonSnippet?: Snippet<[]> | undefined;
    } = $props();

    let isOpened = $derived(open);

    const handleClick = () => (isOpened = !isOpened);
</script>

<div class={disabled ? 'accordion-button__not-allowed' : ''}>
    <div
        role="button"
        tabindex="0"
        class="accordion-button {buttonClasses} {disabled ? 'accordion-button__disabled' : ''}"
        data-cy-id={buttonTestId}
        onclick={(e) => {
            if (bodySnippet && showBody) {
                handleClick();
                if (clickLogic) {
                    clickLogic(e);
                }
            }
        }}
        onkeydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                if (bodySnippet && showBody && !disabled) {
                    handleClick();
                    if (clickLogic) {
                        clickLogic(e);
                    }
                }
            }
        }}
    >
        {#if showBody && bodySnippet}
            <div class="accordion-button-chevron">
                <SymbolIcon
                    height={17}
                    width={17}
                    iconSVG={CHEVRON_SVG}
                    fill={disabled ? '#b3b3b3' : '#005eb8'}
                    direction={isOpened ? Direction.Up : Direction.Down}
                />
            </div>
        {:else if !(showBody && bodySnippet) && fillEmptyChevronSpace}
            <div class="accordion-button-chevron-space-filler"></div>
        {/if}

        {#if buttonSnippet}
            {@render buttonSnippet()}
        {/if}
    </div>
</div>

{#if isOpened && bodySnippet && showBody}
    <div
        class="accordion-body {bodyClasses}"
        in:slide|local={{ duration: animationDurationForShowingBody }}
        out:slide|local={{ duration: animationDurationForHidingBody }}
        data-cy-id={bodyTestId}
    >
        {@render bodySnippet()}
    </div>
{/if}

<style>
    .accordion-button {
        display: var(--accordion-button-display, flex);
        align-items: var(--accordion-button-align-items, center);
        width: var(--accordion-button-width, 100%);
        font-size: var(--accordion-button-font-size, 1rem);
        color: var(--accordion-button-color, #1a1a1a);
        text-align: var(--accordion-button-text-align, left);
        background-color: var(--accordion-button-bg-color, #fff);
        overflow-anchor: none;
        cursor: var(--accordion-button-cursor, pointer);

        padding-top: var(--accordion-button-pt, 0.75rem);
        padding-right: var(--accordion-button-pr, 1rem);
        padding-bottom: var(--accordion-button-pb, 0.75rem);
        padding-left: var(--accordion-button-pl, 1rem);

        border-top: var(--accordion-button-border-t, 1px);
        border-left: var(--accordion-button-border-l, 1px);
        border-bottom: var(--accordion-button-border-b, 1px);
        border-right: var(--accordion-button-border-r, 1px);

        border-style: var(--accordion-button-border-style, solid);
        border-color: var(--accordion-button-border-color, #ccc);

        &:hover {
            background-color: var(--accordion-button-hover-bg-color, #f4f9fb);
        }

        &.accordion-button__disabled {
            color: var(--accordion-button-disabled-color, rgba(66, 66, 66, 0.9));
            background-color: var(--accordion-button-disabled-bg-color, #e6e6e6);
            opacity: var(--accordion-button-disabled-opacity, 1);
            pointer-events: none;
        }
    }

    div.accordion-button:focus {
        position: relative;
        outline: none;
        box-shadow: var(--accordion-button-focus-box-shadow, 0 0 0 0.25rem rgba(0, 94, 184, 0.25));
        z-index: var(--accordion-button-focus-shadow-z-index, 1);
    }
    div.accordion-button:focus:not(:focus-visible) {
        outline: 0;
    }

    .accordion-button__not-allowed {
        cursor: var(--accordion-button-disabled-cursor, not-allowed);
    }

    .accordion-button-chevron {
        padding-top: var(--accordion-button-chevron-pt, 0rem);
        padding-right: var(--accordion-button-chevron-pr, 0.75rem);
        padding-bottom: var(--accordion-button-chevron-pb, 0rem);
        padding-left: var(--accordion-button-chevron-pl, 0rem);
    }

    .accordion-button-chevron-space-filler {
        min-width: var(--accordion-button-chevron-space-filler-size, 29px);
    }

    .accordion-body {
        background-color: var(--accordion-body-bg-color, #fff);
        padding-top: var(--accordion-body-pt, 0.75rem);
        padding-right: var(--accordion-body-pr, 1rem);
        padding-bottom: var(--accordion-body-pb, 0.75rem);
        padding-left: var(--accordion-body-pl, 1rem);

        border-top: var(--accordion-body-border-t, 0px);
        border-left: var(--accordion-body-border-l, 1px);
        border-bottom: var(--accordion-body-border-b, 1px);
        border-right: var(--accordion-body-border-r, 1px);

        border-style: var(--accordion-body-border-style, solid);
        border-color: var(--accordion-body-border-color, #ccc);
    }
</style>
