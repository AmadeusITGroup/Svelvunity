<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import { trapFocus } from '$lib/utils/actions.svelte';
    import type { Snippet } from 'svelte';
    import { CLOSE_SVG, Frame, Icon, Size } from '$lib';
    import { Position } from '$lib/enums/position.enum';

    let sizes = {
        [Size.XSmall]: 'max-w-md',
        [Size.Small]: 'max-w-lg',
        [Size.Medium]: 'max-w-2xl',
        [Size.Large]: 'max-w-4xl',
        [Size.XLarge]: 'max-w-7xl',
        [Size.Unset]: ''
    };

    let {
        open = $bindable(false),
        title = '',
        size = Size.Large,
        position = Position.Center,
        autoclose = false,
        dismissable = true,
        dismissIconLabel = '',
        outsideclose = false,
        frameClasses = '',
        backdropClasses = '',
        modalClasses = '',
        color = '',
        modalBodyClasses = '',
        extraModalProps = {},
        headerSnippet,
        footerSnippet,
        onClose,
        children
    }: {
        open?: boolean;
        title?: string;
        size?: Size;
        position?: Position;
        autoclose?: boolean;
        dismissable?: boolean;
        dismissIconLabel?: string;
        outsideclose?: boolean;
        dialogClass?: string;
        frameClasses?: string;
        backdropClasses?: string;
        modalClasses?: string;
        color?: string;
        modalBodyClasses?: string;
        extraModalProps?: Record<string, any>;
        headerSnippet?: Snippet;
        footerSnippet?: Snippet;
        onClose?: () => void;
        children?: Snippet;
    } = $props();

    let defaultBackdropClass = 'fixed inset-0 z-40 bg-gray-900/50',
        defaultFrameClasses = 'relative flex flex-col mx-auto',
        defaultDialogClasses = 'fixed inset-0 z-50 flex p-4',
        frameCls = $state<string>(twMerge(defaultFrameClasses, 'w-full divide-y', frameClasses)),
        backdropCls: string = twMerge(defaultBackdropClass, backdropClasses),
        modalWrapperCls: string = twMerge(
            defaultDialogClasses,
            modalClasses,
            ...getTailwindPositionClasses()
        ),
        previousOpenState = open;

    $effect(() => {
        frameCls = twMerge(defaultFrameClasses, 'w-full divide-y', frameClasses);
        if (previousOpenState === true && !open) {
            onClose?.();
        }
        previousOpenState = open;
    });

    function getTailwindPositionClasses() {
        switch (position) {
            case Position.TopLeft:
                return ['justify-start', 'items-start'];
            case Position.TopCenter:
                return ['justify-center', 'items-start'];
            case Position.TopRight:
                return ['justify-end', 'items-start'];

            case Position.CenterLeft:
                return ['justify-start', 'items-center'];
            case Position.Center:
                return ['justify-center', 'items-center'];
            case Position.CenterRight:
                return ['justify-end', 'items-center'];

            case Position.BottomLeft:
                return ['justify-start', 'items-end'];
            case Position.BottomCenter:
                return ['justify-center', 'items-end'];
            case Position.BottomRight:
                return ['justify-end', 'items-end'];

            default:
                return ['justify-center', 'items-center'];
        }
    }

    function escapeKeyHandler(e: KeyboardEvent) {
        if (e.key === 'Escape' && dismissable) return hide(e);
    }

    function wheelNonPassiveHandler(node: HTMLElement) {
        const wheelHandler = function (event: WheelEvent) {
            event.preventDefault();
        };

        node.addEventListener('wheel', wheelHandler, { passive: false });

        return {
            destroy() {
                node.removeEventListener('wheel', wheelHandler);
            }
        };
    }

    const onAutoClose = (e: MouseEvent) => {
        // close on any button click
        const target: Element = e.target as Element;
        if (autoclose && target?.tagName === 'BUTTON') {
            hide(e);
        }
    };

    const onOutsideClose = (e: MouseEvent) => {
        // close on click outside
        if (!outsideclose) {
            e.preventDefault();
        }

        const target: Element = e.target as Element;
        if (outsideclose && target === e.currentTarget) {
            hide(e);
        }
    };

    const hide = (e: Event) => {
        e.preventDefault();
        open = false;
    };
</script>

{#if open}
    <!-- backdrop -->
    <div class={backdropCls}></div>
    <!-- dialog -->
    <div
        onkeydown={escapeKeyHandler}
        use:wheelNonPassiveHandler
        use:trapFocus
        onclick={onAutoClose}
        onmousedown={onOutsideClose}
        class={modalWrapperCls}
        tabindex="-1"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={title}
        {...extraModalProps}
        role="dialog"
    >
        <div class="flex relative {sizes[size]} {modalWrapperCls} w-full max-h-full">
            <!-- Modal content -->

            <Frame shadow classes={frameCls} tabindex={1} action={() => {}}>
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
                        modalBodyClasses
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
