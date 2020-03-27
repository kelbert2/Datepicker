import { DateData, DatepickerContext } from "./DatepickerContext";
import { compareDates } from "./CalendarUtils";
import React, { useState, useEffect, useRef, useContext } from "react";
import { OPEN_STATES } from "./Input";
import './Datepicker.css';
import Calendar from "./Calendar";

const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';

function DatepickerHandler() {
    const {
        selectedDate,

        onDateChange,
        onCalendarDateChange,

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
    /** Previous minDate value. */
    const _prevMinDate = useRef(null as Date | null);
    /** Previous maxDate value. */
    const _prevMaxDate = useRef(null as Date | null);
    /** Previous dateFilter function. */
    const _prevDateFilter = useRef(dateFilter);

    /** Update Calendar open status if allowances change. */
    useEffect(() => {
        if ((disable || disableCalendar || !setCalendarOpen) && canCloseCalendar) {
            _setCalendarDisplay('close');
        } else if (_calendarDisplay !== 'close' || setCalendarOpen) {
            _setCalendarDisplay(calendarOpenDisplay);
        }
    }, [_calendarDisplay, calendarOpenDisplay, canCloseCalendar, disable, disableCalendar, setCalendarOpen]);

    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
        if (rangeMode !== _prevRangeMode.current) {
            let select = selectedDate, begin = beginDate, end = endDate;
            if (rangeMode && !beginDate) {
                dispatch({
                    type: 'set-begin-date',
                    payload: selectedDate
                });
                begin = selectedDate;
            } else {
                if (beginDate) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: beginDate
                    });
                    select = begin;
                }
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
                begin = null;
                end = null;
            }
            _prevRangeMode.current = rangeMode;

            // onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
            // onDateChange({ selectedDate, beginDate, endDate });
            onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        }
    }, [beginDate, dispatch, endDate, onDateChange, rangeMode, selectedDate]);

    /** On minDate change, check if any values are too low as to be invalid. */
    useEffect(() => {
        if (minDate !== _prevMinDate.current) {
            if (minDate) {
                let select = null, begin = null, end = null;

                if (selectedDate && compareDates(selectedDate, minDate) < 0) {
                    // Selected date is before minDate
                    dispatch({
                        type: 'set-selected-date',
                        payload: minDate
                    });
                    //   onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                    // onDateChange({ selectedDate, beginDate, endDate });
                    select = minDate;
                }
                if (rangeMode) {
                    if (beginDate && compareDates(beginDate, minDate) < 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: minDate
                        });
                        //   onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                        // onDateChange({ selectedDate, beginDate, endDate });
                        begin = minDate;
                    }
                    if (endDate && compareDates(endDate, minDate) < 0) {
                        dispatch({
                            type: 'set-end-date',
                            payload: minDate
                        });
                        //   onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                        // onDateChange({ selectedDate, beginDate, endDate });
                        end = minDate;
                    }
                }
                if (select || begin || end) {
                    onDateChange({ selectedDate: select || selectedDate, beginDate: begin || beginDate, endDate: end || endDate });
                }
            }
            _prevMinDate.current = minDate;
        }
    }, [minDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);
    /** On maxDate change, check if any values are too high as to be invalid. */
    useEffect(() => {
        if (maxDate !== _prevMaxDate.current) {
            if (maxDate) {
                let select = null, begin = null, end = null;

                if (selectedDate && compareDates(selectedDate, maxDate) > 0) {
                    // Selected date is before minDate
                    dispatch({
                        type: 'set-selected-date',
                        payload: maxDate
                    });
                    //  onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                    // onDateChange({ selectedDate, beginDate, endDate });
                    select = maxDate;
                }
                if (rangeMode) {
                    if (beginDate && compareDates(beginDate, maxDate) > 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: maxDate
                        });
                        //      onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                        // onDateChange({ selectedDate, beginDate, endDate });
                        begin = maxDate;
                    }
                    if (endDate && compareDates(endDate, maxDate) > 0) {
                        dispatch({
                            type: 'set-end-date',
                            payload: maxDate
                        });
                        //    onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                        // onDateChange({ selectedDate, beginDate, endDate });
                        end = maxDate;
                    }
                }
                if (select || begin || end) {
                    onDateChange({ selectedDate: select || selectedDate, beginDate: begin || beginDate, endDate: end || endDate });
                }
            }
            _prevMaxDate.current = maxDate;
        }
    }, [maxDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);
    /** On date filter change, check if any values are invalid. */
    useEffect(() => {
        if (dateFilter !== _prevDateFilter.current) {
            let select = selectedDate as Date | null, begin = beginDate as Date | null, end = endDate as Date | null;
            if (!dateFilter(selectedDate)) {
                // Selected date is before minDate
                dispatch({
                    type: 'set-selected-date',
                    payload: null
                });
                //  onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                // onDateChange({ selectedDate, beginDate, endDate });
                select = null;
            }
            if (rangeMode) {
                if (!dateFilter(beginDate)) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: null
                    });
                    //  onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                    // onDateChange({ selectedDate, beginDate, endDate });
                    begin = null;
                }
                if (!dateFilter(endDate)) {
                    dispatch({
                        type: 'set-end-date',
                        payload: null
                    });
                    //    onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                    // onDateChange({ selectedDate, beginDate, endDate });
                    end = null;
                }
            }
            _prevDateFilter.current = dateFilter;

            if (!selectedDate || !begin || !end) {
                onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
            }
        }
    }, [dateFilter, beginDate, dispatch, endDate, rangeMode, selectedDate, onDateChange]);

    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        // dispatch({
        //     type: 'set-start-at',
        //     payload: selectedDate
        // });
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

        //   onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
        onDateChange({ selectedDate: selectedDate, beginDate, endDate });

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
        <div>
            {
                _calendarDisplay !== 'close' ?
                    <Calendar
                        onFinalDateSelection={_handleDateSelectionFromCalendar}
                        classNames={_setCalendarClass()}
                        disableCalendar={disable}
                    ></Calendar>
                    : ''
            }
            {
                _calendarDisplay === 'popup-large' ?
                    <div role="presentation"
                        onClick={_handleNonCalendarClick}
                        className="overlay"></div>
                    : ''
            }
        </div>
    );
}

export default DatepickerHandler;