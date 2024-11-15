<script lang="ts">
    import { Icon, Tooltip } from '$lib';
    import { PEN_SVG, RESTORE_ICON, SAVE_ICON } from '$lib/config/constants';
    import { createEventDispatcher, onMount } from 'svelte';

    export let value = '';
    export let required = false;
    export let disabled = false;
    export let canSubmit = true;
    export let placeholder = '';
    export let error = '';
    export let submitLabel = 'Submit';
    export let restoreLabel = 'Restore';
    export let editLabel = 'Edit';

    export let classes = '';
    export let classesForEditIcon = '';
    export let classesForRestoreIcon = '';
    export let classesForSubmitIcon = '';
    export let classesForInput = '';
    export let classesForButton = '';
    export let classesForError = '';

    export let submitLabelTooltipTestId = '';
    export let submitIconTestId = '';
    export let restoreLabelTooltipTestId = '';
    export let restoreIconTestId = '';
    export let editLabelTooltipTestId = '';
    export let editIconTestId = '';
    export let testIdNonEditing = '';
    export let testIdInput = '';
    export let testIdError = '';

    let editing = false;
    let original = '';

    const dispatch = createEventDispatcher();

    onMount(() => {
        original = value;
    });

    function edit() {
        editing = true;
    }

    function submit() {
        if (value !== original) {
            dispatch('Submit', value);
        }

        editing = false;
    }

    function restore() {
        value = original;
        editing = false;
        dispatch('Restore');
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
                on:blur={() => {
                    if (value.trim() === original) restore();
                }}
                on:input={() => dispatch('Input', value)}
                on:change={() => dispatch('InputChanges', value)}
                on:keydown={keydown}
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
        {#if value !== original}
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
            on:click={() => {
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
                    clickLogic={() => {
                        edit();
                    }}
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
