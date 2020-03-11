import React, { useState, ChangeEvent, useRef, useLayoutEffect } from "react";
import { CalendarDisplay, DateData, DatepickerContextProvider } from "./DatepickerContext";
import { formatDateDisplay, parseStringAsDate, compareDaysMonthsAndYears } from "./CalendarUtils";
import Datepicker from "./Datepicker";
import DatepickerProvider from "./DatepickerProvider";
import { OPEN_STATES } from "./Input";

function InputTest() {
    const _rangeMode = true;
    const _disable = false;
    const _disableCalendar = false;
    const _disableInput = false;
    const _calendarOpenDisplay = 'inline';
    const _canCloseCalendar = false;
    const _closeAfterSelection = true;
    const _setCalendarOpen = false;

    const _singleInputLabel = "Selected date:";
    const _beginInputLabel = "Begin date:";
    const _endInputLabel = "End date:";

    const _parseStringToDate = (input: string) => parseStringAsDate(input);
    const _displayDateAsString = (date: Date) => formatDateDisplay(date);

    const [_selectedDate, _setSelectedDate] = useState(null as Date | null);
    const [_beginDate, _setBeginDate] = useState(null as Date | null);
    const [_endDate, _setEndDate] = useState(null as Date | null);

    /** Holds open state of the Calendar. */
    const [_open, _setOpen] = useState(_canCloseCalendar ? false : true);
    /** Input in the first text input. */
    const [_beginInput, _setBeginInput] = useState('' as string);
    /** Input in the second text input. */
    const [_endInput, _setEndInput] = useState('' as string);
    /** UID for inputs and labels. */
    const timer = useRef(null as NodeJS.Timeout | null);

    /** Update first text input display with selected date changes. */
    useLayoutEffect(() => {
        // console.log("selected date change: " + (_selectedDate ? _displayDateAsString(_selectedDate) : 'null'));
        if (!_rangeMode) {
            _setBeginInput(_selectedDate ? _displayDateAsString(_selectedDate) : '');
        }
    }, [_selectedDate, _rangeMode]);
    /** Update first text input display with begin date changes. */
    useLayoutEffect(() => {
        if (_rangeMode) {
            _setBeginInput(_beginDate ? _displayDateAsString(_beginDate) : '');
        }
    }, [_beginDate, _rangeMode]);
    /** Update second text input display with end date changes. */
    useLayoutEffect(() => {
        if (_rangeMode) {
            _setEndInput(_endDate ? _displayDateAsString(_endDate) : '');
        }
    }, [_endDate, _rangeMode]);

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
        // console.log("formatting begin input: " + _beginInput);

        if (_beginInput !== '') {
            const date = _parseStringToDate(_beginInput);
            if (date != null) {
                if (_selectedDate == null || compareDaysMonthsAndYears(_selectedDate, date) !== 0) {
                    _setSelectedDate(date);
                }

                if (_rangeMode) {
                    const prevEndDate = _endDate;
                    if (prevEndDate != null && compareDaysMonthsAndYears(prevEndDate, date) < 0) {
                        // new date is after the existing end date, so switch them
                        _setBeginDate(prevEndDate);
                        _setEndDate(date);
                    } else if (_beginDate == null || compareDaysMonthsAndYears(_beginDate, date) !== 0) {
                        _setBeginDate(date);
                    }
                }
            } else {
                // Input entered is not a valid date
                _setBeginInput(_rangeMode
                    ? _beginDate ? _displayDateAsString(_beginDate) : ''
                    : _selectedDate ? _displayDateAsString(_selectedDate) : '');
            }
        } else {
            // No input was entered
            _setSelectedDate(null);
            if (_rangeMode) {
                _setBeginDate(null);
            }
        }
        // Deal with new selected, begin, and end values.
        // console.log("-- selected date: " + (_selectedDate ? formatDateDisplay(_selectedDate) : "null"));
        // console.log("-- begin date: " + (_beginDate ? formatDateDisplay(_beginDate) : "null"));
        // console.log("-- end date: " + (_endDate ? formatDateDisplay(_endDate) : "null"));
    }

    /** On blur, format second text input and set selected and end dates. */
    const _onBlurEndInput = () => {
        // console.log("formatting end input: " + _endInput);

        if (_endInput !== '') {
            const date = _parseStringToDate(_endInput);
            if (date != null) {
                if (_selectedDate == null || compareDaysMonthsAndYears(_selectedDate, date) !== 0) {
                    _setSelectedDate(date);
                }
                if (_rangeMode) {
                    const prevBeginDate = _beginDate;
                    if (prevBeginDate && compareDaysMonthsAndYears(date, prevBeginDate) < 0) {
                        // If the input date is before the existing beginDate, it becomes the new beginDate
                        _setBeginDate(date);
                        // We switch previous beginDate for the endDate that the user overwrote
                        _setEndDate(prevBeginDate);
                    } else if (_endDate == null || compareDaysMonthsAndYears(_endDate, date) !== 0) {
                        // Else the input date is after existing begindate, or there is no beginDate, input becomes the new endDate
                        _setEndDate(date);
                    }
                }
            } else {
                // Input entered is not a valid date
                _setEndInput(_rangeMode
                    ? _endDate ? _displayDateAsString(_endDate) : ''
                    : _selectedDate ? _displayDateAsString(_selectedDate) : '');
            }
        } else {
            // No Input was entered
            _setEndDate(null);
        }
        // Deal with new selected, begin, and end values.
        // console.log("-- selected date: " + (_selectedDate ? formatDateDisplay(_selectedDate) : "null"));
        // console.log("-- begin date: " + (_beginDate ? formatDateDisplay(_beginDate) : "null"));
        // console.log("-- end date: " + (_endDate ? formatDateDisplay(_endDate) : "null"));
    }

    /** Close the calendar if clicked off. */
    const _handleNonCalendarClick = () => {
        console.log("Handling non calendar click");

        // console.log("-- selected date: " + (_selectedDate ? formatDateDisplay(_selectedDate) : "null"));
        // console.log("-- begin date: " + (_beginDate ? formatDateDisplay(_beginDate) : "null"));
        // console.log("-- end date: " + (_endDate ? formatDateDisplay(_endDate) : "null"));

        // Deal with selected, begin, and end values.

        if (!_open) {
            if (!_disable && !_disableCalendar) {
                _setOpen(true);
            }
        } else if (_canCloseCalendar) {
            _setOpen(false);
        }
    }

    /** Upon click off input and not on any children of the input, toggle the Calendar display closed. */
    const _onBlurAll = () => {
        // as blur event fires prior to new focus events, need to wait to see if a child has been focused.
        timer.current = setTimeout(() => {
            // console.log("dealing with all blur event");
            _handleNonCalendarClick();
        }, 700);

        return () => timer.current ? clearTimeout(timer.current) : {};
    }

    /** If a child receives focus, do not close the calendar. */
    const _onFocusHandler = () => {
        // console.log("recieved focus from child.");
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
        // TODO: make sure startAt dates are being reset in Calendar

        console.log("recieved date from calendar.");

        _setSelectedDate(data.selectedDate);
        _setBeginDate(data.beginDate);
        _setEndDate(data.endDate);

        console.log("-- selected date: " + (data.selectedDate));
        // console.log("-- begin date: " + (data.beginDate));
        // console.log("-- end date: " + (data.endDate));

        if (_closeAfterSelection && _canCloseCalendar) {
            _setOpen(false);
        }
    }

    return (
        <div
            onBlur={() => _onBlurAll()}
            onFocus={_onFocusHandler}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={() => _handleNonCalendarClick()}
                onKeyDown={(e) => _handleKeyDownOverFields(e)}
            >
                <div>
                    <input
                        type="text"
                        disabled={_disable || _disableInput}
                        onChange={(e) => _handleBeginInputChange(e)}
                        onBlur={() => { _onBlurBeginInput() }}
                        value={_beginInput}
                        id="begin-input-date"
                    ></input>
                    <label
                        htmlFor="begin-input-date">
                        {_rangeMode ? _beginInputLabel : _singleInputLabel}
                    </label>
                </div>
                {
                    _rangeMode ?
                        <div>
                            <input type="text"
                                disabled={_disable || _disableInput}
                                onChange={(e) => _handleEndInputChange(e)}
                                onBlur={() => _onBlurEndInput()}
                                value={_endInput}
                                id="end-input-date"
                            />
                            <label
                                htmlFor="end-input-date">
                                {_endInputLabel}
                            </label>
                        </div>
                        : ''
                }
            </div>
            <DatepickerProvider
                selectedDate={_selectedDate}

                onDateChange={(d) => _handleDateSelectionFromCalendar(d)}

                rangeMode={_rangeMode}
                beginDate={_beginDate}
                endDate={_endDate}

                disable={_disable}
                disableCalendar={_disableCalendar}
                disableInput={_disableInput}
                calendarOpenDisplay={_calendarOpenDisplay}
                canCloseCalendar={_canCloseCalendar}
                closeAfterSelection={_closeAfterSelection}
                setCalendarOpen={_open}
            ></DatepickerProvider>
        </div>
    );
}

export default InputTest;