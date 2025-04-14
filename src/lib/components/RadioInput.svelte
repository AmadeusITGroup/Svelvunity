<script lang="ts">
    import { run } from 'svelte/legacy';

    import { createEventDispatcher } from 'svelte';

    interface Props {
        labelText?: string;
        inputName?: string;
        inputError?: string;
        options?: any;
        classesForError?: string;
        classesForInput?: string;
        classesForInputLabel?: string;
        classesForLabel?: string;
        classesForRadioGroup?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        testId: string;
        selectedOption: any;
        optionSelected: any;
    }

    let {
        labelText = '',
        inputName = '',
        inputError = '',
        options = [],
        classesForError = '',
        classesForInput = '',
        classesForInputLabel = '',
        classesForLabel = '',
        classesForRadioGroup = '',
        isRequired = false,
        isDisabled = false,
        testId,
        selectedOption = $bindable(),
        optionSelected
    }: Props = $props();

    run(() => {
        optionSelected(selectedOption);
    });
</script>

<div role="radiogroup" data-cy-id={testId} class="radiogroup {classesForRadioGroup}">
    {#if labelText}
        <label for={inputName} class="label {classesForLabel}"
            >{labelText}{#if isRequired}
                *
            {/if}</label
        >
    {/if}

    {#each options as option, index}
        <div class="input-wrapper" role="textbox" aria-required={isRequired} aria-label={labelText}>
            <input
                type="radio"
                name={`${inputName}`}
                value={option?.value}
                aria-label={option.name}
                class="
                    input-radio
                    {isDisabled ? 'input-cursor-disabled' : 'input-cursor'}
                    {inputError !== '' ? 'error' : 'normal'} 
                    {classesForInput}"
                disabled={isDisabled}
                required={isRequired}
                bind:group={selectedOption}
                onblur={() => optionSelected(selectedOption)}
                data-cy-id={`${testId}-${index}-input`}
            />

            <label
                for={`${inputName}`}
                class="
                    {isDisabled ? 'input-cursor-disabled' : 'input-cursor'}
                    {inputError !== '' ? 'error' : 'normal'} 
                    {classesForInputLabel}"
                data-cy-id={`${testId}-${index}-label`}
            >
                {option.name}
            </label>
        </div>
    {/each}
    <div data-cy-id="errormessage" class="error-wrapper {classesForError}">
        {inputError}
    </div>
</div>

<style>
    input[type='radio']:checked {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2.5' fill='%23005eb8'/%3e%3c/svg%3e");
    }

    input[type='radio']:checked:disabled {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2.5' fill='%23b3b3b3'/%3e%3c/svg%3e");
        border-color: var(--amadeus-color-gray-300) !important;
    }

    input[type='radio']:disabled {
        background-color: #e6e6e6 !important;
        border-color: var(--amadeus-color-gray-300) !important;
        pointer-events: auto;
        filter: none;
        opacity: 1;
    }

    label.normal {
        color: var(--amadeus-color-gray-900);
    }

    input[type='radio'].normal {
        border-color: var(--amadeus-color-gray-600);
    }

    input[type='radio'].normal:focus {
        outline: 0;
        box-shadow: 0 0 0 0.25rem #005eb840;
    }
    input[type='radio'].normal:checked {
        border-color: var(--amadeus-color-blue);
    }

    label.error {
        color: var(--amadeus-color-red);
    }

    input[type='radio'].error {
        border-color: var(--amadeus-color-red);
    }

    input[type='radio'].error:focus {
        outline: 0;
        box-shadow: 0 0 0 0.25rem #c6000040;
    }

    input[type='radio'].error:checked {
        border-color: var(--amadeus-color-red);
    }

    .radiogroup {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-weight: 400;
        margin-bottom: 0.5rem;
    }

    .input-wrapper {
        min-height: 1.5rem;
        padding-left: 1.375rem;
        margin-bottom: 0.125rem;
    }

    .input-radio {
        float: left;
        width: 1rem;
        height: 1rem;
        vertical-align: top;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border: 2px solid var(--amadeus-color-gray-600);
        border-radius: 9999px;
        appearance: none;
        padding-right: 0.25rem;
        margin-left: -1.375rem;
        margin-top: 0.25rem;
    }

    .error-wrapper {
        color: var(--amadeus-color-red);
        font-size: 0.75rem;
        line-height: 1rem;
        min-height: 20px;
    }

    .input-cursor {
        cursor: pointer;
    }

    .input-cursor-disabled {
        cursor: not-allowed;
    }
</style>
