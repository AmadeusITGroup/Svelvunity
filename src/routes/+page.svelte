<script lang="ts">
    // @ts-nocheck

    import {
        ButtonType,
        CALENDAR_SVG,
        CIRCLE_X_SVG,
        EYE_SVG,
        INFO_SVG,
        InputTypes,
        MINUS_CIRCLE_SVG,
        Size,
        TRASH_SVG,
        TRIANGLE_SVG,
        toast
    } from '$lib';
    import { Direction } from '$lib/enums/direction.enum';
    import '../app.css';

    import AccordionItem from '$lib/components/AccordionItem.svelte';
    import Button from '$lib/components/Button.svelte';
    import Checkbox from '$lib/components/Checkbox.svelte';
    import Datepicker from '$lib/components/Datepicker.svelte';
    import Frame from '$lib/components/Frame.svelte';
    import Icon from '$lib/components/Icon.svelte';
    import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
    import Input from '$lib/components/Input.svelte';
    import Loading from '$lib/components/Loading.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import ProgressBar from '$lib/components/ProgressBar.svelte';
    import Popover from '$lib/components/Popover.svelte';
    import RadioInput from '$lib/components/RadioInput.svelte';
    import Select from '$lib/components/Select.svelte';
    import Tabs from '$lib/components/Tabs.svelte';
    import SvelteToast from '$lib/components/Toast/SvelteToast.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import UserProfileMenu from '$lib/components/UserProfileMenu.svelte';
    import { formatDate } from '$lib/utils/date';
    import InlineEdit from '$lib/components/InlineEdit.svelte';
    import { Position } from '$lib/enums/position.enum';
    let progress = $state(50);
    const PLUS_CIRCLE_SVG =
        'M384 250v12c0 6.6-5.4 12-12 12h-98v98c0 6.6-5.4 12-12 12h-12c-6.6 0-12-5.4-12-12v-98h-98c-6.6 0-12-5.4-12-12v-12c0-6.6 5.4-12 12-12h98v-98c0-6.6 5.4-12 12-12h12c6.6 0 12 5.4 12 12v98h98c6.6 0 12 5.4 12 12zm120 6c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-32 0c0-119.9-97.3-216-216-216-119.9 0-216 97.3-216 216 0 119.9 97.3 216 216 216 119.9 0 216-97.3 216-216z';

    let paginationValues = $state();

    let age = $state(18);

    let tabs = [
        { label: 'Applications', value: 1, component: Frame },
        { label: 'Header', value: 2, component: Frame },
        { label: 'Tab 3', value: 3, component: Frame, props: {} }
    ];

    let infiniteScrollData = $state([14, 15, 16, 17]);

    let cities = [
        { id: 'amsterdam', value: 'Amsterdam' },
        { id: 'rotterdam', value: 'Rotterdam' },
        { id: 'the_hague', value: 'The Hague' },
        { id: 'utrecht', value: 'Utrecht' },
        { id: 'eindhoven', value: 'Eindhoven' },
        { id: 'den_haag', value: 'Den Haag' },
        { id: 'groningen', value: 'Groningen' },
        { id: 'haarlem', value: 'Haarlem' },
        { id: 'leiden', value: 'Leiden' },
        { id: 'maastricht', value: 'Maastricht' }
    ];

    let monthLabelsDE = [
        'Januar',
        'Februar',
        'Maerz',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ];

    let dowLabelsDE = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'];

    let selectedDate: Date | string = $state('1988-06-20');
    let selectedDateWithYears = $state(new Date('2022-01-15'));
    let selectedDateDE = $state(new Date());
    let selectedDateAlways = $state(new Date());
    let selectedDateDisable = $state(new Date());
    let selectedDateEnable = $state(new Date());
    let dateFormat = 'MM/dd/yy';
    let dateFormatDE = 'yyyy-MM-dd';
    let isOpen = $state(false);
    let isOpenShowYears = $state(false);
    let isOpenDE = $state(false);
    let isOpenAlways = $state(false);
    let isOpenDisable = $state(false);
    let isOpenEnable = $state(false);
    let showModal = $state(false);

    let formattedSelectedDate = $derived(formatDate(selectedDate, dateFormat));
    let formattedSelectedDateWithYears = $derived(formatDate(selectedDateWithYears, dateFormat));
    let formattedSelectedDateDE = $derived(formatDate(selectedDateDE, dateFormatDE));
    let formattedSelectedDateAlways = $derived(formatDate(selectedDateAlways, dateFormat));
    let formattedSelectedDateDisable = $derived(formatDate(selectedDateDisable, dateFormat));
    let formattedSelectedDateEnable = $derived(formatDate(selectedDateEnable, dateFormat));

    let InlineEditValue = $state('Max Musterman');
    let inlineEditValueDisabled = $state('George Costanza');

    const MS_PER_DAY = 86_400_000;
    const today = new Date();
