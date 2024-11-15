<script lang="ts">
    import { Direction } from '$lib/enums/direction.enum';
    import SymbolIcon from './SymbolIcon.svelte';

    export let iconSVG: string;
    export let viewBox = '0 0 448 512';
    export let height = 22;
    export let width = 22;
    export let fill = '#005eb8';
    export let direction: Direction = Direction.Up;
    export let clickLogic: null | ((...args: any) => any) = null;
    export let classes = '';
    export let testId = '';
    export let label = '';

    function handleKeyboardPress(e: KeyboardEvent): null | ((...args: any) => any) {
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
    on:click={(e) => (clickLogic ? clickLogic(e) : null)}
    on:keypress={(e) => handleKeyboardPress(e)}
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
