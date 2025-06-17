<script lang="ts">
    import { type Component } from 'svelte';

    interface TabsConfiguration<Props extends Record<string, any> = any> {
        tabs?: {
            label: string;
            value: number;
            component: Component<Props>;
            props?: Record<string, any>;
        }[];
        activeTabValue?: number;
    }

    let { tabs = [], activeTabValue = $bindable(tabs[0].value) }: TabsConfiguration = $props();

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul class="tabs">
    {#each tabs as tab}
        <li class="item {activeTabValue === tab.value ? 'active active-item' : ''}">
            <button onclick={handleClick(tab.value)} aria-label={tab.label}>{tab.label}</button>
        </li>
    {/each}
</ul>
{#each tabs as tab}
    {#if activeTabValue == tab.value}
        <div class="box">
            <tab.component {...tab.props} />
        </div>
    {/if}
{/each}

<style>
    .box {
        margin-bottom: 10px;
        padding: 40px;
        border: 1px solid #dee2e6;
        border-radius: 0 0 0.5rem 0.5rem;
        border-top: 0;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
        border-bottom: 1px solid #dee2e6;
    }
    li {
        margin-bottom: -1px;
    }

    button {
        display: block;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 17px;
        font-weight: 400;
        height: 37px;
        line-height: 29.75px;
    }

    li.active > button {
        color: #000835;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
    }

    .tabs {
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        background-color: white;
        box-sizing: border-box;
    }

    .item {
        padding: 0.75rem 1rem 0 1rem;
    }

    .item:hover {
        color: rgba(0, 0, 0, 0.9);
    }

    .active-item {
        border-bottom: 3px solid #3a8bff;
    }
</style>
