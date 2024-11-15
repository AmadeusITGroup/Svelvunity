<script lang="ts">
    import { CHEVRON_SVG } from '$lib/config/constants';
    import { Direction } from '$lib/enums/direction.enum';
    import { slide } from 'svelte/transition';
    import SymbolIcon from './SymbolIcon.svelte';

    export let open = false;
    export let disabled = false;
    export let showBody = true;
    export let fillEmptyChevronSpace = false;
    export let clickLogic: null | ((...args: any) => any) = null;
    export let animationDurationForShowingBody = 200;
    export let animationDurationForHidingBody = 0;
    export let buttonTestId = '';
    export let bodyTestId = '';
    export let buttonClasses = '';
    export let bodyClasses = '';

    const handleClick = () => (open = !open);
</script>

<div class={disabled ? 'accordion-button__not-allowed' : ''}>
    <div
        role="button"
        tabindex="0"
        class="accordion-button {buttonClasses} {disabled ? 'accordion-button__disabled' : ''}"
        data-cy-id={buttonTestId}
        on:click={(e) => {
            if ($$slots.body && showBody) {
                handleClick();
                clickLogic ? clickLogic(e) : null;
            }
        }}
        on:keydown={(e) => {
            if (e.code === 'Enter' || e.code === 'Space') {
                if ($$slots.body && showBody && !disabled) {
                    handleClick();
                    clickLogic ? clickLogic(e) : null;
                }
            }
        }}
    >
        {#if showBody && $$slots.body}
            <div class="accordion-button-chevron">
                <SymbolIcon
                    height={17}
                    width={17}
                    iconSVG={CHEVRON_SVG}
                    fill={disabled ? '#b3b3b3' : '#005eb8'}
                    direction={open ? Direction.Up : Direction.Down}
                />
            </div>
        {:else if !(showBody && $$slots.body) && fillEmptyChevronSpace}
            <div class="accordion-button-chevron-space-filler" />
        {/if}
        <slot name="button" />
    </div>
</div>

{#if open && $$slots.body && showBody}
    <div
        class="accordion-body {!$$slots.body && !showBody ? 'no-before' : ''} {bodyClasses}"
        in:slide|local={{ duration: animationDurationForShowingBody }}
        out:slide|local={{ duration: animationDurationForHidingBody }}
        data-cy-id={bodyTestId}
    >
        <slot name="body" />
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
