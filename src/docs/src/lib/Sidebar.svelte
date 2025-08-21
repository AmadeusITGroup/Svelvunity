<script lang="ts">
    import { clickOutside } from '../utils/clickOutside';
    import { blur, fade, fly, slide } from 'svelte/transition';

    export let activateClickOutside = true;
    export let hidden = true;
    export let backdrop = true;
    export let id = 'sidebar-example';
    export let transitionParams = {};
    export let transitionType = 'fly';

    function multiple(node: HTMLElement, params: any) {
        switch (transitionType) {
            case 'slide':
                return slide(node, params);
            case 'blur':
                return blur(node, params);
            case 'fade':
                return fade(node, params);
            default:
                return fly(node, params);
        }
    }

    const handleSidebar = () => {
        hidden = !hidden;
    };

    const handleClickOutside = () => activateClickOutside && !hidden && handleSidebar();

    let backdropDivClass = 'fixed top-0 left-0 z-50 w-full h-full bg-opacity-50';

    function clickOutsideWrapper(node: HTMLElement, callback: () => void) {
        return activateClickOutside ? clickOutside(node, callback) : undefined;
    }
</script>

{#if !hidden}
    {#if backdrop && activateClickOutside}
        <div
            role="presentation"
            class={backdropDivClass}
            on:click={() => !hidden && handleSidebar()}
        ></div>
    {:else if backdrop && !activateClickOutside}
        <div role="presentation" class={backdropDivClass}></div>
    {/if}

    <div
        use:clickOutsideWrapper={handleClickOutside}
        {id}
        {...$$restProps}
        class="sidebar overflow-y-auto z-50 px-4 pb-4 border-x border-violet-500 w-60 fixed inset-y-0 left-0"
        transition:multiple={transitionParams}
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        aria-controls={id}
        aria-labelledby={id}
    >
        <div
            tabindex="-1"
            aria-hidden={hidden}
            on:keydown={(e) => {
                if (e.key === 'Escape') hidden = true;
            }}
        >
            <slot {hidden} />
        </div>
    </div>
{/if}

<style>
    .sidebar {
        background: -webkit-linear-gradient(100deg, #5940cc 30%, #ba49fc);
        background: linear-gradient(100deg, #5940cc 30%, #ba49fc);
        color: white;
        padding: 1rem;
    }
</style>
