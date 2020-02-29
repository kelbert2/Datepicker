import React, { useContext, useState, ChangeEvent, useEffect, useLayoutEffect, useRef } from 'react';
import DatepickerContext, { DateData } from './DatepickerContext';
import Calendar from './Calendar';
import { formatDateDisplay } from './CalendarUtils';

type OPEN_STATES = 'popup' | 'large' | 'inline' | 'close';

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
        disablePopup,
        disableCalendar,
        disableInput,
        popupLarge,
        closeAfterSelection,
        canCloseCalendar,

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
        } else if (disablePopup) {
            _setOpen('inline');
        }
        if (_open !== 'close' && !disablePopup) {
            _setOpen(popupLarge ? 'large' : 'popup');
        }
    }, [disable, disablePopup, popupLarge, _open, disableCalendar, canCloseCalendar]);

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
                _setOpen(disablePopup ? 'inline' : popupLarge ? 'large' : 'popup');
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
        return filled ? 'filled' : '';
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
        return disablePopup ? 'inline' : popupLarge ? 'popup-large' : 'popup';
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
        </div>
    );
}

export default Datepicker;