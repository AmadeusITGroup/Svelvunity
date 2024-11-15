<script lang="ts">
    import { Direction } from '$lib/enums/direction.enum';

    export let iconSVG: string;
    export let viewBox = '0 0 448 512';
    export let height = 22;
    export let width = 22;
    export let fill = '#005eb8';
    export let direction: Direction = Direction.Up;
    export let classes = '';
    export let testId = '';

    function getIconDirection(direction: Direction): string {
        switch (direction) {
            case Direction.Left:
                return '-rotate-90';
            case Direction.Right:
                return 'rotate-90';
            case Direction.Up:
                return 'rotate-0';
            case Direction.Down:
                return 'rotate-180';

            default:
                return 'rotate-0';
        }
    }
</script>

<svg
    preserveAspectRatio="xMinYMax meet"
    {height}
    {width}
    xmlns="http://www.w3.org/2000/svg"
    class="{getIconDirection(direction)} {classes}"
    {fill}
    data-cy-id={testId}
    {viewBox}
>
    <path d={iconSVG} />
</svg>

<style>
    .rotate-0 {
        transform: rotate(0deg);
    }
    .rotate-90 {
        transform: rotate(90deg);
    }
    .-rotate-90 {
        transform: rotate(-90deg);
    }
    .rotate-180 {
        transform: rotate(180deg);
    }
</style>
