<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
    import { setContext } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { Action } from 'svelte/action';

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};

    setContext('background', true);

    export let tag: string = $$restProps.href ? 'a' : 'div';
    export let bgColor = 'bg-white';
    export let textColor = 'text-gray-500';
    export let borderColor = 'border-gray-50 divide-gray-50';
    export let rounded = false;
    export let border = false;
    export let shadow = false;
    // For components development
    export let node: HTMLElement | undefined = undefined;
    // Action function and its params
    export let use: Action<HTMLElement, any> = noop;
    export let options = {};
    export let role: string | undefined = undefined;

    let divClass: string;
    $: divClass = twMerge(
        bgColor,
        textColor,
        rounded && 'rounded-lg',
        border && 'border',
        borderColor,
        shadow && 'shadow-md',
        $$props.class
    );
</script>

<svelte:element
    this={tag}
    use:use={options}
    bind:this={node}
    {role}
    {...$$restProps}
    class={divClass}
    on:click
    on:mouseenter
    on:mouseleave
    on:focusin
    on:focusout
>
    <slot />
</svelte:element>
