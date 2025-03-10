<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';

    export let threshold: number | undefined = 0;
    export let horizontal: boolean | undefined = false;
    export let elementScroll: HTMLElement | null = null;
    export let hasMore: boolean | undefined = true;
    export let reverse: boolean | undefined = false;
    export let window: boolean | undefined = false;

    const dispatch = createEventDispatcher<{ loadMore: never }>();

    let isLoadMore = false;
    let component: HTMLElement;
    let beforeScrollHeight: number;
    let beforeScrollTop: number;
    let element: any | null;

    $: if (element) {
        if (reverse) {
            element.scrollTop = element.scrollHeight;
        }
        element.addEventListener('scroll', onScroll);
        element.addEventListener('resize', onScroll);
    }

    $: if (reverse && isLoadMore) {
        element.scrollTop = element.scrollHeight - beforeScrollHeight + beforeScrollTop;
    }

    const onScroll = (e: Event) => {
        if (!hasMore) return;

        const target = e.target as HTMLElement;
        const offset = calcOffset(target, reverse!, horizontal!);

        if (offset <= threshold!) {
            if (!isLoadMore && hasMore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                dispatch('loadMore');
                beforeScrollHeight = target.scrollHeight;
                beforeScrollTop = target.scrollTop;
            }
            isLoadMore = true;
        } else {
            isLoadMore = false;
        }
    };

    const calcOffset = (target: any, reverse: boolean, horizontal: boolean) => {
        const element: HTMLElement = target.documentElement ? target.documentElement : target;

        if (reverse) {
            return horizontal ? element.scrollLeft : element.scrollTop;
        }
        return horizontal
            ? element.scrollWidth - element.clientWidth - element.scrollLeft
            : element.scrollHeight - element.clientHeight - element.scrollTop;
    };

    onMount(() => {
        if (window) {
            element = document;
        } else if (elementScroll) {
            element = elementScroll;
        } else {
            element = component.parentNode;
        }
    });

    onDestroy(() => {
        if (element) {
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('resize', onScroll);
        }
    });
</script>

{#if !window && !elementScroll}
    <div class="infinite-scroll" bind:this={component} id="svelte-infinite-scroll" />
{/if}

<style>
    .infinite-scroll {
        width: 0;
    }
</style>
