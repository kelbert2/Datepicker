import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef } from 'react';
import DatepickerContext, { DateData, CalendarDisplay } from './DatepickerContext';
import Calendar from './Calendar';
import { compareDaysMonthsAndYears } from './CalendarUtils';

type OPEN_STATES = CalendarDisplay | 'close';
const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';
const INPUT_CLASS_FILLED = 'filled';

function Input() {
    const {
        selectedDate,
        activeDate,

        rangeMode,
        beginDate,
        endDate,

        onDateChange,
        onDateInput,

        disable,
        disableCalendar,
        disableInput,
        calendarDisplay,
        canCloseCalendar,
        closeAfterSelection,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,

        dispatch }
        = useContext(DatepickerContext);

    /** Holds open state of the Calendar. */
    const [_open, _setOpen] = useState((canCloseCalendar ? 'close' : 'inline') as OPEN_STATES);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    const _prevRangeMode = useRef(rangeMode);

    /** Update Calendar open status if allowances change. */
    useEffect(() => {
        if ((disable || disableCalendar) && canCloseCalendar) {
            _setOpen('close');
        } else if (_open !== 'close') {
            _setOpen(calendarDisplay);
        }
    }, [_open, calendarDisplay, canCloseCalendar, disable, disableCalendar]);

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

            onDateInput({ selectedDate: selectedDate, beginDate, endDate });
        }
    }, [beginDate, dispatch, endDate, onDateInput, rangeMode, selectedDate]);

    /** On input click, toggle the Calendar display open or closed. */
    const _handleNonCalendarClick = () => {
        onDateInput({ selectedDate: selectedDate, beginDate, endDate });
        onDateChange({ selectedDate: selectedDate, beginDate, endDate });

        if (_open === 'close') {
            if (!disable || !disableCalendar) {
                _setOpen(calendarDisplay);
            }
        } else if (canCloseCalendar) {
            _setOpen('close');
        }
    }

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
                if (activeDate == null || compareDaysMonthsAndYears(activeDate, date) !== 0) {
                    console.log("resetting active date on input blur: " + date);
                    dispatch({
                        type: 'set-active-date',
                        payload: date
                    });
                }

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
        onDateInput({ selectedDate: selectedDate, beginDate, endDate });

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
                if (activeDate == null || compareDaysMonthsAndYears(activeDate, date) !== 0) {
                    dispatch({
                        type: 'set-active-date',
                        payload: date
                    });
                }

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
        onDateInput({ selectedDate: selectedDate, beginDate, endDate });

    }

    /** Set styling class based on whether or not the input box has content. */
    const _setInputClass = (filled: boolean) => {
        return filled ? INPUT_CLASS_FILLED : '';
    }

    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        dispatch({
            type: 'set-start-at',
            payload: selectedDate
        });

        if (closeAfterSelection && canCloseCalendar) {
            _setOpen('close');
        }
    }

    /** Set Calendar display mode. */
    const _setCalendarClass = () => {
        switch (calendarDisplay) {
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
                />
                <label>
                    {endInputLabel}
                </label>
            </div>
        );
    }

    return (
        <div className="datepicker">
            <div
                onClick={() => _handleNonCalendarClick()}
                className="fields"
            >
                <div className="field">
                    <input type="text"
                        disabled={disable || disableInput}
                        onChange={(e) => _handleBeginInputChange(e)}
                        onBlur={() => _onBlurBeginInput()}
                        value={_beginInput}
                        className={_setInputClass(_beginInput !== '')}
                    />
                    <label>
                        {rangeMode ? beginInputLabel : singleInputLabel}
                    </label>
                </div>
                {rangeMode ? <span> - </span> : ''}
                {!rangeMode ? '' : _renderEndInput()}
                <button>Open</button>
            </div>
            {_open !== 'close' ?
                <Calendar
                    onFinalDateSelection={_handleDateSelectionFromCalendar}
                    classNames={_setCalendarClass()}
                ></Calendar>
                : ''}
            {_open !== 'close' ?
                <div onClick={() => _handleNonCalendarClick()}
                    className="overlay"></div>
                : ''}
        </div>
    );
}

export default Input;