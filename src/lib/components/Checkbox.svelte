<script lang="ts">
    interface Props {
        inputId?: string;
        labelName?: string;
        classes?: string;
        classesForInput?: string;
        classesForLabel?: string;
        inputValue: boolean;
        required?: boolean;
        isDisabled?: boolean;
        testId: string;
        onInputChange?: (e: Event) => void;
    }

    let {
        inputId = '',
        labelName = '',
        classes = '',
        classesForInput = '',
        classesForLabel = '',
        inputValue = $bindable(),
        required = false,
        isDisabled = false,
        testId,
        onInputChange
    }: Props = $props();
</script>

<div class="checkbox-wrapper {classes}">
    <input
        id={inputId}
        {required}
        data-cy-id={testId}
        aria-label={labelName}
        type="checkbox"
        disabled={isDisabled}
        class="input-checkbox {classesForInput}"
        bind:checked={inputValue}
        onchange={(e) => {
            if (onInputChange) {
                onInputChange(e);
            }
        }}
    />
    <label class="input-label {classesForLabel}" for={inputId}>{labelName}</label>
</div>

<style>
    .checkbox-wrapper {
        display: block;
        min-height: 1.5rem;
        line-height: 1.5rem;
        margin-bottom: 0.125rem;
    }

    .input-checkbox {
        height: 1rem;
        width: 1rem;
        margin-top: 0.25rem;
        vertical-align: top;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border: 2px solid --var(--amadeus-color-gray-600);
        border-radius: 0.125rem;
        cursor: pointer;
    }

    input[type='checkbox'].input-checkbox:focus {
        outline: 0;
        box-shadow: 0 0 0 0.25rem #005eb840;
    }

    .input-label {
        margin-left: 0.25rem;
        cursor: pointer;
    }
</style>
