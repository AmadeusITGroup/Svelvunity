<!-- PageTransition.svelte -->
<script>
    import { fly } from 'svelte/transition';
    /** @type {{url?: string, children?: import('svelte').Snippet}} */
    let { url = '', children } = $props();
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
