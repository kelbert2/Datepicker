import React, { useState } from "react";
import { CalendarDisplay, DateData, DatepickerContextProvider } from "./DatepickerContext";
import { formatDateDisplay } from "./CalendarUtils";
import Datepicker from "./Datepicker";

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
    const [_calendarDisplay, _setCalendarDisplay] = useState('popup' as CalendarDisplay);
    const [_canCloseCalendar, _setCanCloseCalendar] = useState(true);
    const [_closeAfterSelection, _setCloseAfterSelection] = useState(true);


    const _onDateChange = (d: DateData) => {
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
    }
    const _onDateInput = (d: DateData) => {
        // console.log("date change in input");
        _setBeginDate(d.beginDate);
        _setEndDate(d.endDate);
        _setSelectedDate(d.selectedDate);
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
    const _onDaySelected = (d: DateData) => {
        // console.log("day selected in month view");
    }
    const _onMonthSelected = (d: DateData) => {
        // console.log("month selected in year view");
    }
    const _onYearSelected = (d: DateData) => {
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
        _setCalendarDisplay(display);
    }

    return (
        <div role="main"
            className="test">
            <h1>Datepicker</h1>
            <DatepickerContextProvider>
                <Datepicker
                    selectedDate={_selectedDate}

                    onDateChange={(d) => _onDateChange(d)}
                    onDateInput={(d) => _onDateInput(d)}
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
                    calendarDisplay={_calendarDisplay}
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
                        onDateInput={(d) => _onMinDateInput(d)}
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
                        calendarDisplay={_calendarDisplay}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}
                    ></Datepicker>
                </p>
                <p>Maximum date:
                <Datepicker
                        selectedDate={_maxDate}

                        onDateChange={(d) => _onMaxDateChange(d)}
                        onDateInput={(d) => _onMaxDateInput(d)}
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
                        calendarDisplay={_calendarDisplay}
                        canCloseCalendar={true}
                        closeAfterSelection={_closeAfterSelection}
                    ></Datepicker>
                </p>
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
                            checked={_calendarDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </div>

                    <div className="radio" >
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('popup-large') }}
                            checked={_calendarDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('inline') }}
                            checked={_calendarDisplay === 'inline'} />
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
            {/* <div>
                <p>
                    Minimum date: <Datepicker></Datepicker>
                </p>
                <p>
                    Maximum date: <Datepicker></Datepicker>
                </p>
            </div> */}
        </div>
    )
}

export default TestDisplay;