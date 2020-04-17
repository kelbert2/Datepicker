import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef } from 'react';
import { DateData, CalendarDisplay, DatepickerContext, InputContext } from './DatepickerContext';
import Calendar from './Calendar';
import { compareDaysMonthsAndYears, compareDates, stagnantDate } from './CalendarUtils';

export type OPEN_STATES = CalendarDisplay | 'close';
const CALENDAR_CLASS_INLINE = 'inline';
const CALENDAR_CLASS_POPUP = 'popup';
const CALENDAR_CLASS_POPUP_LARGE = 'popup-large';
const INPUT_CLASS_FILLED = 'filled';
// both work

// done last commit.
// no, it works
function Input({ id }: { id: string }) {
    const {
        selectedDate,

        rangeMode,
        beginDate,
        endDate,

        minDate,
        maxDate,
        dateFilter,

        onDateChange,
        onFinalDateChange,
        onCalendarDateChange,

        disable,
        disableCalendar,
        calendarOpenDisplay,
        canCloseCalendar,
        closeAfterSelection,
        setCalendarOpen,

        dispatch
    } = useContext(DatepickerContext);

    const {
        onInputDateChange,
        disableInput,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,
    } = useContext(InputContext);

    /** Holds open state of the Calendar. */
    const [_calendarDisplay, _setCalendarDisplay] = useState((canCloseCalendar ? 'close' : 'inline') as OPEN_STATES);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    /** Timer to avoid on focus respose not running because seen after on blur. */
    const timer = useRef(null as NodeJS.Timeout | null);

    /** Timer to avoid on focus respose not running because seen after on blur. */
    const wrapperTimer = useRef(null as NodeJS.Timeout | null);

    /** Previous rangeMode value. */
    const _prevRangeMode = useRef(rangeMode);
    // const [prevRangeMode, _setPrevRangeMode] = useState(rangeMode);
    /** Previous minDate value. */
    const _prevMinDate = useRef(null as Date | null);
    /** Previous maxDate value. */
    const _prevMaxDate = useRef(null as Date | null);
    /** Previous dateFilter function. */
    const _prevDateFilter = useRef(dateFilter);

    const [_focusOnCalendar, _setFocusOnCalendar] = useState(false);
    const [_focusOnInput, _setFocusOnInput] = useState(false);

    useEffect(() => {
        console.log("New cal open display seen in context: " + calendarOpenDisplay);
    }, [calendarOpenDisplay]);

    /** Update Calendar open status if allowances change. */
    // TODO: Think harder about this. May want to keep a prev can close calendar value so will automatically open if it cannot be closed
    useEffect(() => {
        console.log("open status allowances changed");
        if ((disable || disableCalendar) && canCloseCalendar) {
            // If calendar is disabled and can close it, close it.
            _setCalendarDisplay('close');
        } else if (_calendarDisplay !== 'close' || setCalendarOpen) {
            // if calendar isn't disabled or you you can't close it
            _setCalendarDisplay(calendarOpenDisplay);
        }
    }, [_calendarDisplay, calendarOpenDisplay, canCloseCalendar, disable, disableCalendar, setCalendarOpen]);
    // useEffect(() => {
    //     console.log("selected date change!");
    //     dispatch({
    //         type: 'set-selected-date',
    //         payload: selectedDate
    //     });
    // }, [selectedDate, dispatch]);
    // TODO: on rangemode change, the selected date is not becoming the begin date.
    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
        // console.log("past: " + _prevRangeMode.current);
        // console.log("current: " + rangeMode);
        // console.log("state past: " + prevRangeMode);
        if (rangeMode !== _prevRangeMode.current) {
            // console.log("rangemode change!");
            let select = selectedDate, begin = beginDate, end = endDate;
            if (rangeMode) {
                // console.log("setting begin date to selected date:");
                // console.log(selectedDate);
                // !beginDate
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
            // console.log("updating past values");
            _prevRangeMode.current = rangeMode;
            // _setPrevRangeMode(rangeMode);
            // onInputDateChange({ selectedDate: selectedDate, beginDate, endDate });
            // onDateChange({ selectedDate, beginDate, endDate });          onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
            onInputDateChange({ selectedDate: select, beginDate: begin, endDate: end });
            onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
            onFinalDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        }
    }, [rangeMode, beginDate, dispatch, endDate, onDateChange, onInputDateChange, selectedDate]);
    //TODO: move these or get it to update input quicker
    /** On minDate change, check if any values are too low as to be invalid. */
    useEffect(() => {
        if (minDate !== _prevMinDate.current && minDate) {
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
                onFinalDateChange({ selectedDate: select || selectedDate, beginDate: begin || beginDate, endDate: end || endDate });
            }
            _prevMinDate.current = minDate;
        }
    }, [minDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);
    /** On maxDate change, check if any values are too high as to be invalid. */
    useEffect(() => {
        if (maxDate !== _prevMaxDate.current) {
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
                onInputDateChange({ selectedDate, beginDate, endDate });
                onDateChange({ selectedDate, beginDate, endDate });
                onFinalDateChange({ selectedDate, beginDate, endDate });
            }
            _prevMaxDate.current = maxDate;
        }
    }, [maxDate, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);
    /** On date filter change, check if any values are invalid. */
    // TODO : update with new date filter checking
    useEffect(() => {
        if (dateFilter != null && dateFilter(stagnantDate) !== _prevDateFilter.current(stagnantDate)) {
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
                onFinalDateChange({ selectedDate: select, beginDate: begin, endDate: end });
            }
        }
    }, [dateFilter, beginDate, dispatch, endDate, rangeMode, selectedDate, onInputDateChange, onDateChange]);

    /** Update first text input display with selected date changes. */
    useLayoutEffect(() => {
        if (!rangeMode) {
            _setBeginInput(selectedDate ? displayDateAsString(selectedDate) : '');
        }
    }, [selectedDate, rangeMode, displayDateAsString]);

    useEffect(() => {
        console.log("Saw begindate change!: " + beginDate?.getDate());
    }, [beginDate]);

    /** Update first text input display with begin date changes. */
    // TODO: Should this have displayDateAsString(stagnantDate) instead?
    useLayoutEffect(() => {
        if (rangeMode) {
            console.log("Setting begin input with: " + beginDate?.getDate());
            _setBeginInput(beginDate ? displayDateAsString(beginDate) : '');
        }
    }, [beginDate, rangeMode, displayDateAsString]);
    /** Update second text input display with end date changes. */
    useLayoutEffect(() => {
        if (rangeMode) {
            console.log("Setting end input with: " + endDate?.getDate());
            _setEndInput(endDate ? displayDateAsString(endDate) : '');
        }
    }, [endDate, rangeMode, displayDateAsString]);

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("new begin input: " + event.target.value);
        _setBeginInput((event.target.value.length > 0) ? event.target.value : '');
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setEndInput((event.target.value.length > 0) ? event.target.value : '');
    }

    /** On blur, format first text input and set selected and begin dates. */
    const _onBlurBeginInput = () => {
        console.log("blurring begin input");
        // if (!_focusOnCalendar) {
        let select = selectedDate as Date | null, begin = beginDate as Date | null, end = endDate as Date | null;
        if (_beginInput !== '') {
            const date = parseStringToDate(_beginInput);
            console.log("parsed begin date: ");
            console.log(date);

            if (date != null) {
                if (selectedDate == null || compareDaysMonthsAndYears(selectedDate, date) !== 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: date
                    });
                    select = date;
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
                        begin = prevEndDate;
                        end = date;
                    } else if (beginDate == null || compareDaysMonthsAndYears(beginDate, date) !== 0) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                        begin = date;
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
            select = null;
            if (rangeMode) {
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                begin = null;
            }
        }
        onInputDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        onFinalDateChange({ selectedDate: select, beginDate: begin, endDate: end });

        // _setCalendarDisplay('close');
        // }
    }
    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        console.log("== current beginDate: " + beginDate?.getDate());
        // if (!_focusOnCalendar) {
        let select = selectedDate as Date | null, begin = beginDate as Date | null, end = endDate as Date | null;
        if (_endInput !== '') {
            const date = parseStringToDate(_endInput);
            console.log("parsed end date: ");
            console.log(date);

            if (date != null) {
                if (selectedDate == null || compareDaysMonthsAndYears(selectedDate, date) !== 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: date
                    });
                    select = date;
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

                        begin = date;
                        end = prevBeginDate;
                    } else if (endDate == null || compareDaysMonthsAndYears(endDate, date) !== 0) {
                        // Else the input date is after existing begindate, or there is no beginDate, input becomes the new endDate
                        dispatch({
                            type: 'set-end-date',
                            payload: date
                        });
                        end = date;
                    }
                }
            } else {
                // Input entered is not a valid date
                _setEndInput(rangeMode
                    ? endDate ? displayDateAsString(endDate) : ''
                    : selectedDate ? displayDateAsString(selectedDate) : '');
            }
        } else {
            // No input was entered
            dispatch({
                type: 'set-end-date',
                payload: null
            });
            end = null;
        }
        onInputDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        onDateChange({ selectedDate: select, beginDate: begin, endDate: end });
        onFinalDateChange({ selectedDate: select, beginDate: begin, endDate: end });

        // _setCalendarDisplay('close');
        // }
    }
    /** Close the calendar if clicked off. */
    const _toggleCalendarOpenClosed = () => {

        // console.log("TOGGLE");
        onInputDateChange({ selectedDate, beginDate, endDate });
        onDateChange({ selectedDate, beginDate, endDate });

        if (_calendarDisplay === 'close') {
            _openCalendar();
        } else {
            _closeCalendar();
        }
    }

    const _openCalendar = () => {
        if (!disable && !disableCalendar) {
            // console.log("opening calendar");
            _setCalendarDisplay(calendarOpenDisplay);
        }
    }
    const _closeCalendar = () => {
        if (canCloseCalendar) {
            // console.log("closing calendar");
            _setCalendarDisplay('close');
        }
    }

    /** Upon click off input and not on any children of the input, toggle the Calendar display closed. */
    const _onBlurAll = () => {
        // as blur event fires prior to new focus events, need to wait to see if a child has been focused.
        timer.current = setTimeout(() => {
            // console.log("BLUR ALL");
            // _handleNonCalendarClick();
            _closeCalendar();
        }, 700);

        return () => timer.current ? clearTimeout(timer.current) : {};
    }

    /** If a child receives focus, do not close the calendar. */
    const _onFocusHandler = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }

    // const _onBlurCalendarWrapper = () => {
    //     wrapperTimer.current = setTimeout(() => {
    //         // _handleNonCalendarClick();
    //         // closeCalendar();
    //         _setFocusOnCalendar(false);
    //     }, 700);

    //     return () => timer.current ? clearTimeout(timer.current) : {};
    // }
    // const _onFocusCalendarWrapper = () => {
    //     if (wrapperTimer.current) {
    //         clearTimeout(wrapperTimer.current);
    //         _setFocusOnCalendar(true);
    //     }
    // }

    /** Handle keydown events when Fields div is in focus. */
    const _handleKeyDownOverFields = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                _onBlurBeginInput();
                _onBlurEndInput();
                _closeCalendar();
            }
        }
    }
    /** Handle keydown events when Fields div is in focus. */
    const _handleKeyDownOverBeginInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                _onBlurBeginInput();
                _closeCalendar();
            }
        }
    }
    /** Handle keydown events when Fields div is in focus. */
    const _handleKeyDownOverEndInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = event;
        switch (keyCode) {
            case 13: { // Enter
                console.log("== saw enter key over end input");
                _onBlurEndInput();
                _closeCalendar();
            }
        }
    }

    /** Report date change in calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        // dispatch({
        //     type: 'set-start-at',
        //     payload: selectedDate
        // });

        onCalendarDateChange(data);
        onDateChange(data);
    }
    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleFinalDateSelectionFromCalendar = (data: DateData) => {
        console.log("final date change from calendar");
        console.log("enddate: " + data.endDate?.getDate());

        onFinalDateChange(data);

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

    /** Replace styles with input. */
    // const _applyTheme = useCallback(() => {
    //     for (let key in theme) {
    //         const value = (theme as any)[key];
    //         document.documentElement.style.setProperty(key, value);
    //     }
    // }, [theme]);

    // const _applyThemeGlobal = (theme: string[]) => {
    //     const root = document.getElementsByTagName('html')[0];
    //     root.style.cssText = theme.join(';');
    // }

    // /** When style inputs change, update css. */
    // // useLayoutEffect(() => {
    //     //     _applyTheme();
    //     // }, [_applyTheme]);
    //     // Object.keys(theme).forEach(key => {
    //     //     const value = (theme as any)[key];
    //     //     document.documentElement.style.setProperty(key, value);
    //     // });
    //     // _applyThemeGlobal(blueThemeArray);
    // // });
    // useLayoutEffect(() => {
    //     // Object.keys(theme).forEach(key => {
    //     //     const value = (theme as any)[key];
    //     //     document.documentElement.style.setProperty(key, value);
    //     // });
    //     _applyThemeGlobal(blueThemeArray);
    // }, [theme]);

    /** Renders second text input field. */
    const _renderEndInput = () => {
        return (
            <div className="field">
                <input type="text"
                    disabled={disable || disableInput}
                    onChange={_handleEndInputChange}
                    onBlur={_onBlurEndInput}
                    onKeyDown={_handleKeyDownOverEndInput}
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
            onBlur={_onBlurAll}
            onFocus={_onFocusHandler}
            className="datepicker"
            id={id}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={_toggleCalendarOpenClosed}
                // onKeyDown={_handleKeyDownOverFields}
                className="fields"
            >
                <div className="field">
                    <input
                        type="text"
                        disabled={disable || disableInput}
                        onChange={_handleBeginInputChange}
                        onBlur={_onBlurBeginInput}
                        onKeyDown={_handleKeyDownOverBeginInput}
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
                    className="fields-button">
                    <span></span>
                </button>
            </div>
            <div className="calendar-wrapper"
            // onBlur={_onBlurCalendarWrapper}
            // onFocus={_onFocusCalendarWrapper}
            >
                {
                    _calendarDisplay !== 'close' ?
                        <Calendar
                            onDateSelection={_handleDateSelectionFromCalendar}
                            onFinalDateSelection={_handleFinalDateSelectionFromCalendar}
                            classNames={_setCalendarClass()}
                            disableCalendar={disable || disableCalendar}
                        ></Calendar>
                        : ''
                }
            </div>
            {
                _calendarDisplay === 'popup-large' ?
                    <div role="presentation"
                        onClick={_closeCalendar}
                        className="overlay"></div>
                    : ''
            }
        </div>
    );
}

export default Input;