<!-- PageTransition.svelte -->
<script lang="ts">
    import { fly } from 'svelte/transition';
    interface Props {
        url?: string;
        children?: import('svelte').Snippet;
    }

    let { url = '', children }: Props = $props();
    const pageTransitionDuration = 500;
</script>

{#key url}
    <div
        in:fly|global={{ y: -5, duration: pageTransitionDuration, delay: pageTransitionDuration }}
        out:fly|global={{ y: 5, duration: pageTransitionDuration }}
    >
        {@render children?.()}
    </div>
{/key}
