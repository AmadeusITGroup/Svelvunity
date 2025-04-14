<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    interface Props {
        threshold?: number | undefined;
        horizontal?: boolean | undefined;
        elementScroll?: HTMLElement | null;
        hasMore?: boolean | undefined;
        reverse?: boolean | undefined;
        window?: boolean | undefined;
        loadMore: Function | never;
    }

    let {
        threshold = 0,
        horizontal = false,
        elementScroll = null,
        hasMore = true,
        reverse = false,
        window = false,
        loadMore = () => {}
    }: Props = $props();

    let isLoadMore = $state(false);
    let component: HTMLElement | undefined = $state();
    let beforeScrollHeight: number = $state(0);
    let beforeScrollTop: number = $state(0);
    let element: any | null = $state();

    const onScroll = (e: Event) => {
        if (!hasMore) return;

        const target = e.target as HTMLElement;
        const offset = calcOffset(target, reverse!, horizontal!);

        if (offset <= threshold!) {
            if (!isLoadMore && hasMore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                loadMore();
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
            element = component?.parentNode;
        }
    });

    onDestroy(() => {
        if (element) {
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('resize', onScroll);
        }
    });
    $effect(() => {
        if (element) {
            if (reverse) {
                element.scrollTop = element.scrollHeight;
            }
            element.addEventListener('scroll', onScroll);
            element.addEventListener('resize', onScroll);
        }
    });
    $effect(() => {
        if (reverse && isLoadMore) {
            element.scrollTop = element.scrollHeight - beforeScrollHeight + beforeScrollTop;
        }
    });
</script>

{#if !window && !elementScroll}
    <div class="infinite-scroll" bind:this={component} id="svelte-infinite-scroll"></div>
{/if}

<style>
    .infinite-scroll {
        width: 0;
    }
</style>
