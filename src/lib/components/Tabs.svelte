<script lang="ts">
    interface Props {
        items?: any[];
        activeTabValue?: number;
    }

    let { items = [], activeTabValue = $bindable(1) }: Props = $props();

    const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul class="tabs">
    {#each items as item}
        <li class="item {activeTabValue === item.value ? 'active active-item' : ''}">
            <button onclick={handleClick(item.value)} aria-label={item.label}>{item.label}</button>
        </li>
    {/each}
</ul>
{#each items as item}
    {#if activeTabValue == item.value}
        <div class="box">
            <item.component />
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
