<script lang="ts">
    import spinner from '$lib/assets/images/spinner.svg';
    import { LOADING_ANIMATION_DELAY_AND_DURATION } from '$lib/config/constants';
    import { fade } from 'svelte/transition';

    export let width = '140px';
    export let height = '140px';
    export let loadingAnimationDuration = LOADING_ANIMATION_DELAY_AND_DURATION;
    export let removeAnimation = false;
    export let isScreenCentered = false;
    export let classes = '';
    export let testId = '';
</script>

{#if removeAnimation}
    <div
        class="{classes} {isScreenCentered ? 'am-c-loading__screen-center' : ''}"
        data-cy-id={testId !== '' ? testId : null}
    >
        <img {width} {height} src={spinner} alt="Loading..." class="am-c-loading" />
    </div>
{:else}
    <div
        class="{classes} {isScreenCentered ? 'am-c-loading__screen-center' : ''}"
        data-cy-id={testId !== '' ? testId : null}
        out:fade|global={{ duration: loadingAnimationDuration }}
    >
        <img {width} {height} src={spinner} alt="Loading..." class="am-c-loading" />
    </div>
{/if}

<style>
    .am-c-loading {
        animation: rotation 1s infinite linear;
    }

    .am-c-loading__screen-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: fixed;
    }
</style>
