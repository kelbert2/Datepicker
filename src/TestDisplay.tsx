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
                <p>Range mode: {'' + rangeMode}<button onClick={() => { toggleRangeMode() }}>Toggle</button></p>
                <p>Selected date: {selectedDate ? formatDateDisplay(selectedDate) : 'none selected'}</p>
                <p>Begin date: {beginDate ? formatDateDisplay(beginDate) : 'none selected'}</p>
                <p>End date: {endDate ? formatDateDisplay(endDate) : 'none selected'}</p>
            </div>
            <div>
                <p>Disable month: {'' + disableMonth}<button onClick={() => { toggleDisableMonth() }}>Toggle</button></p>
                <p>Disable year: {'' + disableYear}<button onClick={() => { toggleDisableYear() }}>Toggle</button></p>
                <p>Disable multiyear: {'' + disableMultiyear}<button onClick={() => { toggleDisableMultiyear() }}>Toggle</button></p>
            </div>
        </div>
    )
}

export default TestDisplay;