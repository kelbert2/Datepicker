import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef } from 'react';
import DatepickerContext, { DateData, CalendarDisplay } from './DatepickerContext';
import Calendar from './Calendar';
import './Datepicker.css';
import { compareDaysMonthsAndYears, formatDateDisplay } from './CalendarUtils';

type OPEN_STATES = CalendarDisplay | 'close';
const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';
const INPUT_CLASS_FILLED = 'filled';

function Datepicker() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange,
        onDateInput,
        onYearSelected,
        onMonthSelected,
        onDaySelected,

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

        dispatch
    } = useContext(DatepickerContext);
    /** Holds open state of the Calendar. */
    const [_open, _setOpen] = useState((canCloseCalendar ? 'close' : 'inline') as OPEN_STATES);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    const _prevRangeMode = useRef(rangeMode);
    const [_beginInputFilled, _setBeginInputFilled] = useState(false);
    const [_endInputFilled, _setEndInputFilled] = useState(false);


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
        }
    }, [beginDate, dispatch, rangeMode, selectedDate]);


    /** On input click, toggle the Calendar display open or closed. */
    const _handleNonCalendarClick = () => {
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
        console.log('---End date and Display Changed: : ' + endDate);

        if (rangeMode) {
            console.log("End date is not null: " + (endDate ? "true" : "false"));
            _setEndInput(endDate ? displayDateAsString(endDate) : '');
        }
    }, [endDate, rangeMode, displayDateAsString]);

    useEffect(() => {
        console.log("End Input reset: " + _endInput + 'and end date: ' + endDate);
    }, [_endInput, endDate]);

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : '');
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("Handling text event with input: " + event.target.value);
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
                    dispatch({
                        type: 'set-active-date',
                        payload: date
                    });
                }
                if (rangeMode && (beginDate == null || compareDaysMonthsAndYears(beginDate, date) !== 0)) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: date
                    });
                }
                // _setBeginInput(displayDateAsString(date));
                return;
            } else {
                // Input entered is not a valid date
                _setBeginInput(rangeMode
                    ? beginDate ? displayDateAsString(beginDate) : ''
                    : selectedDate ? displayDateAsString(selectedDate) : '');
            }
        } else {
            // No input was entered
            _setBeginInput('');

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
        // if (rangeMode && beginDate) {
        //     // _setBeginInput(displayDateAsString(beginDate));
        //     return;
        // }
        // if (selectedDate) {
        //     // _setBeginInput(displayDateAsString(selectedDate));
        //     return;
        // }
        // _setBeginInput(undefined);
        // _setBeginInput(_beginInput ? displayDateAsString(parseStringToDate(_beginInput)) : undefined);
    }
    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        // TODO: if select out of datepicker before choosing an endDate in rangeMode, will keep previous endInput in display despite the fact that underlying variable has become null
        console.log("---OnBlur: " + _endInput);

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
                        // if the input date is before the existing beginDate, it becomes the new beginDate
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                        // We switch previous beginDate for the endDate that the user overwrote
                        // if (endDate == null) {
                        // if there is no existing endDate, previous beginDate becomes the endDate
                        console.log("OnBlur: no existing end date found.");
                        dispatch({
                            type: 'set-end-date',
                            payload: prevBeginDate
                        });

                        // _setEndInput(displayDateAsString(prevBeginDate));
                        return;
                        // } else {
                        //     // A new value for end Date was typed in here, but will not end up changing the end date, so won't fire an event
                        //     _setEndInput(endDate ? displayDateAsString(endDate) : '');
                        //     return;
                        // }
                    } else if (endDate == null || compareDaysMonthsAndYears(endDate, date) !== 0) {
                        // else input date is after existing begindate, or there is no beginDate, input becomes the new endDate
                        console.log("OnBlur: new end date after begin date.");
                        dispatch({
                            type: 'set-end-date',
                            payload: date
                        });
                        // _setEndInput(displayDateAsString(date));
                        return;
                    }
                }
            } else {
                // Input entered is not a valid date
                console.log("invalid end date " + endDate);
                _setEndInput(rangeMode
                    ? endDate ? displayDateAsString(endDate) : ''
                    : selectedDate ? displayDateAsString(selectedDate) : '');
            }
        } else {
            console.log("no input entered " + _endInput);
            // No Input was entered
            _setEndInput('');

            dispatch({
                type: 'set-end-date',
                payload: null
            });
        }
    }

    /** Set styling class based on whether or not the input box has content. */
    const _setInputClass = (filled: boolean) => {
        // console.log("Styling Class set: " + _endInput);
        return filled ? INPUT_CLASS_FILLED : '';
    }

    const _setBeginInputClass = () => {
        // if (!filled) {
        //     _setBeginInput(undefined);
        // }
        return _setInputClass(_beginInput !== '');
    }
    const _setEndInputClass = () => {
        // if (!filled) {
        //     _setEndInput(undefined);
        // }
        return _setInputClass(_endInput !== '');
    }

    const _handleDateSelectionFromCalendar = (data: DateData) => {
        dispatch({
            type: 'set-start-at',
            payload: selectedDate
        });
        if (rangeMode) {
            console.log("---Handling Calendar Selection: " + data.endDate);

            // _setBeginInput(beginDate ? displayDateAsString(beginDate) : undefined);
            // _setEndInput(endDate ? displayDateAsString(endDate) : undefined);
        } else {
            // _setBeginInput(selectedDate ? displayDateAsString(selectedDate) : undefined);
        }

        if (closeAfterSelection && canCloseCalendar) {
            _setOpen('close');
        }
    }

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

    const _renderEndInput = () => {
        return (
            <div className="field">
                <input type="text"
                    disabled={disable || disableInput}
                    onChange={(e) => _handleEndInputChange(e)}
                    onBlur={() => _onBlurEndInput()}
                    //value={rangeMode ? endDate ? displayDateAsString(endDate) : undefined : undefined}
                    value={_endInput}
                    className={_setEndInputClass()}
                />
                <label>
                    {endInputLabel}
                </label>
            </div>
        );
    }

    return (
        <div>
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
                        className={_setBeginInputClass()}
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

export default Datepicker;