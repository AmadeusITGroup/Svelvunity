<script>
    import { onMount } from 'svelte';

    /** @type {{errorCode?: number, headMessage?: string, message?: string, testId?: string}} */
    let {
        errorCode = 403,
        headMessage = "The page you're trying to reach has restricted access.",
        message = 'Please refer to your administrator.',
        testId = ''
    } = $props();

    onMount(() => {
        const sectionElem = document.querySelector('section');

        if (sectionElem) {
            sectionElem.style.backgroundImage = `url(/error-bg-img.png)`;
        }
    });
</script>

<main data-cy-id={testId}>
    <section>
        <div>
            <h1>{errorCode}</h1>
            <p class="head-message">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html headMessage}
            </p>
            <p>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html message}
            </p>
        </div>
    </section>
</main>

<style>
    main {
        height: 100vh;
        overflow: hidden;
    }

    section {
        background-size: cover;
        background-repeat: no-repeat;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div {
        padding: 2rem;
        color: white;
        text-align: center;
    }

    h1 {
        font-size: 8rem;
        line-height: 1;
        font-weight: 700;
        margin: 2rem 0;
        color: #3a8bff;
    }

    .head-message {
        font-size: 1.875rem;
        line-height: 2.25rem;
        margin: 1rem 0;
        color: #000835;
    }

    p {
        padding-top: 1.25rem;
        font-size: 1.25rem;
        line-height: 1.75rem;
        color: #000000e6;
    }

    @media (min-width: 575px) {
        .head-message {
            font-size: 2.25rem /* 36px */;
            line-height: 2.5rem /* 40px */;
        }
    }
</style>
