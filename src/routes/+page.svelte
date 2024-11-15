<script lang="ts">
    // SQIgnore
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
    import Pagination from '$lib/components/Pagination.svelte';
    import Popover from '$lib/components/Popover.svelte';
    import RadioInput from '$lib/components/RadioInput.svelte';
    import Select from '$lib/components/Select.svelte';
    import Tabs from '$lib/components/Tabs.svelte';
    import SvelteToast from '$lib/components/Toast/SvelteToast.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import UserProfileMenu from '$lib/components/UserProfileMenu.svelte';
    import { formatDate } from '$lib/utils/date';
    import InlineEdit from '$lib/components/InlineEdit.svelte';

    const PLUS_CIRCLE_SVG =
        'M384 250v12c0 6.6-5.4 12-12 12h-98v98c0 6.6-5.4 12-12 12h-12c-6.6 0-12-5.4-12-12v-98h-98c-6.6 0-12-5.4-12-12v-12c0-6.6 5.4-12 12-12h98v-98c0-6.6 5.4-12 12-12h12c6.6 0 12 5.4 12 12v98h98c6.6 0 12 5.4 12 12zm120 6c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-32 0c0-119.9-97.3-216-216-216-119.9 0-216 97.3-216 216 0 119.9 97.3 216 216 216 119.9 0 216-97.3 216-216z';

    let values: any;
    let age = '18';

    $: listAge = +age;

    let items = [
        { label: 'Applications', value: 1, component: Frame },
        { label: 'Header', value: 2, component: Frame },
        { label: 'Tab 3', value: 3, component: Frame }
    ];

    let infiniteScrollItems = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    let filteredItems = infiniteScrollItems.splice(0, 4);

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

    let monthLabelsGE = [
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

    let dowLabelsGE = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'];

    let selectedDate: Date | string = '1988-06-20';
    let selectedDateWithYears = new Date('2022-01-15');
    let selectedDateGE = new Date();
    let selectedDateAlways = new Date();
    let selectedDateDisable = new Date();
    let selectedDateEnable = new Date();
    let dateFormat = 'MM/dd/yy';
    let dateFormatGE = 'yyyy-MM-dd';
    let isOpen = false;
    let isOpenShowYears = false;
    let isOpenGE = false;
    let isOpenAlways = false;
    let isOpenDisable = false;
    let isOpenEnable = false;

    let formattedSelectedDate = formatDate(selectedDate, dateFormat);
    let formattedSelectedDateWithYears = formatDate(selectedDateWithYears, dateFormat);
    let formattedSelectedDateGE = formatDate(selectedDateGE, dateFormatGE);
    let formattedSelectedDateAlways = formatDate(selectedDateAlways, dateFormat);
    let formattedSelectedDateDisable = formatDate(selectedDateDisable, dateFormat);
    let formattedSelectedDateEnable = formatDate(selectedDateEnable, dateFormat);

    $: {
        formattedSelectedDate = formatDate(selectedDate, dateFormat);
        formattedSelectedDateWithYears = formatDate(selectedDateWithYears, dateFormat);
        formattedSelectedDateGE = formatDate(selectedDateGE, dateFormatGE);
        formattedSelectedDateAlways = formatDate(selectedDateAlways, dateFormat);
        formattedSelectedDateDisable = formatDate(selectedDateDisable, dateFormat);
        formattedSelectedDateEnable = formatDate(selectedDateEnable, dateFormat);
    }

    let InlineEditValue = 'Max Musterman';
    let inlineEditValueDisabled = 'George Costanza';
</script>

<main aria-label="Svelvunity main content">
    <div class="p-4">
        <h1 class="pt-2 pb-4 text-[#4f0230]">Svelvunity</h1>

        <SvelteToast />

        <AccordionItem>
            <div slot="button"><span>Accordion component</span></div>
            <div slot="body">
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each { length: 3 } as _, i}
                    <AccordionItem
                        disabled={i !== 1 ? true : false}
                        showBody={i !== 2 ? true : false}
                        fillEmptyChevronSpace={true}
                    >
                        <div slot="button">Click me! {i}</div>
                        <div slot="body">You've clicked on the button! {i}</div>
                    </AccordionItem>
                {/each}
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Button component</span></div>
            <div slot="body" class="gap-4 items-center">
                <Button label={'Warning'} clickLogic={() => toast.warning('Attention please')} />
                <Button
                    label={'Success'}
                    type={ButtonType.OutlinePrimary}
                    buttonSize={Size.Small}
                    clickLogic={() => toast.success('Yuppi successful')}
                />

                <Button
                    label={'Failure'}
                    additionalClasses="text-white"
                    buttonSize={Size.Large}
                    clickLogic={() => toast.failure('Sorry failed!')}
                />

                <Button
                    label={'Info'}
                    type={ButtonType.OutlinePrimary}
                    buttonSize={Size.XLarge}
                    clickLogic={() => toast.info('For your information')}
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Checkbox component</span></div>
            <div slot="body">
                <Checkbox
                    labelName={'Music'}
                    inputId="testCheckBox"
                    inputValue={false}
                    isDisabled={true}
                    testId="testCheckbox"
                />

                <Checkbox
                    labelName={'Dance'}
                    inputId="testCheckBox"
                    inputValue={false}
                    testId="testCheckbox"
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Datepicker component</span></div>
            <div slot="body" class="grid grid-flow-row grid-cols-6 gap-10">
                <Datepicker bind:isOpen bind:selectedDate>
                    <div class="relative">
                        <Input
                            type="text"
                            showError={false}
                            labelName={'Basic'}
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
                            labelName={'With years'}
                            bind:inputValue={formattedSelectedDateWithYears}
                            on:onInputChanges={() =>
                                (selectedDateWithYears = new Date(formattedSelectedDateWithYears))}
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
                    bind:isOpen={isOpenGE}
                    bind:selectedDate={selectedDateGE}
                    showYears={true}
                    ariaLabelPreviousYear="Previous Year"
                    ariaLabelNextYear="Next Year"
                    monthLabels={monthLabelsGE}
                    dowLabels={dowLabelsGE}
                >
                    <div class="relative">
                        <Input
                            type="text"
                            showError={false}
                            labelName={'GE format'}
                            bind:inputValue={formattedSelectedDateGE}
                            on:onInputChanges={() =>
                                (selectedDateGE = new Date(formattedSelectedDateGE))}
                        />
                        <div class="absolute top-9 right-1 z-10">
                            <Icon
                                iconSVG={CALENDAR_SVG}
                                label="Calendar"
                                fill="#9a9a9a"
                                width={17}
                                height={17}
                                clickLogic={() => (isOpenGE = !isOpenGE)}
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
                            labelName={'Always show'}
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
                            labelName={'Disable dates'}
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
                    alwaysShow={true}
                    align="right"
                    enabledDates={[
                        '2024-06-24',
                        '2024-06-25',
                        '2024-06-26',
                        '2024-06-27',
                        '2024-06-28'
                    ]}
                >
                    <div class="relative">
                        <Input
                            type="text"
                            showError={false}
                            labelName={'Enable dates'}
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
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Frame component</span></div>
            <div slot="body">
                <Frame>Test Frame</Frame>
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Icon component</span></div>
            <div slot="body" class="gap-8">
                <Icon
                    label="View"
                    iconSVG={EYE_SVG}
                    classes={'cursor-pointer'}
                    viewBox="0 0 580 512"
                    height={24}
                    width={24}
                    clickLogic={() => toast.warning('Warning')}
                />
                <Icon
                    label="Delete"
                    iconSVG={TRASH_SVG}
                    classes={'cursor-pointer'}
                    clickLogic={() => toast.success('Deleted')}
                    direction={Direction.Up}
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>InfiniteScroll component</span></div>
            <div slot="body">
                <div class="max-h-48 overflow-auto mb-4">
                    <div class="flex items-center gap-4">
                        <Input
                            type={InputTypes.Number}
                            bind:inputValue={age}
                            classes="pt-4"
                            placeholder="Enter age"
                        />
                        <Button
                            label={'Add'}
                            buttonSize={Size.Small}
                            clickLogic={() => {
                                filteredItems = [listAge, ...filteredItems];
                            }}
                        />
                    </div>
                    <table>
                        <tr>
                            <th>Age</th>
                        </tr>

                        {#each filteredItems as item}
                            <tr> <td>{item}</td></tr>
                        {/each}
                    </table>
                    <InfiniteScroll
                        window={false}
                        hasMore={filteredItems.length < infiniteScrollItems.length}
                        threshold={100}
                        on:loadMore={() => {
                            filteredItems = [...filteredItems, ...infiniteScrollItems.splice(4)];
                        }}
                    />
                </div>
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>InlineEdit component</span></div>
            <div slot="body">
                <div class="m-4 grid grid-flow-row grid-cols-3 gap-10">
                    <InlineEdit
                        bind:value={InlineEditValue}
                        required={true}
                        on:Input={() => {
                            console.log('Input');
                        }}
                        on:InputChanges={() => {
                            console.log('InputChanges');
                        }}
                        on:Restore={() => {
                            alert('Restore');
                        }}
                        on:Submit={() => {
                            alert('Submit');
                        }}
                    />
                    <InlineEdit
                        bind:value={inlineEditValueDisabled}
                        required={false}
                        disabled={true}
                        canSubmit={false}
                        on:Input={() => {
                            console.log('Input');
                        }}
                        on:InputChanges={() => {
                            console.log('InputChanges');
                        }}
                        on:Restore={() => {
                            alert('Restore');
                        }}
                        on:Submit={() => {
                            alert('Submit');
                        }}
                    />
                </div>
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Input component</span></div>
            <div slot="body">
                <Input
                    classes="w-full"
                    labelName={'First name'}
                    inputName={'first name'}
                    placeholder={'Max'}
                    testId="first-name-input"
                />

                <Input
                    labelName={'Last name'}
                    inputName={'last name'}
                    resizableTextarea={false}
                    placeholder={'Mustermann'}
                    testId="last-name-input"
                />

                <Input
                    labelName={'Address'}
                    inputName={'address'}
                    inputValue="Ericsson-Allee 1 52134 Herzogenrath Germany"
                    textareaInput={true}
                    isDisabled={true}
                    testId="address-input"
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Loading component</span></div>
            <div slot="body">
                <Loading />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Pagination component</span></div>
            <div slot="body">
                <div class="mb-4">
                    {#if values}
                        {#each values as value}
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
                    bind:trimmedRows={values}
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Popover component</span></div>
            <div slot="body">
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
                    class="w-72 z-20"
                    on:show
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
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>RadioInput component</span></div>
            <div slot="body">
                <RadioInput
                    labelText={'Do you agree?'}
                    inputName="test radio button"
                    options={[
                        { name: 'Yes', value: true },
                        { name: 'No', value: false }
                    ]}
                    selectedOption="false"
                    testId="test-radio-button"
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Select component</span></div>
            <div slot="body">
                <Select
                    classes="w-1/2"
                    labelName={'City'}
                    options={cities}
                    placeholder={'Select an option'}
                    testId={'nameInput'}
                />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Tabs component</span></div>
            <div slot="body">
                <Tabs {items} />
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Toast component</span></div>
            <div slot="body">
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
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>Tooltip component</span></div>
            <div slot="body">
                <Tooltip content={'Add'} position="bottom" align="center" animation="fly">
                    <Icon
                        label="Add"
                        classes={'cursor-pointer'}
                        clickLogic={() => toast.success('Added')}
                        iconSVG={PLUS_CIRCLE_SVG}
                        width={24}
                        height={24}
                        direction={Direction.Down}
                        testId="add-icon"
                    />
                </Tooltip>

                <Tooltip content={'Remove'} position="right" align="center" animation="slide">
                    <Icon
                        label="Remove"
                        classes={'cursor-pointer'}
                        clickLogic={() => toast.success('Removed')}
                        iconSVG={MINUS_CIRCLE_SVG}
                        width={24}
                        height={24}
                        testId="remove-icon"
                    />
                </Tooltip>
            </div>
        </AccordionItem>

        <AccordionItem>
            <div slot="button"><span>UserProfileMenu component</span></div>
            <div slot="body">
                <UserProfileMenu
                    classesForDropdownButton={'gap-2'}
                    dropdownLabel={'example.sample@muster.org'}
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
        </AccordionItem>
    </div>
</main>
