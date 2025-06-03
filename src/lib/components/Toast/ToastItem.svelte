<script>
    import { onMount, onDestroy } from 'svelte';
    import { Tween } from 'svelte/motion';
    import { linear } from 'svelte/easing';
    import { toast } from './stores';

    /** @type {{item: import('./stores').SvelteToastOptions}} */
    let { item = $bindable() } = $props();

    /** @type {any} */
    let next = $state(item.initial);
    let prev = $derived(next);
    let paused = $state(false);
    let cprops = $state({});
    /** @type {any} */
    let unlisten;

    console.log(item.duration);

    const progress = new Tween(item.initial, { duration: item.duration, easing: linear });

    function close() {
        toast.pop(item.id);
    }

    function autoclose() {
        if (progress.current === 1 || progress.current === 0) {
            close();
        }
    }

    function pause() {
        if (!paused && progress.current !== next) {
            progress.set(progress.current, { duration: 0 });
            paused = true;
        }
    }

    function resume() {
        if (paused) {
            const d = /** @type {any} */ (item.duration);
            const currentValue = progress?.current ?? 0;
            const duration = d - d * ((currentValue - prev) / (next - prev));
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

    $effect(() => {
        if (next !== item.next) {
            next = item.next;
            prev = progress.current;
            paused = false;
            progress.set(next).then(autoclose);
        }
    });

    $effect(() => {
        if (item.component) {
            const { props = {}, sendIdTo } = item.component;
            cprops = { ...props, ...(sendIdTo && { [sendIdTo]: item.id }) };
        }
    });

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
    onmouseenter={() => {
        if (item.pausable) pause();
    }}
    onmouseleave={resume}
>
    <div role="status" class="_toastMsg" class:pe={item.component}>
        {#if item.component}
            <item.component.src {...cprops} />
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
            onclick={close}
            onkeydown={(e) => {
                if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) close();
            }}
        ></div>
    {/if}
    <progress class="_toastBar" value={progress.current}></progress>
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
