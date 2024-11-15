<!-- PageTransition.svelte -->
<script>
    import { fly } from 'svelte/transition';
    export let url = '';
    const pageTransitionDuration = 500;
</script>

{#key url}
    <div
        in:fly|global={{ y: -5, duration: pageTransitionDuration, delay: pageTransitionDuration }}
        out:fly|global={{ y: 5, duration: pageTransitionDuration }}
    >
        <slot />
    </div>
{/key}
