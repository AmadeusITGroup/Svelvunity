<script lang="ts">
    import spinner from '$lib/assets/images/spinner.svg';
    import { LOADING_ANIMATION_DELAY_AND_DURATION } from '$lib/config/constants';
    import { fade } from 'svelte/transition';

    interface Props {
        width?: string;
        height?: string;
        loadingAnimationDuration?: any;
        removeAnimation?: boolean;
        isScreenCentered?: boolean;
        classes?: string;
        testId?: string;
    }

    let {
        width = '140px',
        height = '140px',
        loadingAnimationDuration = LOADING_ANIMATION_DELAY_AND_DURATION,
        removeAnimation = false,
        isScreenCentered = false,
        classes = '',
        testId = ''
    }: Props = $props();
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
