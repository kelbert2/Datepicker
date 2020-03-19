import React, { useState, useEffect, useRef, useContext } from "react";
import { compareDates } from "./CalendarUtils";
import './Datepicker.css';
import Calendar from "./Calendar";
import DatepickerContext, { DateData, OPEN_STATES } from "./DatepickerContext";

const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';

// TODO: go through and see where need to call onFinalDateChange
function DatepickerNoInput(
    { className = '' }
) {
    const {
        selectedDate,

        onFinalDateChange,
        onDateChange,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate,

        disable,
        disableCalendar,
        calendarOpenDisplay,
        canCloseCalendar,
        closeAfterSelection,
        setCalendarOpen,

        dispatch
    } = useContext(DatepickerContext);

    /** Holds open state of the Calendar. */
    const [_calendarDisplay, _setCalendarDisplay] = useState((canCloseCalendar ? 'close' : 'inline') as OPEN_STATES);
    /** Previous rangeMode value. */
    const _prevRangeMode = useRef(rangeMode);

    /** Update Calendar open status if allowances change. */
    useEffect(() => {
        if ((disable || disableCalendar || !setCalendarOpen) && canCloseCalendar) {
            //   onCalendarDateChange({ selectedDate, beginDate, endDate });
            onDateChange({ selectedDate, beginDate, endDate });
            // onFinalDateChange({ selectedDate, beginDate, endDate });

            console.log("Saw allowances change in datepicker");
            console.log({ selectedDate, beginDate, endDate });

            _setCalendarDisplay('close');
        } else if (_calendarDisplay !== 'close' || setCalendarOpen) {
            _setCalendarDisplay(calendarOpenDisplay);
        }
    }, [_calendarDisplay, beginDate, calendarOpenDisplay, canCloseCalendar, disable, disableCalendar, endDate, onDateChange, onFinalDateChange, selectedDate, setCalendarOpen]);

    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
        if (rangeMode !== _prevRangeMode.current) {
            if (rangeMode && !beginDate) {
                dispatch({
                    type: 'set-begin-date',
                    payload: selectedDate
                });
                onDateChange({ selectedDate, beginDate: selectedDate, endDate: null });
            } else {
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
                if (beginDate) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: beginDate
                    });
                    onDateChange({ selectedDate: beginDate, beginDate: null, endDate: null });
                } else {
                    onDateChange({ selectedDate, beginDate: null, endDate: null });
                }
            }
            _prevRangeMode.current = rangeMode;

            // onDateChange({ selectedDate, beginDate, endDate });
        }
    }, [beginDate, dispatch, endDate, onDateChange, rangeMode, selectedDate]);

    /** On minDate change, check if any values are too low as to be invalid. */
    useEffect(() => {
        if (minDate) {
            let selected = null as Date | null, begin = null as Date | null, end = null as Date | null;
            if (selectedDate && compareDates(selectedDate, minDate) < 0) {
                dispatch({
                    type: 'set-selected-date',
                    payload: minDate
                });
                selected = minDate;
            }
            if (rangeMode) {
                if (beginDate && compareDates(beginDate, minDate) < 0) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: minDate
                    });
                    begin = minDate;
                }
                if (endDate && compareDates(endDate, minDate) < 0) {
                    dispatch({
                        type: 'set-end-date',
                        payload: minDate
                    });
                    end = minDate;
                }
            }
            if (selected || begin || end) {
                onDateChange({ selectedDate: selected, beginDate: begin, endDate: end });
            }
        }
    }, [minDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);

    /** On maxDate change, check if any values are too high as to be invalid. */
    useEffect(() => {
        if (maxDate) {
            let selected = null as Date | null, begin = null as Date | null, end = null as Date | null;
            if (selectedDate && compareDates(selectedDate, maxDate) > 0) {
                dispatch({
                    type: 'set-selected-date',
                    payload: maxDate
                });
                selected = maxDate;
            }
            if (rangeMode) {
                if (beginDate && compareDates(beginDate, maxDate) > 0) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: maxDate
                    });
                    begin = maxDate;
                }
                if (endDate && compareDates(endDate, maxDate) > 0) {
                    dispatch({
                        type: 'set-end-date',
                        payload: maxDate
                    });
                    end = maxDate;
                }
            }
            if (selected || begin || end) {
                onDateChange({ selectedDate: selected, beginDate: begin, endDate: end });
            }
        }
    }, [maxDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);

    /** On date filter change, check if any values are invalid. */
    useEffect(() => {
        let selected = null as Date | null, begin = null as Date | null, end = null as Date | null;
        if (!dateFilter(selectedDate)) {
            dispatch({
                type: 'set-selected-date',
                payload: null
            });
            selected = null;
        }
        if (rangeMode) {
            if (!dateFilter(beginDate)) {
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                begin = null;
            }
            if (!dateFilter(endDate)) {
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
                end = null;
            }
        }
        if (selected || begin || end) {
            onDateChange({ selectedDate: selected, beginDate: begin, endDate: end });
        }
    }, [dateFilter, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);

    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        // dispatch({
        //     type: 'set-start-at',
        //     payload: selectedDate
        // });

        onDateChange(data);
        //onFinalDateChange(data);

        console.log("No input calendar said to close");

        console.log("Handling date selection from calendar");
        console.log(data);
        if (closeAfterSelection && canCloseCalendar) {
            _setCalendarDisplay('close');
        }
    }

    /** Close the calendar if clicked off. */
    const _handleNonCalendarClick = () => {
        console.log("Handling click from no input");

        console.log("dates:");
        console.log({ selectedDate, beginDate, endDate });
        onDateChange({ selectedDate, beginDate, endDate });
        // onFinalDateChange({ selectedDate, beginDate, endDate });

        if (_calendarDisplay === 'close') {
            if (!disable || !disableCalendar) {
                _setCalendarDisplay(calendarOpenDisplay);
            }
        } else if (canCloseCalendar) {
            _setCalendarDisplay('close');
        }
    }

    /** Set Calendar display mode. */
    const _setCalendarClass = () => {
        switch (calendarOpenDisplay) {
            case 'inline':
                return CALENDAR_CLASS_INLINE;
            case 'popup-large':
                return CALENDAR_CLASS_POPUP_LARGE;
            default:
                return CALENDAR_CLASS_POPUP;
        }
    }

    return (
        <div
            className={`datepicker ${className}`}
        >
            {
                _calendarDisplay !== 'close' ?
                    <Calendar
                        onFinalDateSelection={_handleDateSelectionFromCalendar}
                        classNames={_setCalendarClass()}
                    ></Calendar>
                    : ''
            }
            {
                _calendarDisplay === 'popup-large' ?
                    <div role="presentation"
                        onClick={() => _handleNonCalendarClick()}
                        className="overlay"></div>
                    : ''
            }
        </div>
    );
}

export default DatepickerNoInput;