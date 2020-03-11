import React, { useState, ChangeEvent, useRef } from "react";
import { CalendarDisplay, DateData, DatepickerContextProvider } from "./DatepickerContext";
import { formatDateDisplay, parseStringAsDate } from "./CalendarUtils";
import Datepicker from "./Datepicker";
import DatepickerProvider from "./DatepickerProvider";

function TestDisplay() {

    const [_selectedDate, _setSelectedDate] = useState(null as Date | null);

    const [_minDate, _setMinDate] = useState(null as Date | null);
    const [_maxDate, _setMaxDate] = useState(null as Date | null);
    let _dateFilter = (date: Date | null) => {
        return true
    };

    const [_rangeMode, _setRangeMode] = useState(true); // check if any props are being passed
    const [_beginDate, _setBeginDate] = useState(null as Date | null);
    const [_endDate, _setEndDate] = useState(null as Date | null);

    const [_disableMonth, _setdisableMonth] = useState(false);
    const [_disableYear, _setdisableYear] = useState(false);
    const [_disableMultiyear, _setdisableMultiyear] = useState(false);

    const [_disable, _setDisable] = useState(false);
    const [_disableCalendar, _setDisableCalendar] = useState(false);
    const [_disableInput, _setDisableInput] = useState(false);
    const [_calendarOpenDisplay, _setCalendarOpenDisplay] = useState('popup' as CalendarDisplay);
    const [_canCloseCalendar, _setCanCloseCalendar] = useState(true);
    const [_closeAfterSelection, _setCloseAfterSelection] = useState(true);

    const [_openMaxCalendar, _setOpenMaxCalendar] = useState(false);
    /** Timer to avoid on focus on max calendar datepicker respose not running because seen after on blur. */
    const maxTimer = useRef(null as NodeJS.Timeout | null);


    const _onDateChange = (d: DateData) => {
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onCalendarDateChange = (d: DateData) => {
        console.log("date change in calendar");
        // _setBeginDate(d.beginDate);
        // _setEndDate(d.endDate);
        // _setSelectedDate(d.selectedDate);
    }
    const _onInputDateChange = (d: DateData) => {
        console.log("date change in input");
        // todo: ensure that all input and calendar date changes also fire ondatechange
        // _setBeginDate(d.beginDate);
        // _setEndDate(d.endDate);
        // _setSelectedDate(d.selectedDate);
    }
    const _onMinDateChange = (d: DateData) => {
        _setMinDate(d.selectedDate);
    }
    const _onMinDateInput = (d: DateData) => {
        _setMinDate(d.selectedDate);
    }
    const _onMaxDateChange = (d: DateData) => {
        _setMaxDate(d.selectedDate);
    }
    const _onMaxDateInput = (d: DateData) => {
        _setMaxDate(d.selectedDate);
    }
    const _onDaySelected = (_d: DateData) => {
        // console.log("day selected in month view");
    }
    const _onMonthSelected = (_d: DateData) => {
        // console.log("month selected in year view");
    }
    const _onYearSelected = (_d: DateData) => {
        // console.log("year selected in multiyear view");
    }

    const _toggleRangeMode = () => {
        _setRangeMode(current => !current);
    }
    const toggleDisableMonth = () => {
        _setdisableMonth(current => !current);
    }
    const toggleDisableYear = () => {
        _setdisableYear(current => !current);
    }
    const toggleDisableMultiyear = () => {
        _setdisableMultiyear(current => !current);
    }
    const toggleCanClose = () => {
        _setCanCloseCalendar(current => !current);
    }

    const setCalendarDisplay = (display: CalendarDisplay) => {
        _setCalendarOpenDisplay(display);
    }

    const _onMaxInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
        _setMaxDate((event.target.value && (event.target.value.length) > 0) ? parseStringAsDate(event.target.value) : null);
    }
    /** If a child receives focus, do not close the calendar. */
    const _onFocusHandler = () => {
        if (maxTimer.current) {
            clearTimeout(maxTimer.current);
        }
    }

    const _onClickOffMaxCalendarInput = (event: ChangeEvent<HTMLDivElement>) => {
        maxTimer.current = setTimeout(() => {
            // console.log("dealing with blur event");
            //_setMaxDate((event.target.value && (event.target.value.length) > 0) ? parseStringAsDate(event.target.value) : null);
            _setOpenMaxCalendar(false);
        }, 700);
        // _onMaxInputChange(event);
    }
    const _openMaxCalendarOnInput = () => {
        _setOpenMaxCalendar(true);
    }
    const _handleKeydownMaxInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: {// Enter
                if (_openMaxCalendar === false) {
                    if (!_disable || !_disableCalendar) {
                        _setOpenMaxCalendar(true)
                    }
                } else if (_canCloseCalendar) {
                    _setOpenMaxCalendar(false);
                }
            }
        }
    }

    return (
        <div role="main"
            className="test">
            <h1>Datepicker</h1>
            <DatepickerContextProvider>
                <Datepicker
                    selectedDate={_selectedDate}

                    onDateChange={(d) => _onDateChange(d)}
                    onCalendarDateChange={(d) => _onCalendarDateChange(d)}
                    onInputDateChange={(d) => _onInputDateChange(d)}
                    onDaySelected={(d) => _onDaySelected(d)}
                    onMonthSelected={(d) => _onMonthSelected(d)}
                    onYearSelected={(d) => _onYearSelected(d)}

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
                ></Datepicker>
            </DatepickerContextProvider>
            <div>
                <p className="toggle">
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onClick={() => { _toggleRangeMode() }}
                        checked={_rangeMode} />
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </p>
                <p>Selected date: {_selectedDate ? formatDateDisplay(_selectedDate) : 'none selected'}</p>
                <p>Begin date: {_beginDate ? formatDateDisplay(_beginDate) : 'none selected'}</p>
                <p>End date: {_endDate ? formatDateDisplay(_endDate) : 'none selected'}</p>
            </div>
            <div>
                <p>Minimum date:
                <Datepicker
                        selectedDate={_minDate}

                        onDateChange={(d) => _onMinDateChange(d)}
                        onCalendarDateChange={(d) => _onMinDateChange(d)}
                        onInputDateChange={(d) => _onMinDateInput(d)}
                        onDaySelected={(d) => _onDaySelected(d)}
                        onMonthSelected={(d) => _onMonthSelected(d)}
                        onYearSelected={(d) => _onYearSelected(d)}

                        minDate={null}
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
                    ></Datepicker>
                </p>
                <div
                    role="button"
                    tabIndex={-1}
                    onBlur={(e) => _onClickOffMaxCalendarInput(e)}
                    onFocus={_onFocusHandler}
                    onClick={() => _openMaxCalendarOnInput()}
                    onKeyDown={(e) => _handleKeydownMaxInput(e)}
                >
                    <label
                        htmlFor="test-input-max-date">Maximum date:
                        <input
                            onBlur={(e) => { _onMaxInputBlur(e) }}
                            value={_maxDate ? formatDateDisplay(_maxDate) : undefined}
                            id="test-input-max-date"
                        ></input>
                        <DatepickerProvider
                            selectedDate={_maxDate}

                            onDateChange={(d) => { _onMaxDateChange(d) }}
                            onCalendarDateChange={(d) => _onMaxDateChange(d)}
                            onInputDateChange={(d) => _onMaxDateInput(d)}
                            onDaySelected={(d) => _onDaySelected(d)}
                            onMonthSelected={(d) => _onMonthSelected(d)}
                            onYearSelected={(d) => _onYearSelected(d)}

                            minDate={null}
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
                            setCalendarOpen={_openMaxCalendar}
                        ></DatepickerProvider>
                    </label>
                </div>
            </div>
            <div>
                <p>Enable views:</p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="month-view-checkbox"
                        onClick={() => { toggleDisableMonth() }}
                        checked={!_disableMonth} />
                    <label htmlFor="month-view-checkbox">Month</label>
                </p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="year-view-checkbox"
                        onClick={() => { toggleDisableYear() }}
                        checked={!_disableYear}
                        className="checkbox" />
                    <label htmlFor="year-view-checkbox">Year</label>
                </p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="multiyear-view-checkbox"
                        onClick={() => { toggleDisableMultiyear() }}
                        checked={!_disableMultiyear}
                        className="checkbox" />
                    <label htmlFor="multiyear-view-checkbox">Multiyear</label>
                </p>
            </div>
            <div>
                <p>Calendar Display:</p>
                <p>
                    <div className="radio" >
                        <input type="radio"
                            id="radio-calendar-popup"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('popup') }}
                            checked={_calendarOpenDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </div>

                    <div className="radio" >
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('popup-large') }}
                            checked={_calendarOpenDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('inline') }}
                            checked={_calendarOpenDisplay === 'inline'} />
                        <label htmlFor="radio-calendar-inline">Inline</label>
                    </div>
                </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="can-close-calendar-toggle"
                        onClick={() => { toggleCanClose() }}
                        checked={_canCloseCalendar} />
                    <label htmlFor="can-close-calendar-toggle">Can close calendar</label>
                </p>
            </div>
        </div>
    );
}

export default TestDisplay;