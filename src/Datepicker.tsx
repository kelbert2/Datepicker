import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef } from 'react';
import DatepickerContext, { DateData, CalendarDisplay } from './DatepickerContext';
import Calendar from './Calendar';

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
    const [_beginInput, _setBeginInput] = useState(undefined as string | undefined);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState(undefined as string | undefined);
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
        }
    }, [beginDate, dispatch, rangeMode, selectedDate]);


    /** On input click, toggle the Calendar display open or closed. */
    const _handleInputClick = () => {
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
        if (!rangeMode && selectedDate) {
            _setBeginInput(displayDateAsString(selectedDate));
        }
    }, [selectedDate, rangeMode, displayDateAsString]);
    /** Update first text input display with begin date changes. */
    useLayoutEffect(() => {
        if (rangeMode && beginDate) {
            _setBeginInput(displayDateAsString(beginDate));
        }
    }, [beginDate, rangeMode, displayDateAsString]);
    /** Update second text input display with end date changes. */
    useLayoutEffect(() => {
        if (rangeMode && endDate) {
            _setEndInput(displayDateAsString(endDate));
        }
    }, [endDate, rangeMode, displayDateAsString]);

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : undefined);
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setEndInput((event.target.value.length > 0) ? event.target.value : undefined);
    }
    /** On blur, format first text input and set selected and begin dates. */
    const _onBlurBeginInput = () => {
        if (_beginInput) {
            const date = parseStringToDate(_beginInput);
            if (date != null) {
                if (rangeMode) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: date
                    });
                }
                dispatch({
                    type: 'set-selected-date',
                    payload: date
                });
                dispatch({
                    type: 'set-active-date',
                    payload: date
                });
                _setBeginInput(displayDateAsString(date));
                return;
            }
        }
        if (rangeMode && beginDate) {
            _setBeginInput(displayDateAsString(beginDate));
            return;
        }
        if (selectedDate) {
            _setBeginInput(displayDateAsString(selectedDate));
            return;
        }
        _setBeginInput(undefined);
        // _setBeginInput(_beginInput ? displayDateAsString(parseStringToDate(_beginInput)) : undefined);
    }
    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        // TODO: if select out of datepicker before choosing an endDate in rangeMode, will keep previous endInput in display despite the fact that underlying variable has become null
        if (_endInput) {
            const date = parseStringToDate(_endInput);
            dispatch({
                type: 'set-selected-date',
                payload: date
            });
            dispatch({
                type: 'set-end-date',
                payload: date
            });
            _setEndInput(displayDateAsString(date));
        }
        _setEndInput(undefined);
    }

    /** Set styling class based on whether or not the input box has content. */
    const _setInputClass = (filled: boolean) => {
        return filled ? INPUT_CLASS_FILLED : '';
    }

    const _handleDateSelectionFromCalendar = (data: DateData) => {
        dispatch({
            type: 'set-start-at',
            payload: selectedDate
        });

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
                    value={_endInput}
                    className={_setInputClass(_endInput != null)}
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
                onClick={() => _handleInputClick()}
                className="fields"
            >
                <div className="field">
                    <input type="text"
                        disabled={disable || disableInput}
                        onChange={(e) => _handleBeginInputChange(e)}
                        onBlur={() => _onBlurBeginInput()}
                        value={_beginInput}
                        className={_setInputClass(_beginInput != null)}
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
                <div onClick={() => _handleInputClick()}
                    className="overlay"></div>
                : ''}
        </div>
    );
}

export default Datepicker;