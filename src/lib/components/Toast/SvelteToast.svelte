<script>
    import { fade, fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { toast } from '$lib/components/Toast/stores';
    import ToastItem from '$lib/components/Toast/ToastItem.svelte';
    import { onMount } from 'svelte';

    /** @type {{options?: import('./stores').SvelteToastOptions, target?: (string|'default')}} */
    let { options = {}, target = 'default' } = $props();

    /** @type {import('./stores').SvelteToastOptions[]} */
    let items = $derived($toast.filter((i) => i.target === target));

    /** @param {Object<string,string|number>} [theme] */
    function getCss(theme) {
        return theme ? Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, '') : undefined;
    }

    onMount(() => {
        toast._init(target, options);
    });
</script>

<ul class="_toastContainer">
    {#each items as item (item.id)}
        <li
            class={item.classes?.join(' ')}
            in:fly|global={item.intro}
            out:fade|global
            animate:flip={{ duration: 200 }}
            style={getCss(item.theme)}
        >
            <ToastItem {item} />
        </li>
    {/each}
</ul>

<style>
    ._toastContainer {
        top: var(--toastContainerTop, 1.5rem);
        right: var(--toastContainerRight, 2rem);
        bottom: var(--toastContainerBottom, auto);
        left: var(--toastContainerLeft, auto);
        position: fixed;
        margin: 0;
        padding: 0;
        list-style-type: none;
        pointer-events: none;
        z-index: var(--toastContainerZIndex, 9999);
    }
</style>
