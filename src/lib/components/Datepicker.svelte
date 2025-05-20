<script lang="ts">
    import { run } from 'svelte/legacy';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-nocheck

    import {
        ANGLE_DOWN_SVG,
        ANGLE_UP_SVG,
        CHEVRON_LEFT_SVG,
        CHEVRON_RIGHT_SVG
    } from '$lib/config/constants';
    import { clickOutside } from '../utils/clickOutside';
    import {
        calendarize,
        createTimestamp,
        getDatesFromArray,
        getTimestamp,
        normalizeTimestamp
    } from '../utils/date';
    import Icon from './Icon.svelte';
    import SymbolIcon from './SymbolIcon.svelte';
    interface Props {
        selectedDate?: any;
        today?: any;
        defaultYear?: any;
        defaultMonth?: any;
        isOpen?: boolean;
        align?: string;
        disabledDates?: string[];
        enabledDates?: string[];
        alwaysShow?: boolean;
        disableDatesBefore?: string | null;
        disableDatesAfter?: string | null;
        dowLabels?: any;
        showYears?: boolean;
        monthLabels?: any;
        testId?: string;
        classes?: string;
        ariaLabelPreviousYear?: string;
        ariaLabelNextYear?: string;
        children?: import('svelte').Snippet;
    }

    let {
        selectedDate = $bindable(null),
        today = new Date(),
        defaultYear = today.getFullYear(),
        defaultMonth = today.getMonth(),
        isOpen = $bindable(false),
        align = 'left',
        disabledDates = [],
        enabledDates = [],
        alwaysShow = false,
        disableDatesBefore = null,
        disableDatesAfter = null,
        dowLabels = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
        showYears = false,
        monthLabels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
        testId = '',
        classes = '',
        ariaLabelPreviousYear = '',
        ariaLabelNextYear = '',
        children
    }: Props = $props();
    let tempEndDate: any;
    let prevSelectedDate: any;
    let prevEndDate: any;
    const handleCalendarClickOutside = () => {
        if (alwaysShow) {
            return;
        }
        if (prevSelectedDate && prevEndDate && selectedDate) {
            selectedDate = prevSelectedDate;
            prevSelectedDate = null;
            prevEndDate = null;
        }
        isOpen = false;
    };
    let selectedDateYear = $state(Number(defaultYear));
    let selectedDateMonth = $state(Number(defaultMonth));
    const updateCalendars = () => {
        selectedDateCalendar = selectedDateCalendar;
    };
    const goToPreviousMonth = () => {
        [selectedDateCalendar, next] = [prev, selectedDateCalendar];
        if (--selectedDateMonth < 0) {
            selectedDateMonth = 11;
            selectedDateYear--;
        }
    };
    const goToPreviousYear = () => {
        selectedDateYear--;
    };
    const goToNextMonth = () => {
        [prev, selectedDateCalendar] = [selectedDateCalendar, next];
        if (++selectedDateMonth > 11) {
            selectedDateMonth = 0;
            selectedDateYear++;
        }
    };
    const goToNextYear = () => {
        selectedDateYear++;
    };
    const isToday = (day: number, month: number, year: number) => {
        return today && todayMonth === month && todayDay === day && todayYear === year;
    };
    const handleSingleDateSelection = (timestamp: any) => {
        selectedDate = new Date(timestamp).getTime();
        if (!alwaysShow) {
            isOpen = false;
        }
    };
    const handleDateClick = function (e: any, day: number, month: number, year: number) {
        const classes = e.target?.closest('.date').className;
        if (
            classes.includes('future') ||
            classes.includes('past') ||
            classes.includes('disabled')
        ) {
            e.preventDefault();
            return false;
        }
        const timestamp = createTimestamp(year, month, day);
        handleSingleDateSelection(timestamp);
    };
    const isInRange = (day: number, month: number, year: number) => {
        const selectedDateTimestamp = createTimestamp(year, month, day);
        if (normalizeTimestamp(selectedDate) === selectedDateTimestamp) {
            return true;
        }
        return selectedDate === selectedDateTimestamp;
    };
    const isFirstInDateRange = (day: number, month: number, year: number) => {
        const currentTimestamp = createTimestamp(year, month, day);
        const startCompare = normalizeTimestamp(selectedDate);
        const tempEndCompare = normalizeTimestamp(tempEndDate);
        const currentCompare = normalizeTimestamp(currentTimestamp);
        if (startCompare) {
            return startCompare === currentCompare;
        }
        return tempEndCompare === currentCompare;
    };
    const isLastInDateRange = (day: number, month: number, year: number) => {
        const currentTimestamp = createTimestamp(year, month, day);
        const startCompare = normalizeTimestamp(selectedDate);
        const currentCompare = normalizeTimestamp(currentTimestamp);
        return startCompare === currentCompare;
    };
    const isDateDisabled = (day: number, month: number, year: number): boolean => {
        const selectedDateTimestamp = createTimestamp(year, month, day);
        return (
            (!enabled && !disabled) ||
            (enabled.length &&
                !enabled.map((d: any) => new Date(d).getTime()).includes(selectedDateTimestamp)) ||
            (disabled.length &&
                disabled.map((d: any) => new Date(d).getTime()).includes(selectedDateTimestamp))
        );
    };
    const isFutureSelectedDate = (day: number, month: number, year: number) => {
        if (!disableDatesAfter) {
            return false;
        }
        const selectedDateTimestamp = createTimestamp(year, month, day);
        const dayCompare = normalizeTimestamp(disableDatesAfter);
        const selectedCompare = normalizeTimestamp(selectedDateTimestamp);
        return dayCompare < selectedCompare;
    };
    const isPastSelectedDate = (day: number, month: number, year: number) => {
        if (!disableDatesBefore) {
            return false;
        }
        const selectedDateTimestamp = createTimestamp(year, month, day);
        const dayCompare = normalizeTimestamp(disableDatesBefore);
        const selectedCompare = normalizeTimestamp(selectedDateTimestamp);
        return dayCompare > selectedCompare;
    };
    const handleMouseEnter = function (e: any) {
        if (selectedDate) {
            return;
        }
        const { className: classes } = e.target || {};
        if (
            classes.includes('future') ||
            classes.includes('past') ||
            classes.includes('disabled')
        ) {
            return;
        }
    };
    const handleMouseLeave = () => {
        if (selectedDate) {
            return;
        }
    };
    run(() => {
        selectedDate = selectedDate ? getTimestamp(selectedDate) : null;
    });
    run(() => {
        if (selectedDate) {
            updateCalendars();
        }
    });
    let todayMonth = $derived(today && today.getMonth());
    let todayDay = $derived(today && today.getDate());
    let todayYear = $derived(today && today.getFullYear());
    let prev;
    run(() => {
        prev = calendarize(new Date(selectedDateYear, selectedDateMonth - 1), 1);
    });
    let selectedDateCalendar;
    run(() => {
        selectedDateCalendar = calendarize(new Date(selectedDateYear, selectedDateMonth), 1);
    });
    let next;
    run(() => {
        next = calendarize(new Date(selectedDateYear, selectedDateMonth + 1), 1);
    });
    let disabled = $derived(getDatesFromArray(disabledDates));
    let enabled = $derived(getDatesFromArray(enabledDates));
    run(() => {
        if (!selectedDate) {
            selectedDateYear = Number(defaultYear);
            selectedDateMonth = Number(defaultMonth);
        }
    });
    run(() => {
        if (
            (selectedDate && tempEndDate !== null) ||
            !isOpen ||
            disableDatesBefore ||
            disableDatesAfter
        ) {
            updateCalendars();
        }
    });
    run(() => {
        if (isOpen) {
            if (selectedDate) {
                const date = new Date(selectedDate);
                selectedDateYear = date.getFullYear();
                selectedDateMonth = date.getMonth();
            }
        }
    });
