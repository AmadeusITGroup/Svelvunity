<script lang="ts">
    import SymbolIcon from './SymbolIcon.svelte';
    import { CROSS_SVG } from '$lib';
    import { SEARCH_SVG } from '$lib';
    import Icon from './Icon.svelte';
    import Input from './Input.svelte';

    export let placeholder = '';
    export let value = '';
    export let onInput: (event: Event) => void;
    export let testId: string = 'search-component-input';
    export let onClear: () => void;
</script>

<div class="col-span-4 col-start-9 relative search-container">
    <div class="absolute inset-y-0 left-0 pl-3 items-center cursor-pointer z-10">
        <SymbolIcon
            iconSVG={SEARCH_SVG}
            fill="#9a9a9a"
            viewBox="0 0 30 30"
            width={17}
            height={17}
            classes="mt-2.5"
            testId="search-symbol-icon-search"
        />
    </div>
    <Input
        classesForInput="search-input block leading-5"
        {placeholder}
        inputName="searchInput"
        bind:inputValue={value}
        {testId}
        {onInput}
    />
    {#if value}
        <div class="absolute top-2 mr-2 right-0 cursor-pointer">
            <Icon
                iconSVG={CROSS_SVG}
                width={17}
                height={17}
                viewBox="-90 -90 448 512"
                fill="#9a9a9a"
                classes="pb-1"
                testId="search-icon-clear"
                clickLogic={() => {
                    onClear();
                }}
            />
        </div>
    {/if}
</div>

<style>
    .search-container :global(.search-input) {
        padding: 0.5rem 2rem;
    }
</style>
