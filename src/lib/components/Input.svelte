<script lang="ts">
    import { InputTypes } from '$lib/enums/inputtypes.enum';
    import { removeLeadingZero } from '$lib/utils/helpers';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    interface Props {
        classes?: string;
        classesForInput?: string;
        classesForLabel?: string;
        classesForInputError?: string;
        labelName?: string;
        inputName?: string;
        inputError?: string;
        inputValue?: string | number;
        placeholder?: string;
        min?: string | number;
        max?: string | number;
        type?: string;
        extraSign?: string;
        required?: boolean;
        isReadOnly?: boolean;
        isDisabled?: boolean;
        textareaInput?: boolean;
        resizableTextarea?: boolean;
        showError?: boolean;
        testId?: string;
    }

    let {
        classes = '',
        classesForInput = '',
        classesForLabel = '',
        classesForInputError = '',
        labelName = '',
        inputName = '',
        inputError = '',
        inputValue = $bindable(''),
        placeholder = '',
        min = '',
        max = '',
        type = InputTypes.Text,
        extraSign = '',
        required = false,
        isReadOnly = false,
        isDisabled = false,
        textareaInput = false,
        resizableTextarea = true,
        showError = true,
        testId = ''
    }: Props = $props();
    const isTypeNumber: boolean = type === InputTypes.Number;

    function typeAction(node: any) {
        node.type = type;
    }

    function handleNumbers() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        inputValue = removeLeadingZero(inputValue);
        if (min !== '' && +min > +inputValue) {
            inputValue = min.toString();
        } else if (max !== '' && +max < +inputValue) {
            inputValue = max.toString();
        }
    }
</script>

<div class={classes}>
    <label class={classesForLabel} for={inputName}
        >{labelName}{#if required}
            *
        {/if}</label
    >
    <div
        class="svelvunity-input--wrapper-position {labelName
            ? 'svelvunity-input--wrapper-padding'
            : ''}"
    >
        {#if !textareaInput}
            <input
                data-cy-id={testId}
                disabled={isDisabled}
                readonly={isReadOnly}
                aria-label={labelName}
                class="svelvunity-input--field
                    {inputError ? 'svelvunity-input--field-error-border' : ''} 
                    {isTypeNumber ? 'svelvunity-input--field-number-padding' : ''} 
                    {classesForInput}"
                bind:value={inputValue}
                onblur={(event) => {
                    dispatch('onInputBlur', event);
                    isTypeNumber ? handleNumbers() : null;
                }}
                oninput={(event) => dispatch('onInput', event)}
                onchange={(event) => dispatch('onInputChanges', event)}
                use:typeAction
                {placeholder}
                name={inputName}
                id={inputName}
                {min}
                {max}
                autocomplete="off"
            />
            {#if extraSign}
                <div class="svelvunity-input--extra-sign">{extraSign}</div>
            {/if}
        {:else}
            <textarea
                data-cy-id={testId}
                disabled={isDisabled}
                readonly={isReadOnly}
                class:svelvunity-input-textarea-non-resizable={!resizableTextarea}
                class="svelvunity-input--field
                    {inputError ? 'svelvunity-input--field-error-border' : ''} 
                    {classesForInput}"
                bind:value={inputValue}
                onblur={(event) => dispatch('onInputBlur', event)}
                oninput={(event) => dispatch('onInput', event)}
                onchange={(event) => dispatch('onInputChanges', event)}
                {placeholder}
                name={inputName}
                id={inputName}
                autocomplete="off"
            ></textarea>
        {/if}
    </div>
    {#if showError || inputError}
        <div
            data-cy-id="errormessage"
            class="svelvunity-input--error-message {classesForInputError}"
        >
            {inputError}
        </div>
    {/if}
</div>

<style>
    ::placeholder {
        font-style: italic;
        color: #808080;
    }

    .svelvunity-input--extra-sign {
        position: absolute;
        bottom: 0.5rem;
        z-index: 50;
        left: 0.25rem;
    }

    .svelvunity-input--error-message {
        color: #c60000;
        font-size: 0.75rem;
        line-height: 1rem;
        min-height: 20px;
    }

    .svelvunity-input--field {
        appearance: none;
        display: block;
        width: 100%;
        min-width: auto;
        padding: 0.5rem 0.75rem;
        border: 1px solid #b3b3b3;
        border-radius: 0.125rem;
        color: #1a1a1a;
        margin-bottom: 0.25rem;
        margin-right: 0;
    }

    .svelvunity-input-textarea-non-resizable {
        resize: none;
    }

    @media (min-width: 640px) {
        .svelvunity-input--field {
            font-size: 0.875rem;
            line-height: 1.25rem;
        }
    }

    .svelvunity-input--field:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border-color: #005eb8;
        z-index: 10;
    }

    .svelvunity-input--field:disabled {
        background-color: #f2f2f2;
    }

    .svelvunity-input--field-error-border {
        border-color: #c60000;
    }

    .svelvunity-input--field-number-padding {
        padding-right: 0;
    }

    .svelvunity-input--wrapper-position {
        position: relative;
    }

    .svelvunity-input--wrapper-padding {
        padding-top: 0.5rem;
    }
</style>
