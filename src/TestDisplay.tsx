import React, { useContext } from "react";
import DatepickerContext from "./DatepickerContext";
import { formatDateDisplay } from "./CalendarUtils";

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
        disablePopup,
        disableInput,
        popupLarge,

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

    return (
        <div>
            <div>
                <p>Active date: {formatDateDisplay(activeDate)} </p>
                <p className="toggle">
                    <input type="checkbox"
                        id="range-mode-checkbox"
                        onClick={() => { toggleRangeMode() }}
                        checked={rangeMode}></input>
                    <label htmlFor="range-mode-checkbox">RangeMode</label>
                </p>
                <p>Selected date: {selectedDate ? formatDateDisplay(selectedDate) : 'none selected'}</p>
                <p>Begin date: {beginDate ? formatDateDisplay(beginDate) : 'none selected'}</p>
                <p>End date: {endDate ? formatDateDisplay(endDate) : 'none selected'}</p>
            </div>
            <div>
                <p>Enable views:</p>
                <input type="checkbox"
                    id="month-view-checkbox"
                    onClick={() => { toggleDisableMonth() }}
                    checked={!disableMonth} />
                <label htmlFor="month-view-checkbox">Month</label>
                <input type="checkbox"
                    id="year-view-checkbox"
                    onClick={() => { toggleDisableYear() }}
                    checked={!disableYear} />
                <label htmlFor="year-view-checkbox">Year</label>
                <input type="checkbox"
                    id="multiyear-view-checkbox"
                    onClick={() => { toggleDisableMultiyear() }}
                    checked={!disableMultiyear} />
                <label htmlFor="multiyear-view-checkbox">Multiyear</label>
            </div>
        </div>
    )
}

export default TestDisplay;