<script lang="ts">
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-nocheck

    import Loading from './Loading.svelte';
    import { ButtonType } from '$lib/enums/buttontype.enum';
    import { Size } from '$lib/enums/size.enum';
    import { TEST_IDS } from '$lib/enums/testconstants.enum';

    interface Props {
        clickLogic?: null | ((...args: any) => any);
        label?: string;
        isDisabled?: boolean;
        additionalClasses?: string;
        type?: ButtonType;
        buttonSize?: Size;
        testingId?: any;
        loading?: boolean;
    }

    let {
        clickLogic = null,
        label = '',
        isDisabled = false,
        additionalClasses = '',
        type = ButtonType.Primary,
        buttonSize = Size.Unset,
        testingId = `${TEST_IDS.ButtonId}-${label}`,
        loading = false
    }: Props = $props();

    function getButtonSize(size: Size): string {
        switch (size) {
            case Size.Small:
                return 'am-c-df_btn__sm';
            case Size.Large:
                return 'am-c-df_btn__lg';
            case Size.XLarge:
                return 'am-c-df_btn__xl';
            default:
                return '';
        }
    }

    function getSpinnerSize(size: Size): string {
        switch (size) {
            case Size.Small:
                return 'am-c-spinner__sm';
            case Size.Large:
                return 'am-c-spinner__lg';
            case Size.XLarge:
                return 'am-c-spinner__xl';
            default:
                return 'am-c-spinner__sm';
        }
    }
</script>

<button
    data-cy-id={testingId}
    onclick={(e) => clickLogic && clickLogic(e)}
    class="
        {type === ButtonType.Primary ? 'am-c-df_btn am-c-df_btn-primary' : ''}
        {type === ButtonType.OutlinePrimary ? 'am-c-df_btn am-c-df_btn-outline-primary' : ''}
        {type === ButtonType.PrimaryDanger ? 'am-c-df_btn am-c-df_btn-primary-danger' : ''}
        {type === ButtonType.OutlinePrimaryDanger
        ? 'am-c-df_btn am-c-df_btn-outline-primary-danger'
        : ''}
        {getButtonSize(buttonSize)} {additionalClasses}"
    disabled={isDisabled}
    aria-label={label}
    tabindex="0"
