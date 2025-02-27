<script lang="ts">
    import {
        BACKFORWARD_STEP_SVG,
        CHEVRON_LEFT_SVG,
        CHEVRON_RIGHT_SVG,
        FORWARD_STEP_SVG
    } from '$lib/config/constants';
    import SymbolIcon from './SymbolIcon.svelte';

    export let rows: any = [];
    export let perPage = 20;
    export let trimmedRows;
    export let paginationTestId = '';
    export let prevPageBtnTestId = '';
    export let nextPageBtnTestId = '';
    export let firstPageBtnTestId = '';
    export let lastPageBtnTestId = '';
    export let currPageTestId = '';
    export let totalPagesTestId = '';

    $: totalRows = rows.length;
    $: currentPage = 0;
    $: totalPages = Math.ceil(totalRows / perPage);
    $: start = currentPage * perPage;
    $: end = currentPage === totalPages - 1 ? totalRows - 1 : start + perPage - 1;

    $: trimmedRows = rows.slice(start, end + 1);

    $: totalRows, (currentPage = 0);
    $: currentPage, start, end;

    function setCurrentPage(newPage: number) {
        currentPage = newPage;
    }
</script>

{#if totalRows && totalRows > perPage}
    <div class="pagination" data-cy-id={paginationTestId}>
        <a
            class="pagination-icon"
            href={null}
            tabindex="0"
            class:disabled={currentPage === 0}
            aria-disabled={currentPage === 0}
            on:click={() => {
                setCurrentPage(0);
            }}
            on:keypress={(e) => {
                if (e.key === 'Enter') setCurrentPage(0);
            }}
            data-cy-id={firstPageBtnTestId}
        >
            <SymbolIcon
                classes={currentPage === 0 ? 'disabled' : 'cursor-pointer'}
                iconSVG={BACKFORWARD_STEP_SVG}
                width={20}
                height={20}
                fill={currentPage === 0 ? '#B3B3B3' : '#666'}
            />
        </a>
        <a
            class="pagination-icon"
            href={null}
            tabindex="0"
            class:disabled={currentPage === 0}
            aria-disabled={currentPage === 0}
            on:click={() => {
                if (currentPage !== 0) setCurrentPage(currentPage - 1);
            }}
            on:keypress={(e) => {
                if (e.key === 'Enter' && currentPage !== 0) setCurrentPage(currentPage - 1);
            }}
            data-cy-id={prevPageBtnTestId}
        >
            <SymbolIcon
                classes={currentPage === 0 ? 'disabled' : 'cursor-pointer'}
                iconSVG={CHEVRON_LEFT_SVG}
                width={20}
                height={20}
                fill={currentPage === 0 ? '#B3B3B3' : '#666'}
            />
        </a>
        <p>
            <span data-cy-id={currPageTestId}>{currentPage + 1}</span> of
            <span data-cy-id={totalPagesTestId}>{totalPages}</span>
        </p>
        <a
            class="pagination-icon"
            href={null}
            class:disabled={currentPage === totalPages - 1}
            aria-disabled={currentPage === totalPages - 1}
            tabindex="0"
            on:click={() => {
                if (currentPage !== totalPages - 1) setCurrentPage(currentPage + 1);
            }}
            on:keypress={(e) => {
                if (e.key === 'Enter' && currentPage !== totalPages - 1) {
                    setCurrentPage(currentPage + 1);
                }
            }}
            data-cy-id={nextPageBtnTestId}
        >
            <SymbolIcon
                classes={currentPage === totalPages - 1 ? 'disabled' : 'cursor-pointer'}
                iconSVG={CHEVRON_RIGHT_SVG}
                width={20}
                height={20}
                fill={currentPage === totalPages - 1 ? '#B3B3B3' : '#666'}
            />
        </a>
        <a
            class="pagination-icon"
            href={null}
            class:disabled={currentPage === totalPages - 1}
            aria-disabled={currentPage === totalPages - 1}
            tabindex="0"
            on:click={() => {
                setCurrentPage(totalPages - 1);
            }}
            on:keypress={(e) => {
                if (e.key === 'Enter') {
                    setCurrentPage(totalPages - 1);
                }
            }}
            data-cy-id={lastPageBtnTestId}
        >
            <SymbolIcon
                classes={currentPage === totalPages - 1 ? 'disabled' : 'cursor-pointer'}
                iconSVG={FORWARD_STEP_SVG}
                width={20}
                height={20}
                fill={currentPage === totalPages - 1 ? '#B3B3B3' : '#666'}
            />
        </a>
    </div>
{/if}

<style>
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
    }

    .pagination p {
        margin: 0 1rem;
    }

    .disabled {
        cursor: not-allowed;
    }

    .pagination-icon {
        position: relative;

        text-align: center;
        margin: 0 0.125rem;
        z-index: initial;

        height: 2.25rem;
        min-width: 2.25rem;
        line-height: 2.25rem;

        padding-left: var(--df-pagination-padding-x, 0.6rem);
        padding-right: var(--df-pagination-padding-x, 0.125rem);
        font-size: var(--df-pagination-font-size, 1rem);
        color: var(--df-pagination-color, #000);
        background-color: var(--df-pagination-bg, #fff);
        border-radius: var(--df-pagination-border-radius, 50%);

        border: none;
        display: flex;
        align-items: center;
        margin-top: -1px;

        &:hover {
            color: var(--df-pagination-hover-color, #000);
            background-color: var(--df-pagination-hover-bg, #ccc);
            border-color: var(--df-pagination-hover-border-color, #b3b3b3);
        }

        &:focus {
            color: var(--df-pagination-focus-color, #005eb8);
            background-color: var(--df-pagination-focus-bg, #ccc);
            box-shadow: var(--df-pagination-focus-box-shadow, 0 0 0 0.25rem rgba(0, 94, 184, 0.25));
        }

        &.disabled {
            color: var(--df-pagination-disabled-color, #b3b3b3);
            background-color: var(--df-pagination-disabled-bg, #fff);
            border-color: var(--df-pagination-disabled-border-color, #b3b3b3);
        }
    }
</style>
