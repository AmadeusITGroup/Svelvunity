<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import { trapFocus } from '$lib/utils/actions.svelte';
    import type { Snippet } from 'svelte';
    import { CLOSE_SVG, Frame, Icon } from '$lib';

    interface Sizes {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        [key: string]: string;
    }

    const sizes: Sizes = {
        xs: 'max-w-md',
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-7xl'
    };

    let {
        open = $bindable(false),
        title = '',
        size = 'lg',
        placement = 'center',
        autoclose = false,
        dismissable = true,
        dismissIconLabel = '',
        backdropClass = 'fixed inset-0 z-40 bg-gray-900/50',
        defaultClass = 'relative flex flex-col mx-auto',
        outsideclose = false,
        dialogClass = 'fixed inset-0 z-50 flex p-4',
        className = '',
        classBackdrop = '',
        classDialog = '',
        color = '',
        bodyClass = '',
        wrapperProps = {},
        headerSnippet,
        footerSnippet,
        onOpen,
        onClose,
        children
    }: {
        open?: boolean;
        title?: string;
        size?: string;
        placement?: string;
        autoclose?: boolean;
        dismissable?: boolean;
        dismissIconLabel?: string;
        backdropClass?: string;
        defaultClass?: string;
        outsideclose?: boolean;
        dialogClass?: string;
        className?: string;
        classBackdrop?: string;
        classDialog?: string;
        color?: string;
        bodyClass?: string;
        wrapperProps?: Record<string, any>;
        headerSnippet?: Snippet;
        footerSnippet?: Snippet;
        onOpen?: () => void;
        onClose?: () => void;
        children?: Snippet;
    } = $props();

    let frameClass = $state<string>('');
    let backdropCls: string = twMerge(backdropClass, classBackdrop);
    let modalWrapperCls: string = twMerge(dialogClass, classDialog, ...getPlacementClasses());

    $effect(() => {
        frameClass = twMerge(defaultClass, 'w-full divide-y', className);
        if (open) {
            onOpen?.();
        } else {
            onClose?.();
        }
    });

    function prepareFocus(node: HTMLElement) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
            if (n instanceof HTMLElement) {
                const el = n as HTMLElement;
                const [x, y] = isScrollable(el);
                if (x || y) el.tabIndex = 0;
            }
        }
        node.focus();
    }

    function getPlacementClasses() {
        switch (placement) {
            // top
            case 'top-left':
                return ['justify-start', 'items-start'];
            case 'top-center':
                return ['justify-center', 'items-start'];
            case 'top-right':
                return ['justify-end', 'items-start'];

            // center
            case 'center-left':
                return ['justify-start', 'items-center'];
            case 'center':
                return ['justify-center', 'items-center'];
            case 'center-right':
                return ['justify-end', 'items-center'];

            // bottom
            case 'bottom-left':
                return ['justify-start', 'items-end'];
            case 'bottom-center':
                return ['justify-center', 'items-end'];
            case 'bottom-right':
                return ['justify-end', 'items-end'];

            default:
                return ['justify-center', 'items-center'];
        }
    }

    function handleKeys(e: KeyboardEvent) {
        if (e.key === 'Escape' && dismissable) return hide(e);
    }

    function wheelHandler(event: WheelEvent) {
        event.preventDefault();
    }

    function wheelNonPassive(node: HTMLElement) {
        node.addEventListener('wheel', wheelHandler, { passive: false });

        return {
            destroy() {
                node.removeEventListener('wheel', wheelHandler);
            }
        };
    }

    const onAutoClose = (e: MouseEvent) => {
        const target: Element = e.target as Element;
        if (autoclose && target?.tagName === 'BUTTON') {
            hide(e); // close on any button click
        }
    };

    const onOutsideClose = (e: MouseEvent) => {
        if (!outsideclose) {
            e.preventDefault();
        }

        const target: Element = e.target as Element;
        if (outsideclose && target === e.currentTarget) {
            hide(e); // close on click outside
        }
    };

    const hide = (e: Event) => {
        e.preventDefault();
        open = false;
    };

    const isScrollable = (e: HTMLElement): boolean[] => [
        e.scrollWidth > e.clientWidth &&
            ['scroll', 'auto'].indexOf(getComputedStyle(e).overflowX) >= 0,
        e.scrollHeight > e.clientHeight &&
            ['scroll', 'auto'].indexOf(getComputedStyle(e).overflowY) >= 0
    ];
</script>

{#if open}
    <!-- backdrop -->
    <div class={backdropCls}></div>
    <!-- dialog -->
    <div
        onkeydown={handleKeys}
        use:wheelNonPassive
        use:prepareFocus
        use:trapFocus
        onclick={onAutoClose}
        onmousedown={onOutsideClose}
        class={modalWrapperCls}
        tabindex="-1"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={title}
        {...wrapperProps}
        role="dialog"
    >
        <div class="flex relative {sizes[size]} {modalWrapperCls} w-full max-h-full">
            <!-- Modal content -->

            <Frame shadow classes={frameClass} tabindex={1} action={() => {}}>
                <!-- Modal header -->
                {#if headerSnippet || title}
                    <Frame
                        tabindex={1}
                        action={() => {}}
                        bgColor={color}
                        classes="flex justify-between items-center p-4 rounded-t-lg border-b border-gray-300"
                    >
                        {#if title}
                            <h3
                                class="text-lg xs:text-xl font-semibold p-0"
                                class:text-gray-900={!color}
                            >
                                {title}
                            </h3>
                        {/if}
                        {@render headerSnippet?.()}

                        {#if dismissable}
                            <Icon
                                iconSVG={CLOSE_SVG}
                                label={dismissIconLabel}
                                clickLogic={hide}
                                height={24}
                                width={24}
                                classes="cursor-pointer !rotate-45 !min-h-[24px] !min-w-[24px]"
                                fill="#000"
                            />
                        {/if}
                    </Frame>
                {/if}

                <!-- Modal body -->
                <div
                    class={twMerge(
                        'p-6 space-y-6 flex-1 overflow-y-auto overscroll-contain',
                        bodyClass
                    )}
                    role="document"
                >
                    {#if dismissable && !headerSnippet && !title}
                        <Icon
                            iconSVG={CLOSE_SVG}
                            clickLogic={hide}
                            height={24}
                            width={24}
                            classes="cursor-pointer !rotate-45 !min-h-[24px] !min-w-[24px]"
                            fill="#000"
                        />
                    {/if}

                    {@render children?.()}
                </div>

                <!-- Modal footer -->
                {#if footerSnippet}
                    <Frame
                        bgColor={color}
                        tabindex={1}
                        action={() => {}}
                        classes="flex items-center p-6 space-x-2 rtl:space-x-reverse rounded-b-lg justify-end !border-gray-300"
                    >
                        {@render footerSnippet()}
                    </Frame>
                {/if}
            </Frame>
        </div>
    </div>
{/if}