</script>

<main aria-label="Svelvunity main content">
    <div class="p-4">
        <h1 class="pt-2 pb-4 text-[#4f0230]">Svelvunity</h1>

        <SvelteToast />

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Accordion component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each { length: 3 } as _, i}
                    <AccordionItem
                        disabled={i !== 1 ? true : false}
                        showBody={i !== 2 ? true : false}
                        fillEmptyChevronSpace={true}
                    >
                        {#snippet buttonSnippet()}
                            <div>Click me! {i}</div>
                        {/snippet}

                        {#snippet bodySnippet()}
                            <div>You've clicked on the button! {i}</div>
                        {/snippet}
                    </AccordionItem>
                {/each}
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Button component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div class="gap-4 items-center">
                    <Button label="Warning" clickLogic={() => toast.warning('Attention please')} />
                    <Button
                        label="Success"
                        type={ButtonType.OutlinePrimary}
                        buttonSize={Size.Small}
                        clickLogic={() => toast.success('Yuppi successful')}
                    />

                    <Button
                        label="Done"
                        additionalClasses="text-white"
                        buttonSize={Size.Large}
                        clickLogic={() => toast.success('It is done')}
                    />

                    <Button
                        label="Info"
                        type={ButtonType.OutlinePrimary}
                        buttonSize={Size.XLarge}
                        clickLogic={() => toast.info('For your information')}
                    />
                    <Button
                        label="Failure"
                        type={ButtonType.PrimaryDanger}
                        additionalClasses="text-white"
                        buttonSize={Size.Large}
                        clickLogic={() => toast.failure('Sorry failed!')}
                    />
                    <Button
                        label="Error"
                        type={ButtonType.OutlinePrimaryDanger}
                        buttonSize={Size.small}
                        clickLogic={() => toast.failure('Sorry there is an error!')}
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Checkbox component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Checkbox
                        labelName="Music"
                        inputId="testCheckBox1"
                        inputValue={false}
                        isDisabled={true}
                        testId="testCheckbox"
                    />

                    <Checkbox
                        labelName="Dance"
                        inputId="testCheckBox2"
                        inputValue={false}
                        testId="testCheckbox"
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div><span>Datepicker component</span></div>
            {/snippet}

            {#snippet bodySnippet()}
                <div class="grid grid-flow-row grid-cols-6 gap-10">
                    <Datepicker bind:isOpen bind:selectedDate>
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="Basic"
                                bind:inputValue={formattedSelectedDate}
                                on:onInputChanges={() =>
                                    (selectedDate = new Date(formattedSelectedDate))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpen = !isOpen)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                    <Datepicker
                        bind:isOpen={isOpenShowYears}
                        bind:selectedDate={selectedDateWithYears}
                        showYears={true}
                        ariaLabelPreviousYear="Previous Year"
                        ariaLabelNextYear="Next Year"
                    >
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="With years"
                                bind:inputValue={formattedSelectedDateWithYears}
                                on:onInputChanges={() =>
                                    (selectedDateWithYears = new Date(
                                        formattedSelectedDateWithYears
                                    ))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpenShowYears = !isOpenShowYears)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                    <Datepicker
                        bind:isOpen={isOpenDE}
                        bind:selectedDate={selectedDateDE}
                        showYears={true}
                        ariaLabelPreviousYear="Previous Year"
                        ariaLabelNextYear="Next Year"
                        monthLabels={monthLabelsDE}
                        dowLabels={dowLabelsDE}
                    >
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="With culture [DE]"
                                bind:inputValue={formattedSelectedDateDE}
                                on:onInputChanges={() =>
                                    (selectedDateDE = new Date(formattedSelectedDateDE))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpenDE = !isOpenDE)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                    <Datepicker
                        bind:isOpen={isOpenAlways}
                        bind:selectedDate={selectedDateAlways}
                        showYears={true}
                        ariaLabelPreviousYear="Previous Year"
                        ariaLabelNextYear="Next Year"
                        alwaysShow={true}
                    >
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="Always shown"
                                bind:inputValue={formattedSelectedDateAlways}
                                on:onInputChanges={() =>
                                    (selectedDateAlways = new Date(formattedSelectedDateAlways))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpenAlways = !isOpenAlways)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                    <Datepicker
                        bind:isOpen={isOpenDisable}
                        bind:selectedDate={selectedDateDisable}
                        showYears={true}
                        ariaLabelPreviousYear="Previous Year"
                        ariaLabelNextYear="Next Year"
                        disableDatesBefore={selectedDateAlways}
                    >
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="Disabled dates in past"
                                bind:inputValue={formattedSelectedDateDisable}
                                on:onInputChanges={() =>
                                    (selectedDateDisable = new Date(formattedSelectedDateDisable))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpenDisable = !isOpenDisable)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                    <Datepicker
                        bind:isOpen={isOpenEnable}
                        bind:selectedDate={selectedDateEnable}
                        showYears={true}
                        ariaLabelPreviousYear="Previous Year"
                        ariaLabelNextYear="Next Year"
                        alwaysShow={false}
                        align="right"
                        $:
                        enabledDates={[
                            formatDate(today, dateFormat), // today
                            formatDate(new Date(today.getTime() - MS_PER_DAY), dateFormat), // yesterday
                            formatDate(new Date(today.getTime() + MS_PER_DAY), dateFormat) // tomorrow
                        ]}
                    >
                        <div class="relative">
                            <Input
                                type="text"
                                showError={false}
                                labelName="Specific Dates Enabled"
                                bind:inputValue={formattedSelectedDateEnable}
                                on:onInputChanges={() =>
                                    (selectedDateEnable = new Date(formattedSelectedDateEnable))}
                            />
                            <div class="absolute top-9 right-1 z-10">
                                <Icon
                                    iconSVG={CALENDAR_SVG}
                                    label="Calendar"
                                    fill="#9a9a9a"
                                    width={17}
                                    height={17}
                                    clickLogic={() => (isOpenEnable = !isOpenEnable)}
                                    testId="date-picker-icon"
                                ></Icon>
                            </div>
                        </div>
                    </Datepicker>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div><span>Frame component</span></div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Frame>Test Frame</Frame>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div><span>Icon component</span></div>
            {/snippet}

            {#snippet bodySnippet()}
                <div class="gap-8">
                    <Icon
                        label="View"
                        iconSVG={EYE_SVG}
                        classes="cursor-pointer"
                        viewBox="0 0 580 512"
                        height={24}
                        width={24}
                        clickLogic={() => toast.info('Information')}
                    />
                    <Icon
                        label="Delete"
                        iconSVG={TRASH_SVG}
                        classes="cursor-pointer"
                        clickLogic={() => toast.success('Success')}
                        direction={Direction.Up}
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>InfiniteScroll component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <div class="max-h-48 overflow-auto mb-4">
                        <div class="flex items-center gap-4">
                            <Input
                                type={InputTypes.Number}
                                bind:inputValue={age}
                                classes="pt-4"
                                placeholder="Enter age"
                            />
                            <Button
                                label="Add"
                                buttonSize={Size.Small}
                                clickLogic={() => {
                                    infiniteScrollData.push(age);
                                    age++;
                                }}
                            />
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each infiniteScrollData as item}
                                    <tr>
                                        <td>{item}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        <InfiniteScroll
                            window={false}
                            hasMore={true}
                            threshold={100}
                            onLoadMore={() => {
                                infiniteScrollData = [...infiniteScrollData, 100, 200, 300, 400];
                            }}
                        />
                    </div>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>InlineEdit component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <div class="m-4 grid grid-flow-row grid-cols-3 gap-10">
                        <InlineEdit
                            bind:value={InlineEditValue}
                            required={true}
                            onInput={() => {
                                console.log('Input');
                            }}
                            onInputChange={() => {
                                console.log('InputChange');
                            }}
                            onRestore={() => {
                                alert('Restore');
                            }}
                            onSubmit={() => {
                                alert('Submit');
                            }}
                        />
                        <InlineEdit
                            bind:value={inlineEditValueDisabled}
                            required={false}
                            disabled={true}
                            canSubmit={false}
                            onInput={() => {
                                console.log('Input');
                            }}
                            onInputChange={() => {
                                console.log('InputChange');
                            }}
                            onRestore={() => {
                                alert('Restore');
                            }}
                            onSubmit={() => {
                                alert('Submit');
                            }}
                        />
                    </div>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Input component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Input
                        classes="w-full"
                        labelName="First name"
                        inputName="first name"
                        placeholder="Max"
                        testId="first-name-input"
                    />

                    <Input
                        labelName="Last name"
                        inputName="last name"
                        resizableTextarea={false}
                        placeholder="Mustermann"
                        testId="last-name-input"
                    />

                    <Input
                        labelName="Address"
                        inputName="address"
                        inputValue="Ericsson-Allee 1 52134 Herzogenrath Germany"
                        textareaInput={true}
                        isDisabled={true}
                        testId="address-input"
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Loading component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Loading />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Modal component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Button
                        label="Show Modal"
                        isDisabled={false}
                        type={ButtonType.OutlinePrimary}
                        clickLogic={() => {
                            showModal = true;
                        }}
                        testId="show-modal-button"
                    ></Button>

                    <Modal
                        bind:open={showModal}
                        title="Modal window's title"
                        onClose={() => {
                            console.info('Modal onClose');
                        }}
                        position={Position.Center}
                    >
                        {#snippet footerSnippet()}
                            <Button
                                label="Cancel"
                                isDisabled={false}
                                type={ButtonType.OutlinePrimary}
                                clickLogic={() => {
                                    console.info('Modal Cancel clicked');
                                    showModal = false;
                                }}
                                testId="cancel-button"
                            ></Button>

                            <Button
                                label="Apply Authorization"
                                additionalClasses="min-w-[10rem]"
                                isDisabled={false}
                                clickLogic={() => {
                                    console.info('Modal Apply Authorization clicked');
                                    showModal = false;
                                }}
                                testId="apply-authorization-button"
                            ></Button>
                        {/snippet}

                        <AccordionItem>
                            {#snippet buttonSnippet()}
                                <div>
                                    <span>RadioInput component</span>
                                </div>
                            {/snippet}

                            {#snippet bodySnippet()}
                                <div>
                                    <RadioInput
                                        labelText="Do you agree?"
                                        inputName="test radio button"
                                        options={[
                                            { name: 'Yes', value: true },
                                            { name: 'No', value: false }
                                        ]}
                                        selectedOption="false"
                                        testId="test-radio-button"
                                        onOptionSelected={(option) => {
                                            // handle option selection here
                                            console.log('Selected option:', option);
                                        }}
                                    />
                                </div>
                            {/snippet}
                        </AccordionItem>

                        <AccordionItem>
                            {#snippet buttonSnippet()}
                                <div>
                                    <span>Tabs component</span>
                                </div>
                            {/snippet}

                            {#snippet bodySnippet()}
                                <div>
                                    <Tabs {tabs} />
                                </div>
                            {/snippet}
                        </AccordionItem>

                        <AccordionItem>
                            {#snippet buttonSnippet()}
                                <div>
                                    <span>Toast component</span>
                                </div>
                            {/snippet}

                            {#snippet bodySnippet()}
                                <div>
                                    <Icon
                                        label="Warning"
                                        iconSVG={TRIANGLE_SVG}
                                        viewBox="0 0 580 512"
                                        height={24}
                                        width={24}
                                        clickLogic={() => toast.warning('Attention please')}
                                    />
                                    <Icon
                                        label="View"
                                        iconSVG={EYE_SVG}
                                        viewBox="0 0 580 512"
                                        height={24}
                                        width={24}
                                        clickLogic={() => toast.success('Yuppi viewed')}
                                    />
                                    <Icon
                                        label="Failure"
                                        iconSVG={CIRCLE_X_SVG}
                                        viewBox="0 0 580 512"
                                        height={24}
                                        width={24}
                                        clickLogic={() => toast.failure('Sorry failed!')}
                                    />
                                    <Icon
                                        label="Info"
                                        iconSVG={INFO_SVG}
                                        viewBox="0 0 580 512"
                                        height={24}
                                        width={24}
                                        clickLogic={() => toast.info('For your information')}
                                    />
                                </div>
                            {/snippet}
                        </AccordionItem>

                        <AccordionItem>
                            {#snippet buttonSnippet()}
                                <div>
                                    <span>Input component</span>
                                </div>
                            {/snippet}

                            {#snippet bodySnippet()}
                                <Input
                                    placeholder="My placeholder"
                                    inputName="searchInput"
                                    inputValue="Some comment"
                                    type="text"
                                    isDisabled={false}
                                />
                            {/snippet}
                        </AccordionItem>
                    </Modal>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Pagination component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <div class="mb-4">
                        {#if paginationValues}
                            {#each paginationValues as value}
                                <p>
                                    {value}
                                </p>
                            {/each}
                        {/if}
                    </div>
                    <Pagination
                        rows={[
                            'john.doe@example.com',
                            'jane.smith@example.com',
                            'robert.johnson@example.com',
                            'michael.williams@example.com',
                            'sarah.brown@example.com',
                            'emma.davis@example.com',
                            'emily.miller@example.com',
                            'jessica.wilson@example.com',
                            'daniel.moore@example.com',
                            'james.taylor@example.com',
                            'jennifer.thomas@example.com',
                            'mason.jackson@example.com',
                            'lucas.white@example.com',
                            'ava.harris@example.com',
                            'liam.martin@example.com',
                            'sophia.thompson@example.com',
                            'jacob.garcia@example.com',
                            'mia.martinez@example.com'
                        ]}
                        perPage={3}
                        bind:trimmedRows={paginationValues}
                    />
                </div>
            {/snippet}
        </AccordionItem>
        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>ProgressBar</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div class="container app-progressbar">
                    <div
                        style="--pg-app-width: 50%; --pg-value-bg-color: #ffcc00; --pg-badge-bg-color:  #ffcc00; --pg-bar-bg-color:  #B2B2B2"
                    >
                        <ProgressBar progressValue={70} />
                    </div>

                    <ProgressBar bind:progressValue={progress} />
                    <Button label="increase 100%" clickLogic={() => (progress = 180)} />
                </div>
            {/snippet}
        </AccordionItem>
        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Popover component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Icon
                        label="Info"
                        iconSVG={INFO_SVG}
                        viewBox="0 0 512 512"
                        classes="info-icon cursor-pointer"
                    />
                    <Popover
                        activeContent
                        border
                        shadow
                        rounded
                        triggeredBy=".info-icon"
                        classes="w-72 z-20"
                        onShow={() => {
                            console.log('PopOver icon show');
                        }}
                    >
                        <div class="p-3">
                            <div class="flex justify-between items-center">
                                <h2 class="text-md">User Details</h2>
                            </div>
                            <div class="mt-4">
                                <div class="flex">
                                    <div class="w-[40%]">First name:</div>
                                    <div>Mehtap</div>
                                </div>
                            </div>
                            <div class="mt-2">
                                <div class="flex">
                                    <div class="w-[40%]">Last name:</div>
                                    <div>CAVDAR</div>
                                </div>
                            </div>
                        </div>
                    </Popover>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>RadioInput component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <RadioInput
                        labelText="Do you agree?"
                        inputName="test radio button"
                        options={[
                            { name: 'Yes', value: true },
                            { name: 'No', value: false }
                        ]}
                        selectedOption="false"
                        testId="test-radio-button"
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Select component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Select
                        classes="w-1/2"
                        labelName="City"
                        isDisabled={false}
                        options={cities}
                        placeholder="Select an option"
                        testId="nameInput"
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Tabs component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Tabs {tabs} />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Toast component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Icon
                        label="Warning"
                        iconSVG={TRIANGLE_SVG}
                        viewBox="0 0 580 512"
                        height={24}
                        width={24}
                        clickLogic={() => toast.warning('Attention please')}
                    />
                    <Icon
                        label="View"
                        iconSVG={EYE_SVG}
                        viewBox="0 0 580 512"
                        height={24}
                        width={24}
                        clickLogic={() => toast.success('Yuppi viewed')}
                    />
                    <Icon
                        label="Failure"
                        iconSVG={CIRCLE_X_SVG}
                        viewBox="0 0 580 512"
                        height={24}
                        width={24}
                        clickLogic={() => toast.failure('Sorry failed!')}
                    />
                    <Icon
                        label="Info"
                        iconSVG={INFO_SVG}
                        viewBox="0 0 580 512"
                        height={24}
                        width={24}
                        clickLogic={() => toast.info('For your information')}
                    />
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>Tooltip component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <Tooltip content="Add" position="bottom" align="center" animation="fly">
                        <Icon
                            label="Add"
                            classes="cursor-pointer"
                            clickLogic={() => toast.success('Added')}
                            iconSVG={PLUS_CIRCLE_SVG}
                            width={24}
                            height={24}
                            direction={Direction.Down}
                            testId="add-icon"
                        />
                    </Tooltip>

                    <Tooltip content="Remove" position="right" align="center" animation="slide">
                        <Icon
                            label="Remove"
                            classes="cursor-pointer"
                            clickLogic={() => toast.warning('Removed')}
                            iconSVG={MINUS_CIRCLE_SVG}
                            width={24}
                            height={24}
                            testId="remove-icon"
                        />
                    </Tooltip>
                </div>
            {/snippet}
        </AccordionItem>

        <AccordionItem>
            {#snippet buttonSnippet()}
                <div>
                    <span>UserProfileMenu component</span>
                </div>
            {/snippet}

            {#snippet bodySnippet()}
                <div>
                    <UserProfileMenu
                        classesForDropdownButton="gap-2"
                        dropdownLabel="example.sample@muster.org"
                        func={() => toast.success('Logged Out Successfully')}
                        options={[
                            {
                                link: '/#',
                                label: 'Lorem Ipsum'
                            },
                            {
                                link: '/#',
                                label: 'Lorem Ipsum'
                            },
                            {
                                link: '/#',
                                label: 'Lorem Ipsum'
                            }
                        ]}
                        funcLabel="Sign Out"
                    />
                </div>
            {/snippet}
        </AccordionItem>
    </div>
</main>