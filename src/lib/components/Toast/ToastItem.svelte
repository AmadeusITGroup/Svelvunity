<script>
    import { onMount, onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { linear } from 'svelte/easing';
    import { toast } from './stores';

    /** @type {import('./stores').SvelteToastOptions} */
    export let item;

    /** @type {any} */
    let next = item.initial;
    let prev = next;
    let paused = false;
    let cprops = {};
    /** @type {any} */
    let unlisten;

    const progress = tweened(item.initial, { duration: item.duration, easing: linear });

    function close() {
        toast.pop(item.id);
    }

    function autoclose() {
        if ($progress === 1 || $progress === 0) close();
    }

    function pause() {
        if (!paused && $progress !== next) {
            progress.set($progress, { duration: 0 });
            paused = true;
        }
    }

    function resume() {
        if (paused) {
            const d = /** @type {any} */ (item.duration);
            const duration = d - d * (($progress - prev) / (next - prev));
            progress.set(next, { duration }).then(autoclose);
            paused = false;
        }
    }

    /** @param {any} prop */
    function check(prop, kind = 'undefined') {
        return typeof prop === kind;
    }

    function listen(d = document) {
        if (check(d.hidden)) return;
        const handler = () => (d.hidden ? pause() : resume());
        const name = 'visibilitychange';
        d.addEventListener(name, handler);
        unlisten = () => d.removeEventListener(name, handler);
        handler();
    }

    $: if (next !== item.next) {
        next = item.next;
        prev = $progress;
        paused = false;
        progress.set(next).then(autoclose);
    }

    $: if (item.component) {
        const { props = {}, sendIdTo } = item.component;
        cprops = { ...props, ...(sendIdTo && { [sendIdTo]: item.id }) };
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    $: if (!check(item.progress)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item.next = item.progress;
    }

    onMount(listen);

    onDestroy(() => {
        if (check(item.onpop, 'function')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            item.onpop(item.id);
        }
        unlisten && unlisten();
    });
</script>

<div
    class="_toastItem"
    class:pe={item.pausable}
    role="button"
    tabindex="0"
    on:mouseenter={() => {
        if (item.pausable) pause();
    }}
    on:mouseleave={resume}
>
    <div role="status" class="_toastMsg" class:pe={item.component}>
        {#if item.component}
            <svelte:component this={item.component.src} {...cprops} />
        {:else}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html item.msg}
        {/if}
    </div>
    {#if item.dismissable}
        <div
            class="_toastBtn pe"
            role="button"
            tabindex="0"
            on:click={close}
            on:keydown={(e) => {
                if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) close();
            }}
        ></div>
    {/if}
    <progress class="_toastBar" value={$progress} />
</div>

<style>
    ._toastItem {
        width: var(--toastWidth, 16rem);
        height: var(--toastHeight, auto);
        min-height: var(--toastMinHeight, 3.5rem);
        margin: var(--toastMargin, 0 0 0.5rem 0);
        padding: var(--toastPadding, 0);
        background: var(--toastBackground, rgba(66, 66, 66, 0.9));
        color: var(--toastColor, 'amadeusgrey');
        border: var(--toastBorder, none);
        border-left-width: var(--toastLeftBorder, 3px);
        border-left-color: var(--toastLeftBorderColor, none);
        border-radius: var(--toastBorderRadius, 0.125rem);
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        will-change: transform, opacity;
        -webkit-tap-highlight-color: transparent;
    }
    ._toastMsg {
        padding: var(--toastMsgPadding, 0.75rem 0.5rem);
        flex: 1 1 0%;
    }
    .pe,
    ._toastMsg :global(a) {
        pointer-events: auto;
    }
    ._toastBtn {
        width: var(--toastBtnWidth, 2rem);
        height: var(--toastBtnHeight, 100%);
        cursor: pointer;
        outline: none;
    }
    ._toastBtn::after {
        content: var(--toastBtnContent, '✕');
        font: var(--toastBtnFont, 1rem sans-serif);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._toastBar {
        top: var(--toastBarTop, auto);
        right: var(--toastBarRight, auto);
        bottom: var(--toastBarBottom, 0);
        left: var(--toastBarLeft, 0);
        height: var(--toastBarHeight, 0);
        width: var(--toastBarWidth, 100%);
        position: absolute;
        display: block;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: none;
        background: transparent;
        pointer-events: none;
    }
    ._toastBar::-webkit-progress-bar {
        background: transparent;
    }
    ._toastBar::-webkit-progress-value {
        background: var(
            --toastProgressBackground,
            var(--toastBarBackground, rgba(33, 150, 243, 0.75))
        );
    }
    ._toastBar::-moz-progress-bar {
        background: var(
            --toastProgressBackground,
            var(--toastBarBackground, rgba(33, 150, 243, 0.75))
        );
    }
</style>
