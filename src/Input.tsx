import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import DatepickerContext, { DateData, CalendarDisplay } from './DatepickerContext';
import Calendar from './Calendar';
import { compareDaysMonthsAndYears, simpleUID, compareDates, formatDateDisplay } from './CalendarUtils';

export type OPEN_STATES = CalendarDisplay | 'close';
const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';
const INPUT_CLASS_FILLED = 'filled';

// TODO: When input is deleted, set dates as null
function Input() {
    const {
        selectedDate,
        activeDate,

        rangeMode,
        beginDate,
        endDate,

        minDate,
        maxDate,
        dateFilter,

        onDateChange,
        onInputDateChange,

        disable,
        disableCalendar,
        disableInput,
        calendarOpenDisplay,
        canCloseCalendar,
        closeAfterSelection,
        setCalendarOpen,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,

        dispatch }
        = useContext(DatepickerContext);

    /** Holds open state of the Calendar. */
    const [_calendarDisplay, _setCalendarDisplay] = useState((canCloseCalendar ? 'close' : 'inline') as OPEN_STATES);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    /** UID for inputs and labels. */
    const [id] = useState(() => simpleUID('myprefix-'));
    /** Timer to avoid on focus respose not running because seen after on blur. */
    const timer = useRef(null as NodeJS.Timeout | null);
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
        if ((disable || disableCalendar) && canCloseCalendar) {
            _setCalendarDisplay('close');
        } else if (_calendarDisplay !== 'close') {
            _setCalendarDisplay(calendarOpenDisplay);
        }
    }, [_calendarDisplay, calendarOpenDisplay, canCloseCalendar, disable, disableCalendar, setCalendarOpen]);

    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
        if (rangeMode !== _prevRangeMode.current) {
            if (rangeMode && !beginDate) {
                dispatch({
                    type: 'set-begin-date',
                    payload: selectedDate
                });
            } else {
                if (beginDate) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: beginDate
                    });
                }
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
            }
            _prevRangeMode.current = rangeMode;

            onInputDateChange({ selectedDate, beginDate, endDate });
            onDateChange({ selectedDate, beginDate, endDate });
        }
    }, [rangeMode, beginDate, dispatch, endDate, onDateChange, onInputDateChange, selectedDate]);
    //TODO: move these or get it to update input quicker
    /** On minDate change, check if any values are too low as to be invalid. */
    useEffect(() => {
        console.log("minDate: " + (minDate ? formatDateDisplay(minDate) : "null"));
        console.log("Previous: " + (_prevMinDate.current ? formatDateDisplay(_prevMinDate.current) : "null"))
        if (minDate !== _prevMinDate.current) {
            console.log("min date change!");
            if (minDate) {
                if (selectedDate && compareDates(selectedDate, minDate) < 0) {
                    // Selected date is before minDate
                    dispatch({
                        type: 'set-selected-date',
                        payload: minDate
                    });
                }
                if (rangeMode) {
                    if (beginDate && compareDates(beginDate, minDate) < 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: minDate
                        });
                    }
                    if (endDate && compareDates(endDate, minDate) < 0) {
                        dispatch({
                            type: 'set-end-date',
                            payload: minDate
                        });
                    }
                }
                onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                onDateChange({ selectedDate, beginDate, endDate });
            }
            _prevMinDate.current = minDate;
        }
    }, [minDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);
    /** On maxDate change, check if any values are too high as to be invalid. */
    useEffect(() => {
        if (maxDate !== _prevMaxDate.current) {
            console.log("maxDate change!");
            if (maxDate) {
                if (selectedDate && compareDates(selectedDate, maxDate) > 0) {
                    // Selected date is before minDate
                    dispatch({
                        type: 'set-selected-date',
                        payload: maxDate
                    });
                }
                if (rangeMode) {
                    if (beginDate && compareDates(beginDate, maxDate) > 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: maxDate
                        });
                    }
                    if (endDate && compareDates(endDate, maxDate) > 0) {
                        dispatch({
                            type: 'set-end-date',
                            payload: maxDate
                        });
                    }
                }
                onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
                onDateChange({ selectedDate, beginDate, endDate });
            }
            _prevMaxDate.current = maxDate;
        }
    }, [maxDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);
    /** On date filter change, check if any values are invalid. */
    useEffect(() => {
        if (dateFilter !== _prevDateFilter.current) {
            console.log("date filter change!");
            if (!dateFilter(selectedDate)) {
                // Selected date is before minDate
                dispatch({
                    type: 'set-selected-date',
                    payload: null
                });
            }
            if (rangeMode) {
                if (!dateFilter(beginDate)) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: null
                    });
                }
                if (!dateFilter(endDate)) {
                    dispatch({
                        type: 'set-end-date',
                        payload: null
                    });
                }
            }
            _prevDateFilter.current = dateFilter;

            onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
            onDateChange({ selectedDate, beginDate, endDate });
        }
    }, [dateFilter, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);


    /** Update first text input display with selected date changes. */
    useLayoutEffect(() => {
        if (!rangeMode) {
            _setBeginInput(selectedDate ? displayDateAsString(selectedDate) : '');
        }
    }, [selectedDate, rangeMode, displayDateAsString]);
    /** Update first text input display with begin date changes. */
    useLayoutEffect(() => {
        if (rangeMode) {
            _setBeginInput(beginDate ? displayDateAsString(beginDate) : '');
        }
    }, [beginDate, rangeMode, displayDateAsString]);
    /** Update second text input display with end date changes. */
    useLayoutEffect(() => {
        if (rangeMode) {
            _setEndInput(endDate ? displayDateAsString(endDate) : '');
        }
    }, [endDate, rangeMode, displayDateAsString]);

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : '');
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setEndInput((event.target.value.length > 0) ? event.target.value : '');
    }

    /** On blur, format first text input and set selected and begin dates. */
    const _onBlurBeginInput = () => {
        if (_beginInput !== '') {
            const date = parseStringToDate(_beginInput);
            if (date != null) {
                if (selectedDate == null || compareDaysMonthsAndYears(selectedDate, date) !== 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: date
                    });
                }
                // if (activeDate == null || compareDaysMonthsAndYears(activeDate, date) !== 0) {
                //     dispatch({
                //         type: 'set-active-date',
                //         payload: date
                //     });
                // }

                if (rangeMode) {
                    const prevEndDate = endDate;
                    if (prevEndDate != null && compareDaysMonthsAndYears(prevEndDate, date) < 0) {
                        // new date is after the existing end date, so switch them
                        dispatch({
                            type: 'set-begin-date',
                            payload: prevEndDate
                        });
                        dispatch({
                            type: 'set-end-date',
                            payload: date
                        });
                    } else if (beginDate == null || compareDaysMonthsAndYears(beginDate, date) !== 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                    }
                }
            } else {
                // Input entered is not a valid date
                _setBeginInput(rangeMode
                    ? beginDate ? displayDateAsString(beginDate) : ''
                    : selectedDate ? displayDateAsString(selectedDate) : '');
            }
        } else {
            // No input was entered
            dispatch({
                type: 'set-selected-date',
                payload: null
            });
            if (rangeMode) {
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
            }
        }
        onInputDateChange({ selectedDate, beginDate, endDate });
        onDateChange({ selectedDate, beginDate, endDate });
    }
    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        if (_endInput !== '') {
            const date = parseStringToDate(_endInput);
            if (date != null) {
                if (selectedDate == null || compareDaysMonthsAndYears(selectedDate, date) !== 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: date
                    });
                }
                // if (activeDate == null || compareDaysMonthsAndYears(activeDate, date) !== 0) {
                //     dispatch({
                //         type: 'set-active-date',
                //         payload: date
                //     });
                // }

                if (rangeMode) {
                    const prevBeginDate = beginDate;
                    if (prevBeginDate && compareDaysMonthsAndYears(date, prevBeginDate) < 0) {
                        // If the input date is before the existing beginDate, it becomes the new beginDate
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                        // We switch previous beginDate for the endDate that the user overwrote
                        dispatch({
                            type: 'set-end-date',
                            payload: prevBeginDate
                        });
                    } else if (endDate == null || compareDaysMonthsAndYears(endDate, date) !== 0) {
                        // Else the input date is after existing begindate, or there is no beginDate, input becomes the new endDate
                        dispatch({
                            type: 'set-end-date',
                            payload: date
                        });
                    }
                }
            } else {
                // Input entered is not a valid date
                _setEndInput(rangeMode
                    ? endDate ? displayDateAsString(endDate) : ''
                    : selectedDate ? displayDateAsString(selectedDate) : '');
            }
        } else {
            // No Input was entered
            dispatch({
                type: 'set-end-date',
                payload: null
            });
        }
        onInputDateChange({ selectedDate, beginDate, endDate });
        onDateChange({ selectedDate, beginDate, endDate });
    }
    /** Close the calendar if clicked off. */
    const _handleNonCalendarClick = () => {
        // console.log("Handling click");

        onInputDateChange({ selectedDate, beginDate, endDate });
        onDateChange({ selectedDate, beginDate, endDate });

        if (_calendarDisplay === 'close') {
            if (!disable && !disableCalendar) {
                _setCalendarDisplay(calendarOpenDisplay);
            }
        } else if (canCloseCalendar) {
            _setCalendarDisplay('close');
        }
    }

    /** Upon click off input and not on any children of the input, toggle the Calendar display closed. */
    const _onBlurAll = () => {
        // as blur event fires prior to new focus events, need to wait to see if a child has been focused.
        timer.current = setTimeout(() => {
            // console.log("dealing with blur event");
            _handleNonCalendarClick();
        }, 700);

        return () => timer.current ? clearTimeout(timer.current) : {};
    }

    /** If a child receives focus, do not close the calendar. */
    const _onFocusHandler = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }

    /** Handle keydown events when Fields div is in focus. */
    const _handleKeyDownOverFields = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                _handleNonCalendarClick();
            }
        }
    }

    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        // dispatch({
        //     type: 'set-start-at',
        //     payload: selectedDate
        // });

        if (closeAfterSelection && canCloseCalendar) {
            _setCalendarDisplay('close');
        }
    }

    /** Set styling class based on whether or not the input box has content. */
    const _setInputClass = (filled: boolean) => {
        return filled ? INPUT_CLASS_FILLED : '';
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

    /** Renders second text input field. */
    const _renderEndInput = () => {
        return (
            <div className="field">
                <input type="text"
                    disabled={disable || disableInput}
                    onChange={(e) => _handleEndInputChange(e)}
                    onBlur={() => _onBlurEndInput()}
                    value={_endInput}
                    className={_setInputClass(_endInput !== '')}
                    id={"end-" + id}
                />
                <label
                    htmlFor={"end-" + id}>
                    {endInputLabel}
                </label>
            </div>
        );
    }

    return (
        <div
            onBlur={() => _onBlurAll()}
            onFocus={_onFocusHandler}
            className="datepicker"
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => _handleNonCalendarClick()}
                onKeyDown={(e) => _handleKeyDownOverFields(e)}
                className="fields"
            >
                <div className="field">
                    <input
                        type="text"
                        disabled={disable || disableInput}
                        onChange={(e) => _handleBeginInputChange(e)}
                        onBlur={() => _onBlurBeginInput()}
                        value={_beginInput}
                        className={_setInputClass(_beginInput !== '')}
                        id={"begin-" + id}
                    />
                    <label
                        htmlFor={"begin-" + id}>
                        {rangeMode ? beginInputLabel : singleInputLabel}
                    </label>
                </div>
                {rangeMode ? <span> - </span> : ''}
                {!rangeMode ? '' : _renderEndInput()}
                <button
                    aria-label="Open calendar"
                    className="fields-button"><span></span></button>
            </div>
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

export default Input;