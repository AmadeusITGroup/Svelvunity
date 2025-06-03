<script lang="ts">
    import { Icon, Tooltip } from '$lib';
    import { PEN_SVG, RESTORE_ICON, SAVE_ICON } from '$lib/config/constants';

    interface Props {
        value?: string;
        required?: boolean;
        disabled?: boolean;
        canSubmit?: boolean;
        placeholder?: string;
        error?: string;
        submitLabel?: string;
        restoreLabel?: string;
        editLabel?: string;
        classes?: string;
        classesForEditIcon?: string;
        classesForRestoreIcon?: string;
        classesForSubmitIcon?: string;
        classesForInput?: string;
        classesForButton?: string;
        classesForError?: string;
        submitLabelTooltipTestId?: string;
        submitIconTestId?: string;
        restoreLabelTooltipTestId?: string;
        restoreIconTestId?: string;
        editLabelTooltipTestId?: string;
        editIconTestId?: string;
        testIdNonEditing?: string;
        testIdInput?: string;
        testIdError?: string;
        onSubmit?: (value: any) => void;
        onRestore?: () => void;
        onInput?: (value: any) => void;
        onInputChange?: (value: any) => void;
    }

    let {
        value = $bindable(''),
        required = false,
        disabled = false,
        canSubmit = true,
        placeholder = '',
        error = '',
        submitLabel = 'Submit',
        restoreLabel = 'Restore',
        editLabel = 'Edit',
        classes = '',
        classesForEditIcon = '',
        classesForRestoreIcon = '',
        classesForSubmitIcon = '',
        classesForInput = '',
        classesForButton = '',
        classesForError = '',
        submitLabelTooltipTestId = '',
        submitIconTestId = '',
        restoreLabelTooltipTestId = '',
        restoreIconTestId = '',
        editLabelTooltipTestId = '',
        editIconTestId = '',
        testIdNonEditing = '',
        testIdInput = '',
        testIdError = '',
        onSubmit,
        onRestore,
        onInput,
        onInputChange
    }: Props = $props();

    let editing = $state(false);
    // svelte-ignore non_reactive_update
    let initialValueCapture = value;

    function edit() {
        // TODO: In the browser it would throw velte error: state_unsafe_mutation because a child component Icon is mutating a state variable for this example
        // The component is working fine, it's just the demo action should be bound internally for the component. The component works as expected
        editing = true;
    }

    function submit() {
        if (value !== initialValueCapture) {
            onSubmit?.(value);
            initialValueCapture = value;
        } else {
            console.warn('Identical value submitted');
        }

        editing = false;
    }

    function restore() {
        value = initialValueCapture;
        editing = false;
        onRestore?.();
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            restore();
        }

        if (event.key === 'Enter') {
            submit();
        }
    }

    function focus(element: HTMLInputElement) {
        element.focus();
    }
</script>

{#if editing}
    <div class="flex justify-between {classes}">
        <div class="grow">
            <input
                class="w-full {classesForInput}"
                {placeholder}
                {required}
                bind:value
                oninput={() => onInput?.(value)}
                onchange={() => onInputChange?.(value)}
                onkeydown={keydown}
                use:focus
                data-cy-id={testIdInput}
            />
        </div>
        <Tooltip
            content={submitLabel}
            position="left"
            align="center"
            animation="fade"
            testId={submitLabelTooltipTestId}
        >
            <Icon
                iconSVG={SAVE_ICON}
                viewBox="0 0 32 32"
                width={17}
                height={17}
                classes={classesForSubmitIcon}
                fill={canSubmit ? 'var(--amadeus-color-blue)' : 'var(--amadeus-color-gray-200)'}
                label={submitLabel}
                clickLogic={() => {
                    if (canSubmit) submit();
                }}
                testId={submitIconTestId}
            ></Icon>
        </Tooltip>
        {#if value !== initialValueCapture}
            <Tooltip
                content={restoreLabel}
                position="left"
                align="center"
                animation="fade"
                testId={restoreLabelTooltipTestId}
            >
                <Icon
                    iconSVG={RESTORE_ICON}
                    viewBox="10 10 20 20"
                    width={17}
                    height={17}
                    classes={classesForRestoreIcon}
                    label={restoreLabel}
                    clickLogic={restore}
                    testId={restoreIconTestId}
                ></Icon>
            </Tooltip>
        {/if}
    </div>
    {#if error !== ''}
        <div
            data-cy-id={testIdError}
            class="pt-2 w-full text-amadeusred text-xs whitespace-pre-wrap {classesForError}"
        >
            {error}
        </div>
    {/if}
{:else}
    <div class="flex {value === '' ? 'justify-end' : 'justify-between'}">
        <button
            tabindex="-1"
            {disabled}
            class="truncate grow text-left cursor-text min-h-[25px] border-b-[1px] {disabled
                ? 'bg-[#f2f2f2] border-b-amadeusgray400 hover:border-b-amadeusgray400'
                : 'border-b-amadeusgray200 hover:border-b-amadeusblue'} {value === ''
                ? 'text-amadeusgray400'
                : 'text-amadeusblack'} {classesForButton}"
            onclick={() => {
                if (!disabled) edit();
            }}
            data-cy-id={testIdNonEditing}
        >
            {value === '' ? placeholder : value}
        </button>
        {#if !disabled}
            <Tooltip
                content={editLabel}
                position="left"
                align="center"
                animation="fade"
                testId={editLabelTooltipTestId}
            >
                <Icon
                    iconSVG={PEN_SVG}
                    classes={classesForEditIcon}
                    width={17}
                    height={17}
                    fill={disabled ? 'var(--amadeus-color-gray-200)' : 'var(--amadeus-color-blue)'}
                    label={editLabel}
                    clickLogic={edit}
                    testId={editIconTestId}
                ></Icon>
            </Tooltip>
        {/if}
    </div>
{/if}

<style>
    input {
        border: none;
        background: none;
        font-size: inherit;
        color: inherit;
        font-weight: inherit;
        text-align: inherit;
        box-shadow: none;
        outline: none;
        border-bottom: 1px solid var(--amadeus-color-gray-200);
    }

    input:focus {
        border-bottom: 1px solid var(--amadeus-color-blue);
    }
</style>
