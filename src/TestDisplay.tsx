import React, { useContext } from "react";
import DatepickerContext, { CalendarDisplay } from "./DatepickerContext";
import { formatDateDisplay } from "./CalendarUtils";
import Datepicker from "./Datepicker";

function TestDisplay() {
    const {
        selectedDate,
        activeDate,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate,

        disableMonth,
        disableYear,
        disableMultiyear,

        disable,
        disableCalendar,
        disableInput,
        calendarDisplay,
        canCloseCalendar,
        closeAfterSelection,

        dispatch
    } = useContext(DatepickerContext);

    const toggleRangeMode = () => {
        dispatch({
            type: 'set-range-mode',
            payload: !rangeMode
        });
    }
    const toggleDisableMonth = () => {
        dispatch({
            type: 'set-disable-month',
            payload: !disableMonth
        });
    }
    const toggleDisableYear = () => {
        dispatch({
            type: 'set-disable-year',
            payload: !disableYear
        });
    }
    const toggleDisableMultiyear = () => {
        dispatch({
            type: 'set-disable-multiyear',
            payload: !disableMultiyear
        });
    }
    const toggleCanClose = () => {
        dispatch({
            type: 'set-can-close-calendar',
            payload: !canCloseCalendar
        });
    }

    const setCalendarDisplay = (display: CalendarDisplay) => {
        dispatch({
            type: 'set-calendar-display',
            payload: display
        });
    }

    return (
        <div className="test">
            <div>
                <p>Active date: {formatDateDisplay(activeDate)} </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onClick={() => { toggleRangeMode() }}
                        checked={rangeMode} />
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </p>
                <p>Selected date: {selectedDate ? formatDateDisplay(selectedDate) : 'none selected'}</p>
                <p>Begin date: {beginDate ? formatDateDisplay(beginDate) : 'none selected'}</p>
                <p>End date: {endDate ? formatDateDisplay(endDate) : 'none selected'}</p>
            </div>
            <div>
                <p>Enable views:</p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="month-view-checkbox"
                        onClick={() => { toggleDisableMonth() }}
                        checked={!disableMonth} />
                    <label htmlFor="month-view-checkbox">Month</label>
                </p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="year-view-checkbox"
                        onClick={() => { toggleDisableYear() }}
                        checked={!disableYear}
                        className="checkbox" />
                    <label htmlFor="year-view-checkbox">Year</label>
                </p>
                <p className="checkbox">
                    <input type="checkbox"
                        id="multiyear-view-checkbox"
                        onClick={() => { toggleDisableMultiyear() }}
                        checked={!disableMultiyear}
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
                            checked={calendarDisplay === 'popup'} />
                        <label htmlFor="radio-calendar-popup">Popup</label>
                    </div>

                    <div className="radio" >
                        <input type="radio"
                            id="radio-calendar-popup-large"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('popup-large') }}
                            checked={calendarDisplay === 'popup-large'} />
                        <label htmlFor="radio-calendar-popup-large">Large popup</label>
                    </div>

                    <div className="radio">
                        <input type="radio"
                            id="radio-calendar-inline"
                            name="calendar-display"
                            onClick={() => { setCalendarDisplay('inline') }}
                            checked={calendarDisplay === 'inline'} />
                        <label htmlFor="radio-calendar-inline">Inline</label>
                    </div>
                </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="can-close-calendar-toggle"
                        onClick={() => { toggleCanClose() }}
                        checked={canCloseCalendar} />
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