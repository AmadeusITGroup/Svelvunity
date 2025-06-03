<script lang="ts">
    import { Direction } from '$lib/enums/direction.enum';
    import SymbolIcon from './SymbolIcon.svelte';

    interface Props {
        iconSVG: string;
        viewBox?: string;
        height?: number;
        width?: number;
        fill?: string;
        direction?: Direction;
        clickLogic?: null | ((...args: any) => any);
        classes?: string;
        testId?: string;
        label?: string;
    }

    let {
        iconSVG,
        viewBox = '0 0 448 512',
        height = 22,
        width = 22,
        fill = '#005eb8',
        direction = Direction.Up,
        clickLogic = null,
        classes = '',
        testId = '',
        label = 'gf'
    }: Props = $props();

    function handleKeyboardPress(e: KeyboardEvent): null | ((...args: unknown[]) => unknown) {
        if (clickLogic) {
            switch (e.key) {
                case 'Enter':
                    return clickLogic(e);
                default:
                    return null;
            }
        }
        return null;
    }
</script>

<button
    class="button-icon cursor-pointer p-1"
    onclick={(e) => clickLogic?.(e)}
    onkeypress={(e) => handleKeyboardPress?.(e)}
    aria-label={label}
    tabindex="0"
>
    <SymbolIcon {height} {width} {iconSVG} {direction} {classes} {fill} {testId} {viewBox} />
</button>

<style>
    .button-icon {
        &:focus {
            box-shadow: var(
                --datepicker-icon-focus-box-shadow,
                0 0 0 0.25rem rgba(0, 94, 184, 0.25)
            );
            border-radius: 50%;
        }
    }
</style>
