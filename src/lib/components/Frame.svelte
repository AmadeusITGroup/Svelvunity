<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { Action } from 'svelte/action';
    import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';

    setContext('background', true);

    let {
        action = () => {},
        href = undefined,
        bgColor = 'bg-white',
        textColor = 'text-gray-500',
        borderColor = 'border-gray-50 divide-gray-50',
        classes = '',
        rounded = false,
        border = false,
        tabindex = undefined,
        shadow = false,
        node = undefined,
        options = {},
        role = undefined,
        onclick = undefined,
        onfocusin = undefined,
        onfocusout = undefined,
        onmouseenter = undefined,
        onmouseleave = undefined,
        children
    }: {
        action: Action<HTMLElement, any>;
        href?: string | undefined;
        bgColor?: string;
        textColor?: string;
        borderColor?: string;
        classes?: string;
        rounded?: boolean;
        border?: boolean;
        tabindex: number | undefined;
        shadow?: boolean;
        node?: HTMLElement | undefined;
        options?: object;
        role?: string | undefined;
        onclick?: MouseEventHandler<any> | null | undefined;
        onfocusin?: FocusEventHandler<any> | undefined;
        onfocusout?: FocusEventHandler<any> | null | undefined;
        onmouseenter?: MouseEventHandler<any> | undefined;
        onmouseleave?: MouseEventHandler<any> | null | undefined;
        children?: Snippet;
    } = $props();

    let tag: string = href ? 'a' : 'div';

    let divClass: string = $state(
        twMerge(
            bgColor,
            textColor,
            rounded && 'rounded-lg',
            border && 'border',
            borderColor,
            shadow && 'shadow-md',
            classes
        )
    );
</script>

<svelte:element
    this={tag}
    use:action={options}
    bind:this={node}
    {role}
    class={divClass}
    {tabindex}
    {onclick}
    {onmouseenter}
    {onmouseleave}
    {onfocusin}
    {onfocusout}
>
    {@render children?.()}
</svelte:element>
