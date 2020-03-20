import React, { useState } from "react";
import { VIEW, makeDatepickerTheme, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay } from "../CalendarUtils";
import { CalendarDisplay, DateData } from "../DatepickerContext";
import DatepickerInput from "../DatepickerInput";

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
        return true
    };

    const [_rangeMode, _setRangeMode] = useState(true); // check if any props are being passed
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
        "--on-background": "rgb(215,245,255)"
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
        console.log("final date change");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onDateChange = (d: DateData) => {
        console.log("date change");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onCalendarDateChange = (d: DateData) => {
        console.log("date change in calendar:");
    }
    const _onInputDateChange = (d: DateData) => {
        console.log("date change in input:");
    }
    const _onDaySelected = (d: DateData) => {
        console.log("day selected in month view");
    }
    const _onMonthSelected = (d: DateData) => {
        console.log("month selected in year view");
    }
    const _onYearSelected = (d: DateData) => {
        console.log("year selected in multiyear view");
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
        return _disable || (_disableCalendar && _disableInput);
    }
    const _getDisableCalendar = () => {
        return _disable || _disableCalendar;
        // const disable = !_disableCalendar;
        // if (disable && _disableInput) {
        //     _setDisable(disable);
        // }
        // _setDisableCalendar(disable);
    }
    const _getDisableInput = () => {
        return _disable || _disableInput;
        // const disable = !_disableInput;
        // if (disable && _disableCalendar) {
        //     _setDisable(disable);
        // }
        // _setDisableInput(disable);
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
                <p className="toggle">
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onClick={() => { _setRangeMode(mode => !mode) }}
                        checked={_rangeMode} />
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </p>
                <p>Selected date: {_selectedDate ? formatDateDisplay(_selectedDate) : 'none selected'}</p>
                <p>Begin date: {_beginDate ? formatDateDisplay(_beginDate) : 'none selected'}</p>
                <p>End date: {_endDate ? formatDateDisplay(_endDate) : 'none selected'}</p>
            </div>
            <div>
                <p>Minimum date:
                <DatepickerInput
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
                    ></DatepickerInput>
                </p>
                <p>Maximum date:
                <DatepickerInput
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
                    ></DatepickerInput>
                </p>
            </div>
            <p>Date filter</p>
            <p>None only weekdays only weekends</p>
            <p>First Day of Week</p>
            <p>Su M T W Th F S </p>
            <div>
                <p>Start View:</p>
                <p>month year multiyear disable when view disabled</p>
                <p>Enable Views:</p>
                <p>
                    <p className="checkbox">
                        <input type="checkbox"
                            id="month-view-checkbox"
                            onClick={() => { _setDisableMonth(disable => !disable) }}
                            checked={!_disableMonth} />
                        <label htmlFor="month-view-checkbox">Month</label>
                    </p>
                    <p className="checkbox">
                        <input type="checkbox"
                            id="year-view-checkbox"
                            onClick={() => { _setDisableYear(disable => !disable) }}
                            checked={!_disableYear}
                            className="checkbox" />
                        <label htmlFor="year-view-checkbox">Year</label>
                    </p>
                    <p className="checkbox">
                        <input type="checkbox"
                            id="multiyear-view-checkbox"
                            onClick={() => { _setDisableMultiyear(disable => !disable) }}
                            checked={!_disableMultiyear}
                            className="checkbox" />
                        <label htmlFor="multiyear-view-checkbox">Multiyear</label>
                    </p>
                </p>
                <p>Enable Inputs:</p>
                <p>
                    <p className="checkbox">
                        <input type="checkbox"
                            id="disable-all-checkbox"
                            onClick={() => { _toggleDisable() }}
                            checked={_getDisable()} />
                        <label htmlFor="disable-all-checkbox">Disable All</label>
                    </p>
                    <p className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-calendar-checkbox"
                            onClick={() => _setDisableCalendar(disable => !disable)}
                            checked={_getDisableCalendar()} />
                        <label htmlFor="disable-calendar-checkbox">Disable Calendar</label>
                    </p>
                    <p className="checkbox">
                        <input type="checkbox"
                            disabled={_disable}
                            id="disable-input-checkbox"
                            onClick={() => { _setDisableInput(disable => !disable) }}
                            checked={_getDisableInput()} />
                        <label htmlFor="disable-input-checkbox">Disable Input</label>
                    </p>
                </p>
            </div>
            <div>
                <p>Calendar Theme Color:</p>
                <p>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-salmon"
                            name="calendar-theme-color"
                            onClick={() => { _setThemeColor('salmon') }}
                            checked={_themeColor === 'salmon'} />
                        <label htmlFor="radio-calendar-salmon">Salmon</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-green"
                            name="calendar-theme-color"
                            onClick={() => { _setThemeColor('green') }}
                            checked={_themeColor === 'green'} />
                        <label htmlFor="radio-calendar-green">Green</label>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-blue"
                            name="calendar-theme-color"
                            onClick={() => { _setThemeColor('blue') }}
                            checked={_themeColor === 'blue'} />
                        <label htmlFor="radio-calendar-blue">Blue</label>
                    </div>
                </p>
                <p>Calendar Display:</p>
                <p>
                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-popup"
                            name="calendar-display"
                            onClick={() => { _setCalendarOpenDisplay('popup') }}
                            checked={_calendarOpenDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onClick={() => { _setCalendarOpenDisplay('popup-large') }}
                            checked={_calendarOpenDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onClick={() => { _setCalendarOpenDisplay('inline') }}
                            checked={_calendarOpenDisplay === 'inline'} />
                        <label htmlFor="radio-calendar-inline">Inline</label>
                    </div>
                </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="can-close-calendar-toggle"
                        onClick={() => { _setCanCloseCalendar(can => !can) }}
                        checked={_canCloseCalendar} />
                    <label htmlFor="can-close-calendar-toggle">Can close calendar</label>
                </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="close-after-selection-toggle"
                        onClick={() => { _setCloseAfterSelection(can => !can) }}
                        checked={_closeAfterSelection} />
                    <label htmlFor="close-after-selection-toggle">Close after selection</label>
                </p>
            </div>
            <div>
                <p>Text and Labels:</p>
                <p>
                    <p className="field">
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
                    </p>
                    <p className="field">
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
                    </p>
                    <div>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                    </div>
                    <div>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                    </div>
                    <div>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                    </div>
                    <div>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                        <p className="field">
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
                        </p>
                    </div>
                </p>
                <p>Screenreader Labels:</p>
                <p>
                </p>
            </div>
        </div>
    );
}

export default Display;