</script>

<div class="datepicker" use:clickOutside onclick_outside={handleCalendarClickOutside}>
    {@render children?.()}
    <div
        class="calendar-card {classes}"
        class:right={align === 'right'}
        class:show={isOpen}
        data-cy-id={testId}
    >
        <div class="calendar">
            <header>
                <a
                    class="icon-previous-month"
                    href={null}
                    tabindex="0"
                    onclick={() => {
                        goToPreviousMonth();
                    }}
                    onkeydown={(e) => {
                        if (e.key === 'Enter') {
                            goToPreviousMonth();
                        }
                    }}
                >
                    <SymbolIcon
                        iconSVG={CHEVRON_LEFT_SVG}
                        classes={'cursor-pointer'}
                        width={18}
                        height={18}
                        fill={'#666'}
                    />
                </a>
                <span>
                    <div>{monthLabels[selectedDateMonth]} {selectedDateYear}</div>
                    {#if showYears}
                        <div class="grid grid-flow-row row-span-1">
                            <Icon
                                iconSVG={ANGLE_UP_SVG}
                                label={ariaLabelNextYear}
                                clickLogic={goToNextYear}
                                width={12}
                                height={12}
                                fill={'#666'}
                            />
                            <Icon
                                iconSVG={ANGLE_DOWN_SVG}
                                label={ariaLabelPreviousYear}
                                clickLogic={goToPreviousYear}
                                width={12}
                                height={12}
                                fill={'#666'}
                            />
                        </div>
                    {/if}
                </span>
                <a
                    class="icon-next-month"
                    href={null}
                    tabindex="0"
                    onclick={() => {
                        goToNextMonth();
                    }}
                    onkeydown={(e) => {
                        if (e.key === 'Enter') {
                            goToNextMonth();
                        }
                    }}
                >
                    <SymbolIcon
                        iconSVG={CHEVRON_RIGHT_SVG}
                        classes={'cursor-pointer'}
                        width={18}
                        height={18}
                        fill={'#666'}
                    />
                </a>
            </header>
            <div class="month">
                {#each dowLabels as text, labelIndex (text)}
                    <span class="dow">{dowLabels[labelIndex]}</span>
                {/each}
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each { length: 6 } as week, weekIndex (weekIndex)}
                    {#if selectedDateCalendar[weekIndex]}
                        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                        {#each { length: 7 } as d, dayIndex (dayIndex)}
                            {#if selectedDateCalendar[weekIndex][dayIndex] !== 0}
                                <button
                                    type="button"
                                    class="date"
                                    class:today={isToday(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:start={isFirstInDateRange(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:end={isLastInDateRange(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:range={isInRange(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:past={isPastSelectedDate(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:future={isFutureSelectedDate(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    class:disabled={isDateDisabled(
                                        selectedDateCalendar[weekIndex][dayIndex],
                                        selectedDateMonth,
                                        selectedDateYear
                                    )}
                                    tabindex="0"
                                    onmouseenter={(e) => handleMouseEnter(e)}
                                    onmouseleave={handleMouseLeave}
                                    onclick={(e) =>
                                        handleDateClick(
                                            e,
                                            selectedDateCalendar[weekIndex][dayIndex],
                                            selectedDateMonth,
                                            selectedDateYear
                                        )}
                                >
                                    <span>{selectedDateCalendar[weekIndex][dayIndex]}</span>
                                </button>
                            {:else}
                                <div class="date other">&nbsp;</div>
                            {/if}
                        {/each}
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        /**
       * Common
       */
        --datepicker-state-active: #005eb8;
        --datepicker-state-hover: #e7f7fc;
        --datepicker-color: #1a1a1a;
        --primary-rgb: 0, 94, 184;
        --datepicker-font-family: Source Sans Pro, sans-serif;
        --datepicker-font-size-base: 14px;
        --datepicker-font-weight-base: 400;
        --datepicker-font-weight-medium: 500;
        --datepicker-font-weight-bold: 700;
        --datepicker-spacing: 6px;
        --datepicker-margin-xsmall: calc(var(--datepicker-spacing) / 4);
        --datepicker-margin-small: calc(var(--datepicker-spacing) / 2);
        --datepicker-margin-base: var(--datepicker-spacing);
        --datepicker-margin-large: calc(var(--datepicker-spacing) * 2);
        --datepicker-margin-xlarge: calc(var(--datepicker-spacing) * 3);
        --datepicker-margin-xxlarge: calc(var(--datepicker-spacing) * 4);
        --datepicker-margin-xxxlarge: calc(var(--datepicker-spacing) * 5);
        --datepicker-margin-jumbo: calc(var(--datepicker-spacing) * 6);
        --datepicker-padding-xsmall: calc(var(--datepicker-spacing) / 4);
        --datepicker-padding-small: calc(var(--datepicker-spacing) / 2);
        --datepicker-padding-base: var(--datepicker-spacing);
        --datepicker-padding-large: calc(var(--datepicker-spacing) * 2);
        --datepicker-padding-xlarge: calc(var(--datepicker-spacing) * 3);
        --datepicker-padding-xxlarge: calc(var(--datepicker-spacing) * 4);
        --datepicker-padding-xxxlarge: calc(var(--datepicker-spacing) * 5);
        --datepicker-padding-jumbo: calc(var(--datepicker-spacing) * 6);
        /**
       * Container
       */
        --datepicker-container-background: #fff;
        --datepicker-container-border: 1px solid rgb(204, 204, 204);
        --datepicker-container-border-radius: 0.125rem;
        --datepicker-container-box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1);
        --datepicker-container-font-family: var(--datepicker-font-family);
        --datepicker-container-left: 0;
        --datepicker-container-position: absolute;
        --datepicker-container-width: fit-content;
        --datepicker-container-zindex: 99;
        /**
       * Calendar
       */
        --datepicker-calendar-border: 0;
        --datepicker-calendar-padding: var(--datepicker-padding-base)
            var(--datepicker-padding-large) var(--datepicker-padding-xlarge);
        --datepicker-calendar-position: relative;
        --datepicker-calendar-width: 310px;
        /**
       * Calendar Header
       */
        --datepicker-calendar-header-align-items: center;
        --datepicker-calendar-header-color: var(--datepicker-color);
        --datepicker-calendar-header-display: flex;
        --datepicker-calendar-header-font-size: 1.125rem;
        --datepicker-calendar-header-justify-content: space-between;
        --datepicker-calendar-header-padding: var(--datepicker-padding-large)
            var(--datepicker-padding-large);
        --datepicker-calendar-header-user-select: none;
        /**
       * Calendar Header Text
       */
        --datepicker-calendar-header-text-align-items: center;
        --datepicker-calendar-header-text-color: var(--datepicker-color);
        --datepicker-calendar-header-text-display: flex;
        --datepicker-calendar-header-text-font-size: inherit;
        --datepicker-calendar-header-text-font-weight: var(--datepicker-font-weight-bold);
        --datepicker-calendar-header-text-gap: 8px;
        /**
       * Calendar DOW (Days of Week)
       */
        --datepicker-calendar-dow-color: var(--datepicker-color);
        --datepicker-calendar-dow-font-size: 0.75rem;
        --datepicker-calendar-dow-font-weight: var(--datepicker-font-weight-medium);
        --datepicker-calendar-dow-margin-bottom: var(--datepicker-margin-large);
        --datepicker-calendar-dow-text-align: center;
        /**
       * Calendar Month
       */
        --datepicker-calendar-container-display: grid;
        --datepicker-calendar-container-grid-template-columns: repeat(7, 1fr);
        --datepicker-calendar-container-grid-gap: 0;
        --datepicker-calendar-container-width: fit-content;
        /**
       * Calendar Day Container
       */
        --datepicker-calendar-day-container-appearance: none;
        --datepicker-calendar-day-container-background: inherit;
        --datepicker-calendar-day-container-border: 0;
        --datepicker-calendar-day-container-margin: 0;
        --datepicker-calendar-day-container-padding: 0;
        --datepicker-calendar-day-container-position: relative;
        --datepicker-calendar-day-container-text-align: center;
        /**
       * Calendar Day
       */
        --datepicker-calendar-day-align-items: center;
        --datepicker-calendar-day-background-hover: #e6e6e6;
        --datepicker-calendar-day-border: 1px solid transparent;
        --datepicker-calendar-day-border: 1px solid transparent;
        --datepicker-calendar-day-border-radius: 0.125rem;
        --datepicker-calendar-day-color: #232a32;
        --datepicker-calendar-day-color-disabled: #b9bdc1;
        --datepicker-calendar-day-color-hover: #232a32;
        --datepicker-calendar-day-cursor: pointer;
        --datepicker-calendar-day-cursor-disabled: default;
        --datepicker-calendar-day-display: flex;
        --datepicker-calendar-day-height: 40px;
        --datepicker-calendar-day-justify-content: center;
        --datepicker-calendar-day-font-family: var(--datepicker-font-family);
        --datepicker-calendar-day-font-size: var(--datepicker-font-size-base);
        --datepicker-calendar-day-margin-bottom: 1px;
        --datepicker-calendar-day-padding: var(--datepicker-padding-base);
        --datepicker-calendar-day-text-align: center;
        --datepicker-calendar-day-width: 40px;
        --datepicker-calendar-day-zindex-focus: 12;
        /**
       * Calendar Days Outside of Month
       */
        --datepicker-calendar-day-other-border: 0;
        --datepicker-calendar-day-other-box-shadow: none;
        --datepicker-calendar-day-other-color: #d1d3d6;
        /**
       * Calendar Today
       */
        --datepicker-calendar-today-background: transparent;
        --datepicker-calendar-today-cursor: cursor-pointer;
        --datepicker-calendar-today-font-weight: var(--datepicker-font-weight-bold);
        --datepicker-day-hover-text-decoration: underline;
        /**
       * Calendar Range Selected
       */
        --datepicker-calendar-range-selected-background: var(--datepicker-state-active);
        --datepicker-calendar-range-selected-border-radius: 0.125rem;
        --datepicker-calendar-range-selected-color: #fff;
        --datepicker-calendar-range-selected-font-weight: var(--datepicker-font-weight-bold);
        --datepicker-day-focus-border: 0.25rem solid rgba(var(--primary-rgb), 0.5);
        --datepicker-day-focus-outline-width: 0.2rem;
        --datepicker-calendar-range-selected-start-border-radius: 0.125rem;
    }
    .datepicker {
        font-size: var(--datepicker-font-size-base);
        position: relative;
    }
    .datepicker * {
        box-sizing: border-box;
    }
    .datepicker .calendar-card {
        background: var(--datepicker-container-background);
        border: var(--datepicker-container-border);
        border-radius: var(--datepicker-container-border-radius);
        box-shadow: var(--datepicker-container-box-shadow);
        display: none;
        font-family: var(--datepicker-container-font-family);
        grid-template-columns: 1fr;
        left: var(--datepicker-container-left);
        position: var(--datepicker-container-position);
        width: var(--datepicker-container-width);
        z-index: var(--datepicker-container-zindex);
    }
    .datepicker .calendar-card.right {
        left: auto;
        right: 0;
    }
    .datepicker .calendar-card.show {
        display: grid;
        top: 105%;
    }
    .datepicker .calendar-card .calendar {
        border: var(--datepicker-calendar-border);
        padding: var(--datepicker-calendar-padding);
        position: var(--datepicker-calendar-position);
        width: var(--datepicker-calendar-width);
    }
    .datepicker .calendar-card .calendar header {
        align-items: var(--datepicker-calendar-header-align-items);
        color: var(--datepicker-calendar-header-color);
        display: var(--datepicker-calendar-header-display);
        font-size: var(--datepicker-calendar-header-font-size);
        justify-content: var(--datepicker-calendar-header-justify-content);
        padding: var(--datepicker-calendar-header-padding);
        user-select: var(--datepicker-calendar-header-user-select);
    }
    .datepicker .calendar-card .calendar header > span {
        align-items: var(--datepicker-calendar-header-text-align-items);
        color: var(--datepicker-calendar-header-text-color);
        display: var(--datepicker-calendar-header-text-display);
        font-size: var(--datepicker-calendar-header-text-font-size);
        font-weight: var(--datepicker-calendar-header-text-font-weight);
        gap: var(--datepicker-calendar-header-text-gap);
    }
    .datepicker .calendar-card .calendar .date:focus-visible {
        border-radius: 0.125rem;
        outline: 5px auto -webkit-focus-ring-color;
        z-index: 10;
    }
    .datepicker .calendar-card .calendar header a:hover {
        background-color: #e6e6e6;
        border-color: transparent;
    }
    .datepicker .calendar-card .calendar .month {
        display: var(--datepicker-calendar-container-display);
        grid-template-columns: var(--datepicker-calendar-container-grid-template-columns);
        grid-gap: var(--datepicker-calendar-container-grid-gap);
        width: var(--datepicker-calendar-container-display);
    }
    .datepicker .calendar-card .calendar .dow {
        color: var(--datepicker-calendar-dow-color);
        font-size: var(--datepicker-calendar-dow-font-size);
        font-weight: var(--datepicker-calendar-dow-font-weight);
        margin-bottom: var(--datepicker-calendar-dow-margin-bottom);
        text-align: var(--datepicker-calendar-dow-text-align);
    }
    .datepicker .calendar-card .calendar .date {
        appearance: var(--datepicker-calendar-day-container-appearance);
        background: var(--datepicker-calendar-day-container-background);
        border: var(--datepicker-calendar-day-container-border);
        margin: var(--datepicker-calendar-day-container-margin);
        padding: var(--datepicker-calendar-day-container-padding);
        position: var(--datepicker-calendar-day-container-position);
        text-align: var(--datepicker-calendar-day-container-text-align);
    }
    .datepicker .calendar-card .calendar .date span {
        align-items: var(--datepicker-calendar-day-align-items);
        border: var(--datepicker-calendar-day-border);
        border-radius: var(--datepicker-calendar-day-border-radius);
        color: var(--datepicker-calendar-day-color);
        cursor: var(--datepicker-calendar-day-cursor);
        display: var(--datepicker-calendar-day-display);
        height: var(--datepicker-calendar-day-height);
        justify-content: var(--datepicker-calendar-day-justify-content);
        font-family: var(--datepicker-calendar-day-font-family);
        font-size: var(--datepicker-calendar-day-font-size);
        margin-bottom: var(--datepicker-calendar-day-margin-bottom);
        padding: var(--datepicker-calendar-day-padding);
        text-align: var(--datepicker-calendar-day-text-align);
        width: var(--datepicker-calendar-day-width);
    }
    .datepicker
        .calendar-card
        .calendar
        .date:not(.other):not(.range):not(.future):not(.past):not(.disabled)
        span:hover {
        background-color: var(--datepicker-calendar-day-background-hover);
        color: var(--datepicker-calendar-day-color-hover);
        text-decoration: var(--datepicker-day-hover-text-decoration);
    }
    .datepicker .calendar-card .calendar .date:focus {
        z-index: var(--datepicker-calendar-day-zindex-focus);
    }
    .datepicker .calendar-card .calendar .date.disabled span,
    .datepicker .calendar-card .calendar .date.past span,
    .datepicker .calendar-card .calendar .date.future span {
        color: var(--datepicker-calendar-day-color-disabled);
        cursor: var(--datepicker-calendar-day-cursor-disabled);
    }
    .datepicker .calendar-card .calendar .date.today span {
        background: var(--datepicker-calendar-today-background);
        cursor: var(--datepicker-calendar-today-cursor);
        font-weight: var(--datepicker-calendar-today-font-weight);
    }
    .datepicker .calendar-card .calendar .date.today span:before {
        content: '.';
        display: inline-block;
        position: absolute;
        bottom: 0.25rem;
        text-align: center;
        width: 100%;
    }
    .datepicker .calendar-card .calendar .date.range.start span,
    .datepicker .calendar-card .calendar .date.range.end span {
        background-color: var(--datepicker-calendar-range-selected-background);
        border-radius: var(--datepicker-calendar-range-selected-border-radius);
        color: var(--datepicker-calendar-range-selected-color);
        font-weight: var(--datepicker-calendar-range-selected-font-weight);
    }
    .datepicker .calendar-card .calendar .date.range.start:focus span:after,
    .datepicker .calendar-card .calendar .date.range.end:focus span:after {
        content: '';
        display: block;
        position: absolute;
        top: calc(-1 * var(--datepicker-day-focus-outline-width));
        bottom: calc(-1 * var(--datepicker-day-focus-outline-width));
        left: calc(-1 * var(--datepicker-day-focus-outline-width));
        right: calc(-1 * var(--datepicker-day-focus-outline-width));
        border-radius: 0.125rem;
        border: var(--datepicker-day-focus-border);
    }
    .datepicker .calendar-card .calendar .date.range.start:focus span,
    .datepicker .calendar-card .calendar .date.range.end:focus span {
        border: 0px none;
        position: relative;
    }
    .datepicker .calendar-card .calendar .date.range.start.end {
        box-shadow: none;
    }
    .datepicker .calendar-card .calendar .date.other {
        border: var(--datepicker-calendar-day-other-border);
        box-shadow: var(--datepicker-calendar-day-other-box-shadow);
        color: var(--datepicker-calendar-day-other-color);
    }
    .icon-previous-month,
    .icon-next-month {
        position: relative;
        text-align: center;
        margin: 0 0.125rem;
        z-index: initial;
        height: 2.25rem;
        min-width: 2.25rem;
        line-height: 2.25rem;
        padding-left: var(--datepicker-icon-padding-x, 0.6rem);
        padding-right: var(--datepicker-icon-padding-x, 0.125rem);
        font-size: var(--datepicker-icon-font-size, 1rem);
        color: var(--datepicker-icon-color, #000);
        background-color: var(--datepicker-icon-bg, #fff);
        border-radius: var(--datepicker-icon-border-radius, 50%);
        border: none;
        display: flex;
        align-items: center;
        margin-top: -1px;
        &:focus {
            color: var(--datepicker-icon-focus-color, #005eb8);
            background-color: var(--datepicker-icon-focus-bg, #ccc);
            box-shadow: var(
                --datepicker-icon-focus-box-shadow,
                0 0 0 0.25rem rgba(0, 94, 184, 0.25)
            );
        }
    }
    @media only screen and (max-width: 800px) {
        .datepicker .calendar-card.show {
            display: flex;
            flex-direction: column;
        }
    }
</style>
