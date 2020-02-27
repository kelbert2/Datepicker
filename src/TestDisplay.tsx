import React, { useContext } from "react";
import DatepickerContext from "./DatepickerContext";
import { getYear, formatDateDisplay } from "./CalendarUtils";

function TestDisplay() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange: dateChange,
        onDateInput: dateInput,
        onYearSelected: yearSelected,
        onMonthSelected: monthSelected,
        onDaySelected: daySelected,

        startAt,
        startView,

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

        formatMonthLabel,
        formatMonthText,

        formatYearLabel,
        formatYearText,

        formatMultiyearLabel,
        formatMultiyearText,

        calendarLabel,
        openCalendarLabel,

        nextMonthLabel,
        nextYearLabel,
        nextMultiyearLabel,

        prevMonthLabel,
        prevYearLabel,
        prevMultiyearLabel,

        switchToMonthViewLabel,
        switchToYearViewLabel,
        switchToMultiyearViewLabel,

        dispatch
    } = useContext(DatepickerContext);

    const toggleRangeMode = () => {
        dispatch({
            type: 'set-range-mode',
            payload: !rangeMode
        });
    }

    return (
        <div>
            <p>Active date: {formatDateDisplay(activeDate)} </p>
            <p>Range mode: {'' + rangeMode}<button onClick={() => { toggleRangeMode() }}>Toggle</button></p>
            <p>Selected date: {selectedDate ? formatDateDisplay(selectedDate) : 'none selected'}</p>
            <p>Begin date: {beginDate ? formatDateDisplay(beginDate) : 'none selected'}</p>
            <p>End date: {endDate ? formatDateDisplay(endDate) : 'none selected'}</p>
        </div>
    )
}

export default TestDisplay;