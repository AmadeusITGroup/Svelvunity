<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';
    import type { Action } from 'svelte/action';
    import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';

    const noop = () => {};

    setContext('background', true);

    let {
        href = undefined,
        bgColor = 'bg-white',
        textColor = 'text-gray-500',
        borderColor = 'border-gray-50 divide-gray-50',
        customClasses = '',
        rounded = false,
        border = false,
        shadow = false,
        node = undefined,
        use = noop,
        options = {},
        role = undefined,
        onclick = undefined,
        onfocusin = undefined,
        onfocusout = undefined,
        onmouseenter = undefined,
        onmouseleave = undefined,
        children,
        ...restProps
    }: {
        href?: string | undefined;
        bgColor?: string;
        textColor?: string;
        borderColor?: string;
        customClasses?: string;
        rounded?: boolean;
        border?: boolean;
        shadow?: boolean;
        node?: HTMLElement | undefined;
        use?: Action<HTMLElement, unknown>;
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

    let divClass: string = twMerge(
        bgColor,
        textColor,
        rounded && 'rounded-lg',
        border && 'border',
        borderColor,
        shadow && 'shadow-md',
        customClasses
    );
</script>

<svelte:element
    this={tag}
    use:use={options}
    bind:this={node}
    {role}
    class={divClass}
    {...restProps}
    {onclick}
    {onmouseenter}
    {onmouseleave}
    {onfocusin}
    {onfocusout}
>
    {@render children?.()}
</svelte:element>
