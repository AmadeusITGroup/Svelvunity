<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    interface Props {
        classes?: string;
        labelName?: string;
        inputName?: string;
        inputError?: string;
        inputValue?: string;
        placeholder?: string;
        testId?: string;
        options?: Array<any>;
    }

    let {
        classes = '',
        labelName = '',
        inputName = '',
        inputError = '',
        inputValue = $bindable(''),
        placeholder = '',
        testId = '',
        options = []
    }: Props = $props();
</script>

<div class={classes}>
    <label for={inputName}>{labelName}</label>
    <div class="svelvunity-select-wrapper {labelName ? 'svelvunity-select-wrapper-padding' : ''}">
        <select
            data-cy-id={testId}
            name={inputName}
            aria-label={labelName}
            class="
                svelvunity-input svelvunity-input--auto-min-width svelvunity-select
                {inputError ? 'svelvunity-input--on-error' : ''}
            "
            bind:value={inputValue}
            onchange={() => dispatch('onSelectChanges')}
            onblur={(event) => {
                dispatch('onInputBlur', event);
            }}
        >
            {#if placeholder}<option value="" disabled selected hidden>{placeholder}</option>{/if}
            {#each options as option}
                <option value={option.id}>{option.value}</option>
            {/each}
        </select>
    </div>
    <div class="svelvunity-error-message {!inputError ? 'svelvunity-error-message-hidden' : ''}">
        {inputError}
    </div>
</div>

<style>
    .svelvunity-input {
        min-width: 240px;
        appearance: none;
        position: relative;
        display: block;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #b3b3b3;
        border-radius: 0.125rem;
        color: #1a1a1a;
        margin-bottom: 0.25rem;
    }
    :focus {
        outline: none;
        border-color: #005eb8;
        z-index: 10;
    }
    ::placeholder {
        font-style: italic;
        color: #808080;
    }

    .svelvunity-input--auto-min-width {
        min-width: auto;
    }

    .svelvunity-select {
        background-image:
            linear-gradient(45deg, transparent 50%, black 50%),
            linear-gradient(135deg, black 50%, transparent 50%);
        background-position:
            calc(100% - 20px) calc(1em + 2px),
            calc(100% - 15px) calc(1em + 2px),
            100% 0;
        background-size:
            5px 5px,
            5px 5px,
            2.5em 2.5em;
        background-repeat: no-repeat;
        background-color: #fff;
    }

    .svelvunity-input--on-error {
        border-color: #c60000;
    }

    .svelvunity-error-message {
        color: #c60000;
        font-size: 0.75rem;
        line-height: 1rem;
        min-height: 20px;
    }

    .svelvunity-error-message-hidden {
        visibility: hidden;
    }

    .svelvunity-select-wrapper {
        position: relative;
    }

    .svelvunity-select-wrapper-padding {
        padding-top: 0.5rem;
    }
</style>
