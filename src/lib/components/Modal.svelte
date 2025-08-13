<script lang="ts">
    import { trapFocus } from '$lib/utils/actions.svelte';
    import type { Snippet } from 'svelte';
    import { CLOSE_SVG, Frame, Icon, Size } from '$lib';
    import { Position } from '$lib/enums/position.enum';

    let sizes = {
        [Size.XSmall]: 'modal-xs',
        [Size.Small]: 'modal-sm',
        [Size.Medium]: 'modal-md',
        [Size.Large]: 'modal-lg',
        [Size.XLarge]: 'modal-xl',
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

    let previousOpenState = open;

    $effect(() => {
        if (previousOpenState === true && !open) {
            onClose?.();
        }
        previousOpenState = open;
    });

    function positionToClass(position: Position) {
        switch (position) {
            case Position.TopLeft:
                return 'modal--top-left';
            case Position.TopCenter:
                return 'modal--top-center';
            case Position.TopRight:
                return 'modal--top-right';
            case Position.CenterLeft:
                return 'modal--center-left';
            case Position.Center:
                return 'modal--center';
            case Position.CenterRight:
                return 'modal--center-right';
            case Position.BottomLeft:
                return 'modal--bottom-left';
            case Position.BottomCenter:
                return 'modal--bottom-center';
            case Position.BottomRight:
                return 'modal--bottom-right';
            default:
                return 'modal--center';
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
        const target: Element = e.target as Element;
        if (autoclose && target?.tagName === 'BUTTON') {
            hide(e);
        }
    };

    const onOutsideClose = (e: MouseEvent) => {
        const target = e.target as Element;
        const isBackdropClick = target === e.currentTarget;
        if (!isBackdropClick) return;

        if (!outsideclose) {
            e.preventDefault();
        } else {
            hide(e);
        }
    };

    const hide = (e: Event) => {
        e.preventDefault();
        open = false;
    };
</script>

{#if open}
    <div class="modal-backdrop {backdropClasses}"></div>

    <div
        onkeydown={escapeKeyHandler}
        use:wheelNonPassiveHandler
        use:trapFocus
        onclick={onAutoClose}
        onmousedown={onOutsideClose}
        class="modal-dialog {positionToClass(position)} {modalClasses}"
        tabindex="-1"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={title}
        {...extraModalProps}
        role="dialog"
    >
        <div class="modal-content {sizes[size]} {modalClasses}">
            <Frame shadow classes="modal-frame {frameClasses}" tabindex={1} action={() => {}}>
                {#if headerSnippet || title}
                    <Frame tabindex={1} action={() => {}} bgColor={color} classes="modal-header">
                        {#if title}
                            <h3 class="modal-title" class:gray-900={!color}>{title}</h3>
                        {/if}
                        {@render headerSnippet?.()}
                        {#if dismissable}
                            <Icon
                                iconSVG={CLOSE_SVG}
                                label={dismissIconLabel}
                                clickLogic={hide}
                                height={24}
                                width={24}
                                viewBox="-70 0 448 512"
                                classes="modal-close-icon"
                                fill="#000"
                            />
                        {/if}
                    </Frame>
                {/if}

                <div class="modal-body {modalBodyClasses}" role="document">
                    {#if dismissable && !headerSnippet && !title}
                        <Icon
                            iconSVG={CLOSE_SVG}
                            clickLogic={hide}
                            height={24}
                            width={24}
                            viewBox="-70 0 448 512"
                            classes="modal-close-icon"
                            fill="#000"
                        />
                    {/if}
                    {@render children?.()}
                </div>

                {#if footerSnippet}
                    <Frame bgColor={color} tabindex={1} action={() => {}} classes="modal-footer">
                        {@render footerSnippet()}
                    </Frame>
                {/if}
            </Frame>
        </div>
    </div>
{/if}

<style>
    .modal--top-left {
        justify-content: flex-start;
        align-items: flex-start;
    }
    .modal--top-center {
        justify-content: center;
        align-items: flex-start;
    }
    .modal--top-right {
        justify-content: flex-end;
        align-items: flex-start;
    }
    .modal--center-left {
        justify-content: flex-start;
        align-items: center;
    }
    .modal--center {
        justify-content: center;
        align-items: center;
    }
    .modal--center-right {
        justify-content: flex-end;
        align-items: center;
    }
    .modal--bottom-left {
        justify-content: flex-start;
        align-items: flex-end;
    }
    .modal--bottom-center {
        justify-content: center;
        align-items: flex-end;
    }
    .modal--bottom-right {
        justify-content: flex-end;
        align-items: flex-end;
    }
    .modal-xs {
        max-width: 28rem;
    }
    .modal-sm {
        max-width: 32rem;
    }
    .modal-md {
        max-width: 42rem;
    }
    .modal-lg {
        max-width: 56rem;
    }
    .modal-xl {
        max-width: 80rem;
    }

    .gray-900 {
        color: #111827;
    }

    .modal-backdrop {
        box-sizing: border-box;
        position: fixed;
        inset: 0;
        z-index: 40;
        background-color: rgba(17, 24, 39, 0.5);
        border: 0px solid;
    }

    :global(.modal-header) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 2px solid #d1d5db;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background: inherit;
    }

    :global(.modal-close-icon) {
        cursor: pointer;
        min-height: 24px;
        min-width: 24px;
        rotate: 45deg;
    }

    :global(.modal-footer) {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        gap: 0.5rem;
        justify-content: right;
        border-top: 1px solid #d1d5db;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background: inherit;
        flex-wrap: wrap;
        min-height: 66px;
    }

    .modal-frame {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
    }

    .modal-frame > * + * {
        border-top: 1px solid #e5e7eb;
    }

    .modal-dialog {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        padding: 1rem;
        width: 100%;
        height: 100%;
    }

    .modal-title {
        font-size: 1.15rem;
        font-weight: 600;
        line-height: 1.75rem;
        margin: 0;
        color: #111827;
        letter-spacing: -0.01em;
    }

    .modal-body {
        padding: 1.5rem;
        flex: 1 1 auto;
        overflow-y: auto;
        overscroll-behavior: contain;
    }

    .modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: 1rem;
        width: 100%;
        max-height: 100%;
        background: none;
        overflow: hidden;
    }
</style>
