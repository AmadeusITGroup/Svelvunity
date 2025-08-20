<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { ITabItem } from '../interfaces/tabItem.interface';

	export let items: ITabItem[] = [];
	export let activeTabValue = 1;
	export let tabClasses = '';
	export let testingId = '';

	const handleClick = (tabValue: number) => () => {
		activeTabValue = tabValue;
	};
</script>

<ul class="{tabClasses} tabs" data-cy-id={testingId}>
	{#each items as item}
		<li
			class="item {activeTabValue === item.value ? 'active active-item' : ''}"
			class:tabs__nav-item--disabled={item.disabled}
			data-cy-id={item.testingId ?? ''}
		>
			<button
				class:tabs__nav-item--disabled={item.disabled}
				on:click={item.disabled ? null : handleClick(item.value)}
			>
				{item.label}
			</button>
		</li>
	{/each}
</ul>

{#each items as item}
	{#if activeTabValue === item.value}
		<div class="box" in:fade={{ duration: 200, delay: 200 }}>
			<svelte:component this={item.component} {...item.props} />
		</div>
	{/if}
{/each}

<style>
	.box {
		margin-bottom: 10px;
		padding: 40px;
		overflow: hidden;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 2px solid #d2dbe6;
	}
	li {
		margin-bottom: -1px;
		text-align: -webkit-match-parent;
	}

	button {
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 17px;
		font-weight: 400;
		height: 37px;
	}

	li.active > button {
		color: #000835;
		background-color: #fff;
	}

	.tabs {
		color: rgba(0, 0, 0, 0.6);
		display: flex;
		background-color: white;
		box-sizing: border-box;
	}

	.item {
		padding: 0.75rem 1rem 0.25rem 1rem;
		border-bottom: 2px solid #d2dbe6;
	}

	.item:hover {
		color: rgba(0, 0, 0, 0.9);
	}

	.active-item {
		border-bottom: 3px solid #3a8bff;
	}

	.tabs__nav-item--disabled,
	.tabs__nav-item--disabled:hover {
		cursor: not-allowed;
		outline: none;
		color: #b3b3b3;
	}
	.bx--tabs {
		line-height: var(--cds-body-short-01-line-height, 1.28572);
		letter-spacing: var(--cds-body-short-01-letter-spacing, 0.16px);
		width: 100%;
		height: auto;
	}

	.bx--tabs-trigger:focus,
	.bx--tabs-trigger:active {
		outline: 2px solid var(--amadeus-color-darkblue);
		outline-offset: -2px;
	}

	.bx--tabs-trigger {
		display: flex;
		height: 3rem;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem 0 1rem;
		border-bottom: 3px solid #3a8bff;
		background-color: var(--cds-field-01, #f4f4f4);
		color: var(--cds-text-01, #161616);
		cursor: pointer;
		outline: 2px solid rgba(0, 0, 0, 0);
	}
	.bx--tabs__nav {
		box-shadow: 0 2px 6px var(--cds-shadow, rgba(0, 0, 0, 0.3));
		position: absolute;
		z-index: 49;
		display: flex;
		width: 100%;
		max-height: 600px;
		flex-direction: column;
		padding: 0;
		margin: 0;
		background: var(--cds-ui-01, #f4f4f4);
		list-style: none;
		transition: max-height 70ms cubic-bezier(0.2, 0, 0.38, 0.9);
	}

	.bx--tabs__nav-item--selected:not(.bx--tabs__nav-item--disabled) {
		display: none;
		border: none;
		transition: color 70ms cubic-bezier(0.2, 0, 0.38, 0.9);
	}

	@media (max-width: 768px) {
		.box {
			margin-bottom: 10px;
			padding: 10px;
			padding-top: 30px;
			overflow: hidden;
		}
	}
</style>
