<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let inputName = '';
	export let labelName = '';
	export let classes = '';
	export let classesForInput = '';
	export let classesForLabel = '';
	export let inputValue: boolean;
	export let required = false;
	export let isDisabled = false;
	export let testId: string;

	const dispatch = createEventDispatcher();
</script>

<div class="checkbox-wrapper {classes}">
	<input
		id={inputName}
		{required}
		data-cy-id={testId}
		type="checkbox"
		disabled={isDisabled}
		class="input-checkbox {classesForInput}"
		bind:checked={inputValue}
		on:change={(e) => dispatch('onInputChanges', e)}
	/>
	<label class="input-label {classesForLabel}" for={inputName}>{labelName}</label>
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
