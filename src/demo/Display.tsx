import React, { useState } from "react";
import { VIEW, makeDatepickerTheme, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, getDayOfWeek } from "../CalendarUtils";
import { CalendarDisplay, DateData } from "../DatepickerContext";
import DatepickerInput from "../DatepickerInput";

// TODO: Go through and update date change vs. final date change firings
function Display() {
    const INPUT_CLASS_FILLED = 'filled';

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
    const [_calendarOpenDisplay, _setCalendarOpenDisplay] = useState('inline' as CalendarDisplay);
    const [_canCloseCalendar, _setCanCloseCalendar] = useState(false);
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
        // console.log("final date change");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onDateChange = (d: DateData) => {
        // console.log("date change");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
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

    return (
        <div
            className="test">
            <h1>Datepicker</h1>
            <DatepickerInput
                selectedDate={_selectedDate}
                todayDate={new Date()}

                onFinalDateChange={(d) => _onFinalDateChange(d)}
                onDateChange={(d) => _onDateChange(d)}
                onCalendarDateChange={(d) => _onCalendarDateChange(d)}
                onInputDateChange={(d) => _onInputDateChange(d)}
                onDaySelected={(d) => _onDaySelected(d)}
                onMonthSelected={(d) => _onMonthSelected(d)}
                onYearSelected={(d) => _onYearSelected(d)}

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
                disableCalendar={_disableCalendar}
                disableInput={_disableInput}
                calendarOpenDisplay={_calendarOpenDisplay}
                canCloseCalendar={_canCloseCalendar}
                closeAfterSelection={_closeAfterSelection}
                // setCalendarOpen={_open}

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
            <div>
                <div className="toggle">
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onChange={() => _setRangeMode(mode => !mode)}
                        checked={_rangeMode} />
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </div>
                <div>Selected date: {_selectedDate ? formatDateDisplay(_selectedDate) : 'none selected'}</div>
                <div>Begin date: {_beginDate ? formatDateDisplay(_beginDate) : 'none selected'}</div>
                <div>End date: {_endDate ? formatDateDisplay(_endDate) : 'none selected'}</div>
            </div>
            <div>
                <div>Minimum date:
                {/* <DatepickerInput
                        selectedDate={_minDate}

                        onFinalDateChange={(d) => { }}
                        onDateChange={(d) => _setMinDate(d.selectedDate)}
                        onCalendarDateChange={(d) => { }}
                        onInputDateChange={(d) => { }}
                        onDaySelected={(d) => _onDaySelected(d)}
                        onMonthSelected={(d) => _onMonthSelected(d)}
                        onYearSelected={(d) => _onYearSelected(d)}

                        minDate={null}
                        maxDate={_maxDate}
                        dateFilter={_dateFilter}

                        rangeMode={false}
                        beginDate={null}
                        endDate={null}

                        disableMonth={_disableMonth}
                        disableYear={_disableYear}
                        disableMultiyear={_disableMultiyear}

                        disable={_disable}
                        disableCalendar={_disableCalendar}
                        disableInput={_disableInput}
                        calendarOpenDisplay={_calendarOpenDisplay}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}

                        theme={getTheme(_themeColor)}
                    ></DatepickerInput> */}
                </div>
                <div>Maximum date:
                {/* <DatepickerInput
                        selectedDate={_maxDate}

                        onFinalDateChange={(d) => { }}
                        onDateChange={(d) => _setMaxDate(d.selectedDate)}
                        onCalendarDateChange={(d) => { }}
                        onInputDateChange={(d) => { }}
                        onDaySelected={(d) => _onDaySelected(d)}
                        onMonthSelected={(d) => _onMonthSelected(d)}
                        onYearSelected={(d) => _onYearSelected(d)}

                        minDate={_minDate}
                        maxDate={null}
                        dateFilter={_dateFilter}

                        rangeMode={false}
                        beginDate={null}
                        endDate={null}

                        disableMonth={_disableMonth}
                        disableYear={_disableYear}
                        disableMultiyear={_disableMultiyear}

                        disable={_disable}
                        disableCalendar={_disableCalendar}
                        disableInput={_disableInput}
                        calendarOpenDisplay={_calendarOpenDisplay}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}

                        theme={getTheme(_themeColor)}
                    ></DatepickerInput> */}
                </div>
            </div>
            <div>
                <div>Date filter</div>
                <div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-date-filter-all"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('all')}
                            checked={_dateFilterType === 'all'} />
                        <label htmlFor="radio-date-filter-all">All</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-date-filter-weekends"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('only weekends')}
                            checked={_dateFilterType === 'only weekends'} />
                        <label htmlFor="radio-date-filter-weekends">Only weekends</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-date-filter-weekdays"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('only weekdays')}
                            checked={_dateFilterType === 'only weekdays'} />
                        <label htmlFor="radio-date-filter-weekdays">Only weekdays</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-date-filter-none"
                            name="radio-date-filter"
                            onChange={() => _setDateFilterType('none')}
                            checked={_dateFilterType === 'none'} />
                        <label htmlFor="radio-date-filter-none">None</label>
                    </div>
                </div>
                <div>First Day of Week</div>
                <div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-0"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(0)}
                            checked={_firstDayOfWeek === 0} />
                        <label htmlFor="radio-weekday-0">Su</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-1"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(1)}
                            checked={_firstDayOfWeek === 1} />
                        <label htmlFor="radio-weekday-1">M</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-2"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(2)}
                            checked={_firstDayOfWeek === 2} />
                        <label htmlFor="radio-weekday-2">T</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-3"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(3)}
                            checked={_firstDayOfWeek === 3} />
                        <label htmlFor="radio-weekday-3">W</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-4"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(4)}
                            checked={_firstDayOfWeek === 4} />
                        <label htmlFor="radio-weekday-4">Th</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-5"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(5)}
                            checked={_firstDayOfWeek === 5} />
                        <label htmlFor="radio-weekday-5">F</label>
                    </div>
                    <div className="radio-weekday">
                        <input type="radio"
                            id="radio-weekday-6"
                            name="radio-weekday"
                            onChange={() => _setFirstDayOfWeek(6)}
                            checked={_firstDayOfWeek === 6} />
                        <label htmlFor="radio-weekday-6">S</label>
                    </div>
                </div>
                <div>Start View:</div>
                <div>month year multiyear disable when view disabled</div>
                <div>
                    <div className="radio">
                        <input type="radio"
                            id="month-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('month') }}
                            onChange={() => _setStartingView('month')}
                            checked={_startView === 'month'}
                            disabled={_disableMonth} />
                        <label htmlFor="month-start-view-radio">Month</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="year-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('year') }}
                            onChange={() => _setStartingView('year')}
                            checked={_startView === 'year'}
                            disabled={_disableYear} />
                        <label htmlFor="year-start-view-radio">Year</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="multiyear-start-view-radio"
                            name="start-view-radio"
                            // onClick={() => { _setStartView('multiyear') }}
                            onChange={() => _setStartingView('multiyear')}
                            checked={_startView === 'multiyear'}
                            disabled={_disableMultiyear} />
                        <label htmlFor="multiyear-start-view-radio">Multiyear</label>
                    </div>
                </div>
                <div>Enable Views:</div>
                <div>
                    <div className="checkbox">
                        <input type="checkbox"
                            id="month-view-checkbox"
                            onChange={() => _setDisableMonth(disable => !disable)}
                            checked={!_disableMonth} />
                        <label htmlFor="month-view-checkbox">Month</label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox"
                            id="year-view-checkbox"
                            onChange={() => _setDisableYear(disable => !disable)}
                            checked={!_disableYear}
                            className="checkbox" />
                        <label htmlFor="year-view-checkbox">Year</label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox"
                            id="multiyear-view-checkbox"
                            onChange={() => _setDisableMultiyear(disable => !disable)}
                            checked={!_disableMultiyear}
                            className="checkbox" />
                        <label htmlFor="multiyear-view-checkbox">Multiyear</label>
                    </div>
                </div>
                <div>Enable Inputs:</div>
                <div>
                    <div className="checkbox">
                        <input type="checkbox"
                            id="disable-all-checkbox"
                            onChange={_toggleDisable}
                            checked={_getDisable()} />
                        <label htmlFor="disable-all-checkbox">Disable All</label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-calendar-checkbox"
                            onChange={() => _setDisableCalendar(disable => !disable)}
                            checked={_getDisableCalendar()} />
                        <label htmlFor="disable-calendar-checkbox">Disable Calendar</label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-input-checkbox"
                            onChange={() => _setDisableInput(disable => !disable)}
                            checked={_getDisableInput()} />
                        <label htmlFor="disable-input-checkbox">Disable Input</label>
                    </div>
                </div>
            </div>
            <div>
                <div>Calendar Theme Color:</div>
                <div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-salmon"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('salmon')}
                            checked={_themeColor === 'salmon'} />
                        <label htmlFor="radio-calendar-salmon">Salmon</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-green"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('green')}
                            checked={_themeColor === 'green'} />
                        <label htmlFor="radio-calendar-green">Green</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-blue"
                            name="calendar-theme-color"
                            onChange={() => _setThemeColor('blue')}
                            checked={_themeColor === 'blue'} />
                        <label htmlFor="radio-calendar-blue">Blue</label>
                    </div>
                </div>
                <div>Calendar Display:</div>
                <div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-popup"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('popup')}
                            checked={_calendarOpenDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('popup-large')}
                            checked={_calendarOpenDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onChange={() => _setCalendarOpenDisplay('inline')}
                            checked={_calendarOpenDisplay === 'inline'} />
                        <label htmlFor="radio-calendar-inline">Inline</label>
                    </div>
                </div>
                <div className="toggle">
                    <input type="checkbox"
                        id="can-close-calendar-toggle"
                        onChange={() => _setCanCloseCalendar(can => !can)}
                        checked={_canCloseCalendar} />
                    <label htmlFor="can-close-calendar-toggle">Can close calendar</label>
                </div>
                <div className="toggle">
                    <input type="checkbox"
                        id="close-after-selection-toggle"
                        onChange={() => _setCloseAfterSelection(can => !can)}
                        checked={_closeAfterSelection}
                        disabled={!_canCloseCalendar} />
                    <label htmlFor="close-after-selection-toggle">Close after selection</label>
                </div>
            </div>
            <div>
                <div>Text and Labels:</div>
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
                <div>
                </div>
            </div>
        </div>
    );
}

export default Display;