<script>
    import Highlight from 'svelte-highlight';
    import { createEventDispatcher } from 'svelte';

    export let language;
    export let code;
    export let showCopyButton = true;

    const dispatch = createEventDispatcher();

    let copyButtonText = 'Copy';
    let copyTimeout;

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(code);
            copyButtonText = 'Copied!';

            // Reset button text after 2 seconds
            if (copyTimeout) clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copyButtonText = 'Copy';
            }, 2000);

            dispatch('copy', { code });
        } catch (err) {
            console.error('Failed to copy: ', err);
            copyButtonText = 'Failed';

            if (copyTimeout) clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copyButtonText = 'Copy';
            }, 2000);
        }
    }
</script>

<div class="code-block-container">
    {#if showCopyButton}
        <div class="copy-button-container">
            <button
                class="copy-button"
                on:click={copyToClipboard}
                aria-label="Copy code to clipboard"
                title="Copy code to clipboard"
            >
                <svg
                    class="copy-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
                        fill="currentColor"
                    />
                </svg>
                <span class="copy-text">{copyButtonText}</span>
            </button>
        </div>
    {/if}
    <div class="highlight-wrapper">
        <Highlight {language} {code} />
    </div>
</div>

<style>
    .code-block-container {
        background: #2d2b57;
        border-radius: 0.5rem;
        position: relative;
        margin: 1rem 0;
    }

    .copy-button-container {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 10;
    }

    .copy-button {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        background: #a81ce4;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(4px);
    }

    .copy-button:hover {
        background: #ba49fc;
        transform: scale(1.05);
    }

    .copy-button:active {
        transform: scale(0.95);
    }

    .copy-icon {
        width: 14px;
        height: 14px;
    }

    .copy-text {
        font-weight: 500;
    }

    .highlight-wrapper {
        position: relative;
    }

    /* Ensure the code block has some padding to accommodate the copy button */
    .code-block-container :global(pre) {
        padding: 2rem 1rem 1rem 1rem !important;
        margin: 0 !important;
    }
</style>
