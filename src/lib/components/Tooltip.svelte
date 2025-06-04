<script>
    // @ts-nocheck

    import { onMount, onDestroy } from 'svelte';
    import { formatVariableKey, getMinWidth, isInViewport } from '$lib/utils/helpers';
    import { INVERSE } from '$lib//config/constants';

    let {
        content = '',
        align = 'left',
        position = $bindable('top'),
        maxWidth = 200,
        style = null,
        theme = '',
        animation = '',
        arrow = true,
        autoPosition = false,
        testId = '',
        children
    } = $props();

    let containerRef = $state(null);
    let tooltipRef = $state(null);
    let minWidth = $state(0);
    let component = null;
    let initialPosition = position;
    let animationEffect = $state(null);
    let show = $state(false);
    let timer = null;

    const onMouseEnter = () => {
        const delay = animation ? 200 : 0;

        if (autoPosition && !isInViewport(tooltipRef)) {
            position = INVERSE[position];
        }

        if (animation) {
            animationEffect = animation;
        }

        timer = setTimeout(() => (show = true), delay);
    };

    const onMouseLeave = () => {
        show = false;
        position = initialPosition;
        animationEffect = null;

        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    onMount(() => {
        if (containerRef !== null) {
            containerRef.addEventListener('focusin', onMouseEnter);
            containerRef.addEventListener('focusout', onMouseLeave);
            containerRef.addEventListener('mouseenter', onMouseEnter);
            containerRef.addEventListener('mouseleave', onMouseLeave);
        }

        if (tooltipRef !== null) {
            if (isComponent && !component) {
                component = new content.component({
                    target: tooltipRef,
                    props: content.props
                });
            }

            minWidth = getMinWidth(tooltipRef, maxWidth);

            if (style && typeof style === 'object') {
                for (let prop in style) {
                    const key = formatVariableKey(prop);
                    const value = style[prop];

                    tooltipRef.style.setProperty(`--tooltip-${key}`, value);
                }
            }
        }
    });

    onDestroy(() => {
        if (component) {
            component.$destroy();
            component = null;
        }

        if (containerRef !== null) {
            containerRef.removeEventListener('focusin', onMouseEnter);
            containerRef.removeEventListener('focusout', onMouseLeave);
            containerRef.removeEventListener('mouseenter', onMouseEnter);
            containerRef.removeEventListener('mouseleave', onMouseLeave);
        }
    });

    let isComponent = $derived(typeof content === 'object');
</script>

<span data-cy-id={testId !== '' ? testId : null} bind:this={containerRef} class="tooltip-container">
    {@render children?.()}
    <div
        bind:this={tooltipRef}
        class="tooltip animation-{animationEffect} {position} {theme}"
        class:arrowless={!arrow}
        class:show
        style="--min-width: {minWidth}px; --max-width: {maxWidth}px; --text-align: {align};"
    >
        {#if !isComponent}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html content}
        {/if}
    </div>
</span>

<style>
    /*--------------------------*
     * Theme Variables
     *--------------------------*/

    :root {
        --tooltip-background-color: #666;
        --tooltip-border-radius: 0.25rem;
        --tooltip-box-shadow: none;
        --tooltip-font-family: sans-serif;
        --tooltip-font-size: 0.875em;
        --tooltip-font-weight: 400;
        --tooltip-line-height: 1.25rem;
        --tooltip-color: #fff;
        --tooltip-offset-x: 0px;
        --tooltip-offset-y: 0px;
        --tooltip-padding: 0.125rem 0.5rem;
        --tooltip-z-index: 10;
        --tooltip-arrow-size: 0.325rem;
    }

    /*--------------------------*
     * Tooltip Styling
     *--------------------------*/

    .tooltip-container {
        position: relative;
    }

    .tooltip {
        background-color: var(--tooltip-background-color);
        box-shadow: var(--tooltip-box-shadow);
        border-radius: var(--tooltip-border-radius);
        color: var(--tooltip-color);
        opacity: 0;
        font-family: var(--tooltip-font-family);
        font-size: var(--tooltip-font-size);
        font-style: normal;
        font-weight: var(--tooltip-font-weight);
        line-height: var(--tooltip-line-height);
        padding: var(--tooltip-padding);
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        z-index: var(--tooltip-z-index);

        min-width: var(--min-width);
        max-width: var(--max-width);
        text-align: var(--text-align);
    }

    .tooltip.show {
        opacity: 1;
        visibility: visible;
        white-space: normal;
    }

    .tooltip.bottom:after,
    .tooltip.left:after,
    .tooltip.right:after,
    .tooltip.top:after {
        border: var(--tooltip-arrow-size) solid var(--tooltip-background-color);
        content: ' ';
        position: absolute;
    }

    .tooltip.arrowless:after {
        border: 0 !important;
    }

    .tooltip.bottom,
    .tooltip.top {
        --tooltip-offset-x: 0px;
        --tooltip-offset-y: 12px;
    }

    .tooltip.left,
    .tooltip.right {
        --tooltip-offset-x: 12px;
        --tooltip-offset-y: 0px;
    }

    .tooltip.bottom {
        bottom: 0;
        left: 50%;
        transform: translate(
            calc(-50% + var(--tooltip-offset-x)),
            calc(100% + var(--tooltip-offset-y))
        );
    }

    .tooltip.bottom:after {
        border-color: transparent transparent var(--tooltip-background-color);
        left: 50%;
        top: 0;
        transform: translate(-50%, -99%);
    }

    .tooltip.top {
        left: 50%;
        top: 0;
        transform: translate(
            calc(-50% + var(--tooltip-offset-x)),
            calc(-100% - var(--tooltip-offset-y))
        );
    }

    .tooltip.top:after {
        border-color: var(--tooltip-background-color) transparent transparent transparent;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 99%);
    }

    .tooltip.left {
        left: 0;
        top: 50%;
        transform: translate(
            calc(-100% - var(--tooltip-offset-x)),
            calc(-50% - var(--tooltip-offset-y))
        );
    }

    .tooltip.left:after {
        border-color: transparent transparent transparent var(--tooltip-background-color);
        right: 0;
        top: 50%;
        transform: translate(99%, -50%);
    }

    .tooltip.right {
        right: 0;
        top: 50%;
        transform: translate(
            calc(100% + var(--tooltip-offset-x)),
            calc(-50% - var(--tooltip-offset-y))
        );
    }

    .tooltip.right:after {
        border-color: transparent var(--tooltip-background-color) transparent transparent;
        left: 0;
        top: 50%;
        transform: translate(-99%, -50%);
    }

    /*--------------------------*
     * CSS Animations
     *--------------------------*/

    /* Fade */

    .tooltip.animation-fade {
        opacity: 0;
        transition: opacity 0.25s ease-in-out;
    }

    .tooltip.animation-fade.show {
        opacity: 1;
    }

    /* Slide */

    .tooltip.top.animation-slide {
        margin-top: 10px;
        opacity: 0;
        transition:
            opacity 0.25s ease-in-out,
            margin 0.25s ease-in-out;
    }

    .tooltip.top.animation-slide.show {
        margin-top: 0;
        opacity: 1;
    }

    .tooltip.bottom.animation-slide {
        margin-bottom: 20px;
        opacity: 0;
        transition:
            opacity 0.25s ease-in-out,
            margin 0.25s ease-in-out;
    }

    .tooltip.bottom.animation-slide.show {
        margin-bottom: 0;
        opacity: 1;
    }

    .tooltip.right.animation-slide {
        margin-right: 20px;
        opacity: 0;
        transition:
            opacity 0.25s ease-in-out,
            margin 0.25s ease-in-out;
    }

    .tooltip.right.animation-slide.show {
        margin-right: 0;
        opacity: 1;
    }

    .tooltip.left.animation-slide {
        margin-left: 20px;
        opacity: 0;
        transition:
            opacity 0.25s ease-in-out,
            margin 0.25s ease-in-out;
    }

    .tooltip.left.animation-slide.show {
        margin-left: 0;
        opacity: 1;
    }

    /* Puff */

    .tooltip.left.animation-puff {
        filter: blur(2px);
        opacity: 0;
        transform: translate(
                calc(-100% - var(--tooltip-offset-x)),
                calc(-50% - var(--tooltip-offset-y))
            )
            scale(2, 2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            filter 0.25s ease-in-out,
            transform 0.25s ease-in-out;
    }

    .tooltip.left.animation-puff.show {
        filter: blur(0);
        opacity: 1;
        transform: translate(
                calc(-100% - var(--tooltip-offset-x)),
                calc(-50% - var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.right.animation-puff {
        filter: blur(2px);
        opacity: 0;
        transform: translate(
                calc(100% + var(--tooltip-offset-x)),
                calc(-50% - var(--tooltip-offset-y))
            )
            scale(2, 2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            filter 0.25s ease-in-out,
            transform 0.25s ease-in-out;
    }

    .tooltip.right.animation-puff.show {
        filter: blur(0);
        opacity: 1;
        transform: translate(
                calc(100% + var(--tooltip-offset-x)),
                calc(-50% - var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.top.animation-puff {
        filter: blur(2px);
        opacity: 0;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(-100% - var(--tooltip-offset-y))
            )
            scale(2, 2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            filter 0.25s ease-in-out,
            transform 0.25s ease-in-out;
    }

    .tooltip.top.animation-puff.show {
        filter: blur(0);
        opacity: 1;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(-100% - var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.bottom.animation-puff {
        filter: blur(2px);
        opacity: 0;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(100% + var(--tooltip-offset-y))
            )
            scale(2, 2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            filter 0.25s ease-in-out,
            transform 0.25s ease-in-out;
    }

    .tooltip.bottom.animation-puff.show {
        filter: blur(0);
        opacity: 1;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(100% + var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    /* Bounce */

    .tooltip.left.animation-bounce {
        opacity: 0;
        transform: translate(
                calc(-100% - var(--tooltip-offset-x)),
                calc(-50% + var(--tooltip-offset-y))
            )
            scale(1.2, 1.2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            transform 0.25s cubic-bezier(0.5, -1, 0.5, 3);
    }

    .tooltip.left.animation-bounce.show {
        opacity: 1;
        transform: translate(
                calc(-100% - var(--tooltip-offset-x)),
                calc(-50% + var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.right.animation-bounce {
        opacity: 0;
        transform: translate(
                calc(100% + var(--tooltip-offset-x)),
                calc(-50% + var(--tooltip-offset-y))
            )
            scale(1.2, 1.2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            transform 0.25s cubic-bezier(0.5, -1, 0.5, 3);
    }

    .tooltip.right.animation-bounce.show {
        opacity: 1;
        transform: translate(
                calc(100% + var(--tooltip-offset-x)),
                calc(-50% + var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.top.animation-bounce {
        opacity: 0;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(-100% - var(--tooltip-offset-y))
            )
            scale(1.2, 1.2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            transform 0.25s cubic-bezier(0.5, -1, 0.5, 3);
    }

    .tooltip.top.animation-bounce.show {
        opacity: 1;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(-100% - var(--tooltip-offset-y))
            )
            scale(1, 1);
    }

    .tooltip.bottom.animation-bounce {
        opacity: 0;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(100% + var(--tooltip-offset-y))
            )
            scale(1.2, 1.2);
        transform-origin: 50% 50%;
        transition:
            opacity 0.25s ease-in-out,
            transform 0.25s cubic-bezier(0.5, -1, 0.5, 3);
    }

    .tooltip.bottom.animation-bounce.show {
        opacity: 1;
        transform: translate(
                calc(-50% + var(--tooltip-offset-x)),
                calc(100% + var(--tooltip-offset-y))
            )
            scale(1, 1);
    }
</style>