>
    {#if loading}
        <Loading classes={getSpinnerSize(buttonSize)} removeAnimation={true} />
    {:else}
        {label}
    {/if}
</button>

<style global>
    .am-c-df_btn-group,
    .am-c-df_btn-group-vertical {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
    }

    .am-c-df_btn {
        font-family:
            Source Sans Pro,
            sans-serif;
        align-items: center;
        justify-content: center;
        display: inline-block;
        font-weight: 400;
        color: #1a1a1a;
        text-align: center;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: var(--amadeus-color-white);
        border: 1px solid transparent;
        padding: 0.3125rem 1rem;
        font-size: 1rem;
        line-height: 1.5;
        height: calc(1.5em + 0.625rem + 2px);
        border-radius: 0.175rem;
        transition:
            color 0.15s ease-in-out,
            background-color 0.15s ease-in-out,
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
    }

    .am-c-df_btn.auto-height {
        height: auto;
    }

    .am-c-df_btn:not(:disabled):not(.disabled) {
        cursor: pointer;
    }

    .am-c-df_btn.disabled,
    .am-c-df_btn:disabled {
        cursor: not-allowed;
    }

    .am-c-df_btn__sm {
        padding: 0.21875rem 0.875rem;
        font-size: 0.875rem;
        line-height: 1.5;
        height: calc(1.5em + 0.4375rem + 2px);
        border-radius: 0.153125rem;
    }

    .am-c-df_btn__lg {
        font-size: 1rem;
        line-height: 1.5;
        height: calc(1.5rem + 0.86rem + 2px);
        border-radius: 1.5rem;
        min-width: 6.25rem;
        margin-top: 0.5rem;
        margin-bottom: 1px;
    }

    .am-c-df_btn__xl {
        padding: 0.59375rem 1.125rem;
        font-size: 1.25rem;
        line-height: 1.5;
        height: calc(1.5em + 1.1875rem + 2px);
        border-radius: 1.5rem;
        min-width: 6.25em;
    }

    .am-c-spinner__sm {
        width: auto;
        height: auto;
        max-width: 1rem;
        max-height: 1rem;
        position: relative;
        margin: 0 auto;
    }

    .am-c-spinner__lg {
        width: auto;
        height: auto;
        max-width: 1.5rem;
        max-height: 1.5rem;
        position: relative;
        margin: 0 auto;
    }

    .am-c-spinner__xl {
        width: auto;
        height: auto;
        max-width: 2rem;
        max-height: 2rem;
        position: relative;
        margin: 0 auto;
    }

    .am-c-df_btn-primary {
        @apply text-amadeuswhite bg-amadeusblue border-amadeusblue;
    }

    .am-c-df_btn-primary:not(:disabled):not(.disabled).active:focus,
    .am-c-df_btn-primary:not(:disabled):not(.disabled):active:focus {
        box-shadow: 0 0 0 0.2rem rgb(38 118 195 / 50%);
    }

    .am-c-df_btn-primary:not(:disabled):not(.disabled).active,
    .am-c-df_btn-primary:not(:disabled):not(.disabled):active {
        border-color: var(--amadeus-color-darkblue);
        @apply text-amadeuswhite bg-amadeusdarkblue;
    }

    .am-c-df_btn-primary:hover {
        background-color: var(--amadeus-color-darkblue);
        border-color: var(--amadeus-color-darkblue);
        @apply text-amadeuswhite;
    }

    .am-c-df_btn-primary.focus,
    .am-c-df_btn-primary:focus {
        background-color: var(--amadeus-color-lightblue);
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(38 118 195 / 50%);
        @apply text-amadeuswhite border-amadeusdarkblue;
    }

    .am-c-df_btn-primary.disabled,
    .am-c-df_btn-primary:disabled {
        background-color: var(--amadeus-color-lightergrey);
        border-color: var(--amadeus-color-lightergrey);
        @apply text-amadeusgray300;
    }

    .am-c-df_btn-outline-primary {
        @apply text-amadeusblue border-amadeusblue;
    }

    .am-c-df_btn-outline-primary:not(:disabled):not(.disabled).active:focus,
    .am-c-df_btn-outline-primary:not(:disabled):not(.disabled):active:focus {
        box-shadow: 0 0 0 0.2rem rgb(0 94 184 / 50%);
    }

    .am-c-df_btn-outline-primary:not(:disabled):not(.disabled).active,
    .am-c-df_btn-outline-primary:not(:disabled):not(.disabled):active {
        background-color: var(--amadeus-color-gray-50);
        @apply text-amadeusdarkblue border-amadeusblue;
    }
    .am-c-df_btn-outline-primary:not(:disabled):not(.disabled):hover {
        background-color: var(--amadeus-color-gray-100);
        @apply text-amadeusblue;
    }

    .am-c-df_btn-outline-primary.focus,
    .am-c-df_btn-outline-primary:focus {
        box-shadow: 0 0 0 0.2rem rgb(0 94 184 / 50%);
    }
    .am-c-df_btn-outline-primary:hover {
        @apply text-amadeuswhite bg-amadeusblue border-amadeusblue;
    }

    .am-c-df_btn-outline-primary.disabled,
    .am-c-df_btn-outline-primary:disabled {
        border-color: var(--amadeus-color-lightergrey);
        background-color: transparent;
        @apply text-amadeusgray300;
    }
    .am-c-df_btn-primary-danger {
        @apply text-amadeuswhite bg-amadeusred border-amadeusred;
    }

    .am-c-df_btn-primary-danger:not(:disabled):not(.disabled).active:focus,
    .am-c-df_btn-primary-danger:not(:disabled):not(.disabled):active:focus {
        box-shadow: 0 0 0 0.2rem rgb(198 0 0/ 50%);
    }

    .am-c-df_btn-primary-danger:not(:disabled):not(.disabled).active,
    .am-c-df_btn-primary-danger:not(:disabled):not(.disabled):active {
        border-color: var(--amadeus-color-red);
        @apply text-amadeuswhite bg-amadeusred800;
    }

    .am-c-df_btn-primary-danger:hover {
        background-color: var(--amadeus-color-red-800);
        border-color: var(--amadeus-color-red-800);
        @apply text-amadeuswhite;
    }

    .am-c-df_btn-primary-danger.focus,
    .am-c-df_btn-primary-danger:focus {
        background-color: var(--amadeus-color-red);
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(198 0 0/ 50%);
        @apply text-amadeuswhite border-amadeusred;
    }

    .am-c-df_btn-primary-danger.disabled,
    .am-c-df_btn-primary-danger:disabled {
        background-color: var(--amadeus-color-lightergrey);
        border-color: var(--amadeus-color-lightergrey);
        @apply text-amadeusgray300;
    }

    .am-c-df_btn-outline-primary-danger {
        @apply text-amadeusred border-amadeusred;
    }

    .am-c-df_btn-outline-primary-danger:not(:disabled):not(.disabled).active:focus,
    .am-c-df_btn-outline-primary-danger:not(:disabled):not(.disabled):active:focus {
        box-shadow: 0 0 0 0.2rem rgb(198 0 0 / 50%);
    }

    .am-c-df_btn-outline-primary-danger:not(:disabled):not(.disabled).active,
    .am-c-df_btn-outline-primary-danger:not(:disabled):not(.disabled):active {
        background-color: var(--amadeus-color-gray-50);
        @apply text-amadeusred border-amadeusred;
    }
    .am-c-df_btn-outline-primary-danger:not(:disabled):not(.disabled):hover {
        background-color: var(--amadeus-color-gray-100);
        @apply text-amadeusred;
    }

    .am-c-df_btn-outline-primary-danger.focus,
    .am-c-df_btn-outline-primary-danger:focus {
        box-shadow: 0 0 0 0.2rem rgb(198 0 0 / 50%);
        @apply border-amadeusred;
    }
    .am-c-df_btn-outline-primary-danger:hover {
        @apply text-amadeusred bg-amadeusred border-amadeusred;
    }

    .am-c-df_btn-outline-primary-danger.disabled,
    .am-c-df_btn-outline-primary-danger:disabled {
        border-color: var(--amadeus-color-lightergrey);
        background-color: transparent;
        @apply text-amadeusgray300;
    }
</style>
