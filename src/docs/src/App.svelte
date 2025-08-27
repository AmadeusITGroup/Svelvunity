<script lang="ts">
    import './app.css';
    import { fade, slide } from 'svelte/transition';
    import { sineIn } from 'svelte/easing';
    import type { ITabItem } from './interfaces/tabItem.interface';
    import Home from './Home.svx';
    import Accordion from './lib/Accordion.svx';
    import Button from './lib/Button.svx';
    import Checkbox from './lib/Checkbox.svx';
    import Datepicker from './lib/Datepicker.svx';
    import ErrorPage from './lib/ErrorPage.svx';
    import Icon from './lib/Icon.svx';
    import InfiniteScroll from './lib/InfiniteScroll.svx';
    import Input from './lib/Input.svx';
    import Loading from './lib/Loading.svx';
    import PageTransition from './lib/PageTransition.svx';
    import Pagination from './lib/Pagination.svx';
    import Popover from './lib/Popover.svx';
    import Progressbar from './lib/Progressbar.svx';
    import Radio from './lib/Radio.svx';
    import Select from './lib/Select.svx';
    import Tabs from './lib/Tabs.svx';
    import Toast from './lib/Toast.svx';
    import Tooltip from './lib/Tooltip.svx';
    import UserProfileMenu from './lib/UserProfileMenu.svx';
    import Sidebar from './lib/Sidebar.svelte';
    import shadesOfPurple from 'svelte-highlight/styles/shades-Of-Purple';

    let items: ITabItem[] = [
        {
            label: 'Getting Started',
            value: 1,
            component: Home
        },
        {
            label: 'Accordion',
            value: 2,
            component: Accordion
        },
        {
            label: 'Button',
            value: 3,
            component: Button
        },
        {
            label: 'Checkbox',
            value: 4,
            component: Checkbox
        },
        {
            label: 'Datepicker',
            value: 5,
            component: Datepicker
        },
        {
            label: 'Error Page',
            value: 6,
            component: ErrorPage
        },
        {
            label: 'Icon',
            value: 7,
            component: Icon
        },
        {
            label: 'Infinite Scroll',
            value: 8,
            component: InfiniteScroll
        },
        {
            label: 'Input',
            value: 9,
            component: Input
        },
        {
            label: 'Loading',
            value: 10,
            component: Loading
        },
        {
            label: 'Page Transition',
            value: 11,
            component: PageTransition
        },
        {
            label: 'Pagination',
            value: 12,
            component: Pagination
        },
        {
            label: 'Progressbar',
            value: 13,
            component: Progressbar
        },
        {
            label: 'Popover',
            value: 14,
            component: Popover
        },
        {
            label: 'Radio',
            value: 15,
            component: Radio
        },
        {
            label: 'Select',
            value: 16,
            component: Select
        },
        {
            label: 'Tabs',
            value: 17,
            component: Tabs
        },
        {
            label: 'Toast',
            value: 18,
            component: Toast
        },
        {
            label: 'Tooltip',
            value: 19,
            component: Tooltip
        },
        {
            label: 'User Profile Menu',
            value: 20,
            component: UserProfileMenu
        }
    ];

    let activeTabValue = $state(1);

    const handleClick = (tabValue: number) => (event: MouseEvent) => {
        activeTabValue = tabValue;
        const button = event.currentTarget as HTMLButtonElement;
        button.focus();
    };

    $effect(() => {
        console.log(activeTabValue);
    });

    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html shadesOfPurple}</svelte:head>
<main>
    <div class="layout">
        <Sidebar
            transitionType="fly"
            {transitionParams}
            hidden={false}
            activateClickOutside={false}
            id="filter-sidebar"
        >
            <div class="grid grid-flow-col grid-rows-1 items-center">
                <img src="/Svelvunity/favicon.png" alt="svelte-logo" width="60px" height="60px" />
                <h1 class="font-bold text-2xl">Svelvunity</h1>
            </div>
            <div class="nav-links overflow-auto">
                {#each items as item}
                    <span class="item {activeTabValue === item.value ? 'active active-item' : ''}">
                        <button
                            onclick={handleClick(item.value)}
                            class:focused={activeTabValue === item.value}
                            class="cursor-pointer"
                        >
                            {item.label}
                        </button>
                    </span>
                {/each}
            </div>
        </Sidebar>
        <main class="content">
            <div in:slide|global={{ duration: 200 }} out:slide={{ duration: 200 }}>
                {#each items as item}
                    {#if activeTabValue === item.value}
                        <div class="box" in:fade={{ duration: 200, delay: 200 }}>
                            {#key activeTabValue}
                                <item.component {...item.props} />
                            {/key}
                        </div>
                    {/if}
                {/each}
            </div>
        </main>
    </div>
</main>

<style>
    .layout {
        display: flex;
        min-height: 100vh;
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 2rem;
    }

    .nav-links button {
        color: white;
        text-decoration: none;
        padding: 0.5rem;
    }

    .nav-links button:hover {
        background-color: #a81ce4;
        border-radius: 4px;
        border-color: rgb(75, 10, 81);
    }

    .nav-links button:focus {
        background-color: #a81ce4;
        border-radius: 4px;
        border-color: rgb(75, 10, 81);
    }

    .content {
        margin-left: 250px;
        padding: 2rem;
        flex: 1;
    }

    button.focused {
        background-color: #a81ce4;
        border-radius: 4px;
        border-color: rgb(75, 10, 81);
        /* Optional: add an outline or other visual indicator */
        outline: none;
    }

    button:focus:not(.focused) {
        outline: none;
    }
</style>
