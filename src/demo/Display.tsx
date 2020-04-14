import React, { useState, useLayoutEffect, useCallback, useRef, ChangeEvent } from "react";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, getDayOfWeek, compareDaysMonthsAndYears } from "../CalendarUtils";
import { CalendarDisplay, DateData } from "../DatepickerContext";
import DatepickerInput from "../DatepickerInput";
import { makeDatepickerTheme, resetTheme, DatepickerThemeStrings, makeDatepickerThemeArrayFromStrings } from "../theming";
import Datepicker from "../Datepicker";

// TODO: Refactor {() => } to close over functions
// {foo(input)} is foo = input => { return event => {action(input)}}
function Display() {
    const INPUT_CLASS_FILLED = 'filled';

    // Datepicker Options ===================================================
    const [_selectedDate, _setSelectedDate] = useState(null as Date | null);

    const dummyDate = new Date();
    const [_startAt, _setStartAt] = useState(new Date(dummyDate.setDate(dummyDate.getDate() - 1)));
    const [_startView, _setStartView] = useState('month' as VIEW);
    const [_firstDayOfWeek, _setFirstDayOfWeek] = useState(0 as 0 | 1 | 2 | 3 | 4 | 5 | 6);

    const [_minDate, _setMinDate] = useState(null as Date | null);
    const [_maxDate, _setMaxDate] = useState(null as Date | null);

    let _dateFilter = (date: Date | null) => {
        if (!date) return false;
        const dayNumber = getDayOfWeek(date);
        switch (_dateFilterType) {
            case 'none':
                return false;
            case 'only weekends':
                return dayNumber === 0 || dayNumber === 6;
            case 'only weekdays':
                return dayNumber !== 0 && dayNumber !== 6;
            default:
                return true;
        }
    };
    const [_dateFilterType, _setDateFilterType] = useState('only weekdays' as 'none' | 'only weekends' | 'only weekdays' | 'all');

    const [_rangeMode, _setRangeMode] = useState(true);
    const [_beginDate, _setBeginDate] = useState(null as Date | null);
    const [_endDate, _setEndDate] = useState(null as Date | null);

    const [_disableMonth, _setDisableMonth] = useState(false);
    const [_disableYear, _setDisableYear] = useState(false);
    const [_disableMultiyear, _setDisableMultiyear] = useState(false);

    const [_disable, _setDisable] = useState(false);
    const [_disableCalendar, _setDisableCalendar] = useState(false);
    const [_disableInput, _setDisableInput] = useState(false);
    const [_calendarOpenDisplay, _setCalendarOpenDisplay] = useState('popup' as CalendarDisplay);
    const [_canCloseCalendar, _setCanCloseCalendar] = useState(true);
    const [_closeAfterSelection, _setCloseAfterSelection] = useState(true);
    // const [_open, _setOpen ] = useState(false);

    const [_calendarLabel, _setCalendarLabel] = useState('Calendar');
    const [_openCalendarLabel, _setOpenCalendarLabel] = useState('Open calendar');

    const [_nextMonthLabel, _setNextMonthLabel] = useState('Next month');
    const [_nextYearLabel, _setNextYearLabel] = useState('Next year');
    const [_nextMultiyearLabel, _setNextMultiyearLabel] = useState('Next years');

    const [_prevMonthLabel, _setPrevMonthLabel] = useState('Previous month');
    const [_prevMultiyearLabel, _setPrevMultiyearLabel] = useState('Previous years');
    const [_prevYearLabel, _setPrevYearLabel] = useState('Previous year');

    const [_switchToMonthViewLabel, _setSwitchToMonthViewLabel] = useState('Switch to month view');
    const [_switchToYearViewLabel, _setSwitchToYearViewLabel] = useState('Switch to year view');
    const [_switchToMultiyearViewLabel, _setSwitchToMultiyearViewLabel] = useState('Switch to multi-year view');

    const [_singleInputLabel, _setSingleInputLabel] = useState("Choose a date");
    const [_beginInputLabel, _setBeginInputLabel] = useState("Choose a start date");
    const [_endInputLabel, _setEndInputLabel] = useState("end date");

    const [_changeThemeGlobal, _setChangeThemeGlobal] = useState(true);

    type THEMES = 'salmon' | 'blue' | 'green';
    const _salmonTheme = ({});
    const _greenTheme = makeDatepickerTheme({
        "--color": "rgb(152, 232, 139)",
        "--on-color": "rgb(0,0,0)",
        "--background": "white",
        "--on-neutral": "black",
        "--hover": "rgba(255,200,240, .4)",
        "--hover-range": "rgba(240,240, 100, .25)",
        "--button-border": "var(--hover)",
        "--button-background": "rgba(255,200,240, .2)"
    });
    const _blueTheme = (makeDatepickerTheme({
        "--color": "hsl(186, 90%, 61%)",
        "--background": "rgb(27, 46, 48)",
        "--on-background": "rgb(215,245,255)",
        "--neutral-dark": "#aaa"
    }));

    const [_themeColor, _setThemeColor] = useState('blue' as THEMES);

    const getTheme = (theme: THEMES) => {
        switch (theme) {
            case 'blue':
                return _blueTheme;
            case 'green':
                return _greenTheme;
            default:
                return _salmonTheme;
        }
    }

    const _onFinalDateChange = (d: DateData) => {
        console.log("received final date from calendar");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onDateChange = (d: DateData) => {
        console.log("date change");
        // _setBeginDate(d.beginDate);
        // _setEndDate(d.endDate);
        // _setSelectedDate(d.selectedDate);
    }
    const _onCalendarDateChange = (d: DateData) => {
        // console.log("date change in calendar:");
    }
    const _onInputDateChange = (d: DateData) => {
        // console.log("date change in input:");
    }
    const _onDaySelected = (d: DateData) => {
        // console.log("day selected in month view");
    }
    const _onMonthSelected = (d: DateData) => {
        // console.log("month selected in year view");
    }
    const _onYearSelected = (d: DateData) => {
        // console.log("year selected in multiyear view");
    }

    const _formatMonthLabel = (date: Date) => {
        return getMonthNames('short')[getMonth(date)].toLocaleUpperCase() + ' ' + getYear(date);
    }
    const _formatMonthText = (date: Date) => {
        return getMonthNames('short')[getMonth(date)].toLocaleUpperCase();
    }

    const _formatYearLabel = (date: Date) => {
        return date.getFullYear().toString();
    }
    const _formatYearText = (date: Date) => {
        return date.getFullYear().toString();
    }

    const _formatMultiyearLabel = (date: Date, minYearOfPage?: number) => {
        if (minYearOfPage) {
            const maxYearOfPage = minYearOfPage + YEARS_PER_PAGE - 1;
            return `${minYearOfPage} \u2013 ${maxYearOfPage}`;
        }
        return 'Years'
    }
    const _formatMultiyearText = (date: Date) => {
        return '';
    }

    const _parseStringToDate = (input: string) => {
        return parseStringAsDate(input);
    }
    const _displayDateAsString = (date: Date) => {
        return formatDateDisplay(date);
    }

    const _toggleDisable = () => {
        const disable = !_disable;
        // if (disable) {
        //     _setDisableCalendar(disable);
        //     _setDisableInput(disable);
        // } else {
        //     // if (_disableCalendar && _disableInput) {
        //     //     _setDisableCalendar(disable);
        //     //     _setDisableInput(disable);
        //     // }
        // }
        _setDisable(disable);
    }
    const _getDisable = () => {
        return _disable;
        // return _disable || (_disableCalendar && _disableInput);
    }
    const _getDisableCalendar = () => {
        // return _disable || _disableCalendar;
        return _disableCalendar;
        // const disable = !_disableCalendar;
        // if (disable && _disableInput) {
        //     _setDisable(disable);
        // }
        // _setDisableCalendar(disable);
    }
    const _getDisableInput = () => {
        // return _disable || _disableInput;
        return _disableInput;
        // const disable = !_disableInput;
        // if (disable && _disableCalendar) {
        //     _setDisable(disable);
        // }
        // _setDisableInput(disable);
    }
    const _setStartingView = (view: VIEW) => {
        console.log("received click from: " + view);
        _setStartView(view);
    }

    // Native Input =========================================================
    const [_calendarOpen, _setCalendarOpen] = useState(_canCloseCalendar ? false : true);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    const timer = useRef(null as NodeJS.Timeout | null);

    /** Update first text input display with selected date changes. */
    useLayoutEffect(() => {
        if (!_rangeMode) {
            _setBeginInput(_selectedDate ? _displayDateAsString(_selectedDate) : '');
        }
    }, [_selectedDate, _rangeMode]);
    /** Update first text input display with begin date changes. */
    useLayoutEffect(() => {
        if (_rangeMode) {
            _setBeginInput(_beginDate ? _displayDateAsString(_beginDate) : '');
        }
    }, [_beginDate, _rangeMode]);
    /** Update second text input display with end date changes. */
    useLayoutEffect(() => {
        if (_rangeMode) {
            _setEndInput(_endDate ? _displayDateAsString(_endDate) : '');
        }
    }, [_endDate, _rangeMode]);

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : '');
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setEndInput((event.target.value.length > 0) ? event.target.value : '');
    }

    /** On blur, format first text input and set selected and begin dates. */
    const _onBlurBeginInput = () => {
        if (_beginInput !== '') {
            const date = _parseStringToDate(_beginInput);
            if (date != null) {
                if (_selectedDate == null || compareDaysMonthsAndYears(_selectedDate, date) !== 0) {
                    _setSelectedDate(date);
                }

                if (_rangeMode) {
                    const prevEndDate = _endDate;
                    if (prevEndDate != null && compareDaysMonthsAndYears(prevEndDate, date) < 0) {
                        // new date is after the existing end date, so switch them
                        _setBeginDate(prevEndDate);
                        _setEndDate(date);
                    } else if (_beginDate == null || compareDaysMonthsAndYears(_beginDate, date) !== 0) {
                        _setBeginDate(date);
                    }
                }
            } else {
                // Input entered is not a valid date
                _setBeginInput(_rangeMode
                    ? _beginDate ? _displayDateAsString(_beginDate) : ''
                    : _selectedDate ? _displayDateAsString(_selectedDate) : '');
            }
        } else {
            // No input was entered
            _setSelectedDate(null);
            if (_rangeMode) {
                _setBeginDate(null);
            }
        }
    }

    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        if (_endInput !== '') {
            const date = _parseStringToDate(_endInput);
            if (date != null) {
                if (_selectedDate == null || compareDaysMonthsAndYears(_selectedDate, date) !== 0) {
                    _setSelectedDate(date);
                }
                if (_rangeMode) {
                    const prevBeginDate = _beginDate;
                    if (prevBeginDate && compareDaysMonthsAndYears(date, prevBeginDate) < 0) {
                        // If the input date is before the existing beginDate, it becomes the new beginDate
                        _setBeginDate(date);
                        // We switch previous beginDate for the endDate that the user overwrote
                        _setEndDate(prevBeginDate);
                    } else if (_endDate == null || compareDaysMonthsAndYears(_endDate, date) !== 0) {
                        // Else the input date is after existing begindate, or there is no beginDate, input becomes the new endDate
                        _setEndDate(date);
                    }
                }
            } else {
                // Input entered is not a valid date
                _setEndInput(_rangeMode
                    ? _endDate ? _displayDateAsString(_endDate) : ''
                    : _selectedDate ? _displayDateAsString(_selectedDate) : '');
            }
        } else {
            // No Input was entered
            _setEndDate(null);
        }
    }

    /** Close the calendar if clicked off. */
    const _handleNativeNonCalendarClick = () => {
        console.log("Handling non calendar click");
        // Deal with selected, begin, and end values.
        if (!_calendarOpen) {
            if (!_disable && !_disableCalendar) {
                _setCalendarOpen(true);
            }
        } else if (_canCloseCalendar) {
            _setCalendarOpen(false);
        }
    }

    /** Upon click off input and not on any children of the input, toggle the Calendar display closed. */
    const _onBlurAll = () => {
        // as blur event fires prior to new focus events, need to wait to see if a child has been focused.
        timer.current = setTimeout(() => {
            _handleNativeNonCalendarClick();
        }, 700);
        return () => timer.current ? clearTimeout(timer.current) : {};
    }

    /** If a child receives focus, do not close the calendar. */
    const _onFocusHandler = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }

    /** Handle keydown events when Fields div is in focus. */
    const _handleNativeKeyDownOverFields = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                _handleNativeNonCalendarClick();
            }
        }
    }
    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleNativeFinalDateSelectionFromCalendar = (data: DateData) => {
        console.log("received final date change from calendar.");

        _setSelectedDate(data.selectedDate);
        _setBeginDate(data.beginDate);
        _setEndDate(data.endDate);

        console.log(data);

        if (_closeAfterSelection && _canCloseCalendar) {
            _setCalendarOpen(false);
        }
    }
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        console.log("received date change from calendar.");
        console.log(data);
    }

    // Input Options ========================================================

    /** Handle keydown events when Fields div is in focus. */
    const _handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                return true;
            }
        }
        return false;
    }
    const _handleRangeModeKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (_handleKeyDown(event)) _setRangeMode(mode => !mode);
    }
    const _handleViewEnabledKeyDown = (event: React.KeyboardEvent<HTMLElement>, view: VIEW) => {
        if (_handleKeyDown(event)) {
            switch (view) {
                case 'month':
                    _setDisableMonth(disable => !disable);
                    break;
                case 'year':
                    _setDisableYear(disable => !disable);
                    break;
                case 'multiyear':
                    _setDisableMultiyear(disable => !disable);
            }
        }
    }
    const _handleDisableViewKeyDown = (event: React.KeyboardEvent<HTMLElement>, input: 'all' | 'calendar' | 'input') => {
        if (_handleKeyDown(event)) {
            switch (input) {
                case 'calendar':
                    _setDisableCalendar(disable => !disable);
                    break;
                case 'input':
                    _setDisableInput(disable => !disable);
                    break;
                case 'all':
                    _toggleDisable();
            }
        }
    }
    const _handleCanCloseCalendarKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (_handleKeyDown(event)) _setCanCloseCalendar(can => !can);
    }
    const _handleCloseAfterSelectionKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (_handleKeyDown(event)) _setCloseAfterSelection(can => !can);
    }

    const _handleChangeThemeGlobalKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (_handleKeyDown(event)) _setChangeThemeGlobal(can => !can);
    }

    const _applyTheme = useCallback((theme: THEMES) => {
        const root = document.getElementsByTagName('html')[0];
        root.style.cssText = makeDatepickerThemeArrayFromStrings(resetTheme(getTheme(theme))).join(';');
    }, [_themeColor]);

    useLayoutEffect(() => {
        if (_changeThemeGlobal) {
            _applyTheme(_themeColor);
        }
    }, [_themeColor, _changeThemeGlobal]);

    return (
        <div
            className="test">
            <div className="pickers">

                {/* Native Input ======================================================== */}
                {/* <div
                onBlur={() => _onBlurAll()}
                onFocus={_onFocusHandler}
            >
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => _handleNativeNonCalendarClick()}
                    onKeyDown={(e) => _handleNativeKeyDownOverFields(e)}
                >
                    <div>
                        <input
                            type="text"
                            disabled={_disable || _disableInput}
                            onChange={(e) => _handleBeginInputChange(e)}
                            onBlur={() => { _onBlurBeginInput() }}
                            value={_beginInput}
                            id="begin-input-date"
                        ></input>
                        <label
                            htmlFor="begin-input-date">
                            {_rangeMode ? _beginInputLabel : _singleInputLabel}
                        </label>
                    </div>
                    {
                        _rangeMode ?
                            <div>
                                <input type="text"
                                    disabled={_disable || _disableInput}
                                    onChange={(e) => _handleEndInputChange(e)}
                                    onBlur={() => _onBlurEndInput()}
                                    value={_endInput}
                                    id="end-input-date"
                                />
                                <label
                                    htmlFor="end-input-date">
                                    {_endInputLabel}
                                </label>
                            </div>
                            : ''
                    }
                </div>
                <Datepicker
                    selectedDate={_selectedDate}

                    onFinalDateChange={_handleNativeFinalDateSelectionFromCalendar}
                    onDateChange={_handleDateSelectionFromCalendar}
                    onDaySelected={_onDaySelected}
                    onMonthSelected={_onMonthSelected}
                    onYearSelected={_onYearSelected}

                    startAt={_startAt}
                    startView={_startView}
                    firstDayOfWeek={_firstDayOfWeek}

                    minDate={_minDate}
                    maxDate={_maxDate}
                    dateFilter={_dateFilter}

                    rangeMode={_rangeMode}
                    beginDate={_beginDate}
                    endDate={_endDate}

                    disableMonth={_disableMonth}
                    disableYear={_disableYear}
                    disableMultiyear={_disableMultiyear}

                    disable={_disable}
                    calendarOpenDisplay={_calendarOpenDisplay}
                    canCloseCalendar={_canCloseCalendar}
                    closeAfterSelection={_closeAfterSelection}
                    setCalendarOpen={_calendarOpen}

                    formatMonthLabel={_formatMonthLabel}
                    formatMonthText={_formatMonthText}

                    formatYearLabel={_formatYearLabel}
                    formatYearText={_formatYearText}

                    formatMultiyearLabel={_formatMultiyearLabel}
                    formatMultiyearText={_formatMultiyearText}

                    calendarLabel={_calendarLabel}
                    openCalendarLabel={_openCalendarLabel}

                    nextMonthLabel={_nextMonthLabel}
                    nextYearLabel={_nextYearLabel}
                    nextMultiyearLabel={_nextMultiyearLabel}

                    prevMonthLabel={_prevMonthLabel}
                    prevMultiyearLabel={_prevMultiyearLabel}
                    prevYearLabel={_prevYearLabel}

                    switchToMonthViewLabel={_switchToMonthViewLabel}
                    switchToYearViewLabel={_switchToYearViewLabel}
                    switchToMultiyearViewLabel={_switchToMultiyearViewLabel}

                    theme={getTheme(_themeColor)}
                ></Datepicker>
            </div> */}

                {/* Integrated Datepicker =============================================== */}
                {/* <DatepickerInput ></DatepickerInput> */}
                <DatepickerInput
                    selectedDate={_selectedDate}

                    onFinalDateChange={_onFinalDateChange}
                    onDateChange={_onDateChange}
                    onCalendarDateChange={_onCalendarDateChange}
                    onInputDateChange={_onInputDateChange}
                    onDaySelected={_onDaySelected}
                    onMonthSelected={_onMonthSelected}
                    onYearSelected={_onYearSelected}

                    startAt={_startAt}
                    startView={_startView}
                    firstDayOfWeek={_firstDayOfWeek}

                    minDate={_minDate}
                    maxDate={_maxDate}
                    dateFilter={_dateFilter}
                    dateFilterTestInputs={[new Date(2020, 3, 14), new Date(2020, 3, 19)]}

                    rangeMode={_rangeMode}
                    beginDate={_beginDate}
                    endDate={_endDate}

                    disableMonth={_disableMonth}
                    disableYear={_disableYear}
                    disableMultiyear={_disableMultiyear}

                    disable={_disable}
                    disableCalendar={_disableCalendar}
                    disableInput={_disableInput}
                    calendarOpenDisplay={_calendarOpenDisplay}
                    canCloseCalendar={_canCloseCalendar}
                    closeAfterSelection={_closeAfterSelection}
                    // setCalendarOpen={true}

                    formatMonthLabel={_formatMonthLabel}
                    formatMonthText={_formatMonthText}

                    formatYearLabel={_formatYearLabel}
                    formatYearText={_formatYearText}

                    formatMultiyearLabel={_formatMultiyearLabel}
                    formatMultiyearText={_formatMultiyearText}

                    calendarLabel={_calendarLabel}
                    openCalendarLabel={_openCalendarLabel}

                    nextMonthLabel={_nextMonthLabel}
                    nextYearLabel={_nextYearLabel}
                    nextMultiyearLabel={_nextMultiyearLabel}

                    prevMonthLabel={_prevMonthLabel}
                    prevMultiyearLabel={_prevMultiyearLabel}
                    prevYearLabel={_prevYearLabel}

                    switchToMonthViewLabel={_switchToMonthViewLabel}
                    switchToYearViewLabel={_switchToYearViewLabel}
                    switchToMultiyearViewLabel={_switchToMultiyearViewLabel}

                    singleInputLabel={_singleInputLabel}
                    beginInputLabel={_beginInputLabel}
                    endInputLabel={_endInputLabel}

                    parseStringToDate={_parseStringToDate}
                    displayDateAsString={_displayDateAsString}

                    theme={getTheme(_themeColor)}
                ></DatepickerInput>
            </div>
            <div className="selections">
                <div className="toggle" >
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onChange={() => _setRangeMode(mode => !mode)}
                        onKeyDown={_handleRangeModeKeyDown}
                        checked={_rangeMode} />
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </div>
                <div>Selected date: {_selectedDate ? formatDateDisplay(_selectedDate) : 'none selected'}</div>
                <div>Begin date: {_beginDate ? formatDateDisplay(_beginDate) : 'none selected'}</div>
                <div>End date: {_endDate ? formatDateDisplay(_endDate) : 'none selected'}</div>
            </div>
            <div className="filters">
                <div>Minimum date:
                <DatepickerInput
                        selectedDate={_minDate}

                        onFinalDateChange={(d) => _setMinDate(d.selectedDate)}
                        onDateChange={(d) => { }}
                        onCalendarDateChange={(d) => { }}
                        onInputDateChange={(d) => { }}
                        onDaySelected={_onDaySelected}
                        onMonthSelected={_onMonthSelected}
                        onYearSelected={_onYearSelected}

                        startAt={_startAt}
                        startView={_startView}
                        firstDayOfWeek={_firstDayOfWeek}

                        minDate={null}
                        maxDate={_maxDate}
                        dateFilter={() => true}

                        rangeMode={false}
                        beginDate={null}
                        endDate={null}

                        disableMonth={_disableMonth}
                        disableYear={_disableYear}
                        disableMultiyear={_disableMultiyear}

                        disable={_disable}
                        disableCalendar={_disableCalendar}
                        disableInput={_disableInput}
                        calendarOpenDisplay={'popup'}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}

                        formatMonthLabel={_formatMonthLabel}
                        formatMonthText={_formatMonthText}

                        formatYearLabel={_formatYearLabel}
                        formatYearText={_formatYearText}

                        formatMultiyearLabel={_formatMultiyearLabel}
                        formatMultiyearText={_formatMultiyearText}

                        calendarLabel={_calendarLabel}
                        openCalendarLabel={_openCalendarLabel}

                        nextMonthLabel={_nextMonthLabel}
                        nextYearLabel={_nextYearLabel}
                        nextMultiyearLabel={_nextMultiyearLabel}

                        prevMonthLabel={_prevMonthLabel}
                        prevMultiyearLabel={_prevMultiyearLabel}
                        prevYearLabel={_prevYearLabel}

                        switchToMonthViewLabel={_switchToMonthViewLabel}
                        switchToYearViewLabel={_switchToYearViewLabel}
                        switchToMultiyearViewLabel={_switchToMultiyearViewLabel}

                        singleInputLabel={_singleInputLabel}
                        beginInputLabel={_beginInputLabel}
                        endInputLabel={_endInputLabel}

                        parseStringToDate={_parseStringToDate}
                        displayDateAsString={_displayDateAsString}

                    // theme={getTheme(_themeColor)}
                    ></DatepickerInput>
                </div>

                <div>Maximum date:
                    <DatepickerInput
                        selectedDate={_maxDate}

                        onFinalDateChange={(d) => _setMaxDate(d.selectedDate)}

                        minDate={_minDate}
                        maxDate={null}

                        rangeMode={false}
                        beginDate={null}
                        endDate={null}

                        disableMonth={_disableMonth}
                        disableYear={_disableYear}
                        disableMultiyear={_disableMultiyear}

                        disable={_disable}
                        disableCalendar={_disableCalendar}
                        disableInput={_disableInput}
                        calendarOpenDisplay={'popup'}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}

                    // theme={getTheme(_themeColor)}
                    ></DatepickerInput>
                </div>
                <div>Date filter</div>
                <ul>
                    <li className="radio">
                        <input type="radio"
                            id="radio-date-filter-all"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('all')}
                            checked={_dateFilterType === 'all'} />
                        <label htmlFor="radio-date-filter-all">All</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-date-filter-weekends"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('only weekends')}
                            checked={_dateFilterType === 'only weekends'} />
                        <label htmlFor="radio-date-filter-weekends">Only weekends</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-date-filter-weekdays"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('only weekdays')}
                            checked={_dateFilterType === 'only weekdays'} />
                        <label htmlFor="radio-date-filter-weekdays">Only weekdays</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-date-filter-none"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('none')}
                            checked={_dateFilterType === 'none'} />
                        <label htmlFor="radio-date-filter-none">None</label>
                    </li>
                </ul>
            </div>
            <div className="views">
                <div>First Day of Week</div>
                <ul>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-0"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(0)}
                            checked={_firstDayOfWeek === 0} />
                        <label htmlFor="radio-weekday-0">Su</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-1"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(1)}
                            checked={_firstDayOfWeek === 1} />
                        <label htmlFor="radio-weekday-1">M</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-2"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(2)}
                            checked={_firstDayOfWeek === 2} />
                        <label htmlFor="radio-weekday-2">T</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-3"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(3)}
                            checked={_firstDayOfWeek === 3} />
                        <label htmlFor="radio-weekday-3">W</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-4"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(4)}
                            checked={_firstDayOfWeek === 4} />
                        <label htmlFor="radio-weekday-4">Th</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-5"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(5)}
                            checked={_firstDayOfWeek === 5} />
                        <label htmlFor="radio-weekday-5">F</label>
                    </li>
                    <li className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-6"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(6)}
                            checked={_firstDayOfWeek === 6} />
                        <label htmlFor="radio-weekday-6">S</label>
                    </li>
                </ul>
                <div>Start View:</div>
                <ul>
                    <li className="radio">
                        <input type="radio"
                            id="month-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('month') }}
                            onChange={() => _setStartingView('month')}
                            checked={_startView === 'month'}
                            disabled={_disableMonth} />
                        <label htmlFor="month-start-view-radio">Month</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="year-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('year') }}
                            onChange={() => _setStartingView('year')}
                            checked={_startView === 'year'}
                            disabled={_disableYear} />
                        <label htmlFor="year-start-view-radio">Year</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="multiyear-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('multiyear') }}
                            onChange={() => _setStartingView('multiyear')}
                            checked={_startView === 'multiyear'}
                            disabled={_disableMultiyear} />
                        <label htmlFor="multiyear-start-view-radio">Multiyear</label>
                    </li>
                </ul>
                <div>Enable Views:</div>
                <ul>
                    <li className="checkbox">
                        <input type="checkbox"
                            id="month-view-checkbox"
                            onChange={() => _setDisableMonth(disable => !disable)}
                            checked={!_disableMonth}
                            onKeyDown={(e) => _handleViewEnabledKeyDown(e, 'month')} />
                        <label htmlFor="month-view-checkbox">Month</label>
                    </li>
                    <li className="checkbox">
                        <input type="checkbox"
                            id="year-view-checkbox"
                            onChange={() => _setDisableYear(disable => !disable)}
                            checked={!_disableYear}
                            onKeyDown={(e) => _handleViewEnabledKeyDown(e, 'year')} />
                        <label htmlFor="year-view-checkbox">Year</label>
                    </li>
                    <li className="checkbox">
                        <input type="checkbox"
                            id="multiyear-view-checkbox"
                            onChange={() => _setDisableMultiyear(disable => !disable)}
                            checked={!_disableMultiyear}
                            onKeyDown={(e) => _handleViewEnabledKeyDown(e, 'multiyear')} />
                        <label htmlFor="multiyear-view-checkbox">Multiyear</label>
                    </li>
                </ul>
                <div>Enable Inputs:</div>
                <ul>
                    <li className="checkbox">
                        <input type="checkbox"
                            id="disable-all-checkbox"
                            onChange={_toggleDisable}
                            checked={_getDisable()}
                            onKeyDown={(e) => _handleDisableViewKeyDown(e, 'all')} />
                        <label htmlFor="disable-all-checkbox">Disable All</label>
                    </li>
                    <li className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-calendar-checkbox"
                            onChange={() => _setDisableCalendar(disable => !disable)}
                            checked={_getDisableCalendar()}
                            onKeyDown={(e) => _handleDisableViewKeyDown(e, 'calendar')} />
                        <label htmlFor="disable-calendar-checkbox">Disable Calendar</label>
                    </li>
                    <li className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-input-checkbox"
                            onChange={() => _setDisableInput(disable => !disable)}
                            checked={_getDisableInput()}
                            onKeyDown={(e) => _handleDisableViewKeyDown(e, 'input')} />
                        <label htmlFor="disable-input-checkbox">Disable Input</label>
                    </li>
                </ul>
            </div>
            <div className="displays">
                <div>Calendar Theme Color:</div>
                <ul>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-salmon"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('salmon')}
                            checked={_themeColor === 'salmon'} />
                        <label htmlFor="radio-calendar-salmon">Salmon</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-green"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('green')}
                            checked={_themeColor === 'green'} />
                        <label htmlFor="radio-calendar-green">Green</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-blue"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('blue')}
                            checked={_themeColor === 'blue'} />
                        <label htmlFor="radio-calendar-blue">Blue</label>
                    </li>
                </ul>
                <div className="toggle">
                    <input type="checkbox"
                        id="set-change-theme-global"
                        onChange={() => _setChangeThemeGlobal(can => !can)}
                        checked={_changeThemeGlobal}
                        onKeyDown={_handleChangeThemeGlobalKeyDown} />
                    <label htmlFor="set-change-theme-global">Change Theme Globally</label>
                </div>
                <div>Calendar Display:</div>
                <ul>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-popup"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('popup')}
                            checked={_calendarOpenDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('popup-large')}
                            checked={_calendarOpenDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </li>
                    <li className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('inline')}
                            checked={_calendarOpenDisplay === 'inline'} />
                        <label htmlFor="radio-calendar-inline">Inline</label>
                    </li>
                </ul>
                <div className="toggle">
                    <input type="checkbox"
                        id="can-close-calendar-toggle"
                        onChange={() => _setCanCloseCalendar(can => !can)}
                        checked={_canCloseCalendar}
                        onKeyDown={_handleCanCloseCalendarKeyDown} />
                    <label htmlFor="can-close-calendar-toggle">Can close calendar</label>
                </div>
                <div className="toggle">
                    <input type="checkbox"
                        id="close-after-selection-toggle"
                        onChange={() => _setCloseAfterSelection(can => !can)}
                        checked={_closeAfterSelection}
                        disabled={!_canCloseCalendar}
                        onKeyDown={_handleCloseAfterSelectionKeyDown} />
                    <label htmlFor="close-after-selection-toggle">Close after selection</label>
                </div>
            </div>
            <div className="labels">
                <div>Text and Labels:</div>
                <div className="label-list">
                    <div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="single-input-label-input"
                                onChange={(e) => _setSingleInputLabel(e.target.value)}
                                value={_singleInputLabel}
                                className={(_singleInputLabel && _singleInputLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="single-input-label-input"
                            >Single Input Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="begin-input-label-input"
                                onChange={(e) => _setBeginInputLabel(e.target.value)}
                                value={_beginInputLabel}
                                className={(_beginInputLabel && _beginInputLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="begin-input-label-input"
                            >Begin Input Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="end-input-label-input"
                                onChange={(e) => _setEndInputLabel(e.target.value)}
                                value={_endInputLabel}
                                className={(_endInputLabel && _endInputLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="end-input-label-input"
                            >End Input Label:</label>
                        </div>
                    </div>
                </div>
                <div>Screenreader Labels:</div>
                <div className="label-list">
                    <div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="calendar-label-input"
                                onChange={(e) => _setCalendarLabel(e.target.value)}
                                value={_calendarLabel}
                                className={(_calendarLabel && _calendarLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="calendar-label-input"
                            >Calendar Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="open-calendar-label-input"
                                onChange={(e) => _setOpenCalendarLabel(e.target.value)}
                                value={_openCalendarLabel}
                                className={(_openCalendarLabel && _openCalendarLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="open-calendar-label-input"
                            >Open Calendar Label:</label>
                        </div>
                    </div>
                    <div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="next-month-label-input"
                                onChange={(e) => _setNextMonthLabel(e.target.value)}
                                value={_nextMonthLabel}
                                className={(_nextMonthLabel && _nextMonthLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="next-month-label-input"
                            >Next Month Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="next-year-label-input"
                                onChange={(e) => _setNextYearLabel(e.target.value)}
                                value={_nextYearLabel}
                                className={(_nextYearLabel && _nextYearLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="next-year-label-input"
                            >Next Year Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="next-multiyear-label-input"
                                onChange={(e) => _setNextMultiyearLabel(e.target.value)}
                                value={_nextMultiyearLabel}
                                className={(_nextMultiyearLabel && _nextMultiyearLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="next-multiyear-label-input"
                            >Next Multiyear Label:</label>
                        </div>
                    </div>
                    <div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="prev-month-label-input"
                                onChange={(e) => _setPrevMonthLabel(e.target.value)}
                                value={_prevMonthLabel}
                                className={(_prevMonthLabel && _prevMonthLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="prev-month-label-input"
                            >Previous Month Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="prev-year-label-input"
                                onChange={(e) => _setPrevYearLabel(e.target.value)}
                                value={_prevYearLabel}
                                className={(_prevYearLabel && _prevYearLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="prev-year-label-input"
                            >Previous Year Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="prev-multiyear-label-input"
                                onChange={(e) => _setPrevMultiyearLabel(e.target.value)}
                                value={_prevMultiyearLabel}
                                className={(_prevMultiyearLabel && _prevMultiyearLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="prev-multiyear-label-input"
                            >Previous Multiyear Label:</label>
                        </div>
                    </div>
                    <div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="switch-month-label-input"
                                onChange={(e) => _setSwitchToMonthViewLabel(e.target.value)}
                                value={_switchToMonthViewLabel}
                                className={(_switchToMonthViewLabel && _switchToMonthViewLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="switch-month-label-input"
                            >Switch to Month View Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="switch-year-label-input"
                                onChange={(e) => _setSwitchToYearViewLabel(e.target.value)}
                                value={_switchToYearViewLabel}
                                className={(_switchToYearViewLabel && _switchToYearViewLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="switch-year-label-input"
                            >Switch to Year View Label:</label>
                        </div>
                        <div className="text-field">
                            <input
                                type="text"
                                id="switch-multiyear-label-input"
                                onChange={(e) => _setSwitchToMultiyearViewLabel(e.target.value)}
                                value={_switchToMultiyearViewLabel}
                                className={(_switchToMultiyearViewLabel && _switchToMultiyearViewLabel !== '') ? INPUT_CLASS_FILLED : ''}
                            />
                            <label
                                htmlFor="switch-multiyear-label-input"
                            >Switch to Multiyear View Label:</label>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Display;