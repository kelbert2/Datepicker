import React, { useState, ChangeEvent, useRef, useLayoutEffect, useCallback } from "react";
import { DateData } from "./DatepickerContext";
import { formatDateDisplay, parseStringAsDate, compareDaysMonthsAndYears, makeDatepickerTheme } from "./CalendarUtils";
import DatepickerProvider from "./DatepickerProvider";

function InputTest() {
    const _rangeMode = true;

    const _disableMonth = false;
    const _disableYear = false;
    const _disableMultiyear = false;

    const _disable = false;
    const _disableCalendar = false;
    const _disableInput = false;
    const _calendarOpenDisplay = 'popup';
    const _canCloseCalendar = true;
    const _closeAfterSelection = true;
    // const _setCalendarOpen = false;

    const _singleInputLabel = "Selected date:";
    const _beginInputLabel = "Begin date:";
    const _endInputLabel = "End date:";

    const dummyDate = new Date();
    const _minDate = new Date(dummyDate.setDate(dummyDate.getDate() - 14)) as Date;
    const _maxDate = new Date(dummyDate.setDate(dummyDate.getDate() + 21)) as Date;
    const _dateFilter = (date: Date | null) => {
        return true
    };

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


    type THEMES = 'salmon' | 'blue' | 'green';
    const _salmonTheme = ({});
    const _greenTheme = makeDatepickerTheme({
        "--color": "rgb(152, 232, 139)",
        "--on-color": "rgb(0,0,0)",
        "--background": "white",
        "--on-neutral": "black",
        "--hover": "rgba(255,200,240, .4)",
        "--hover-range": "rgba(240,240, 100, .25)",
        "--button-border": "var(--hover)",
        "--button-background": "rgba(255,200,240, .2)"
    });
    const _blueTheme = (makeDatepickerTheme({
        "--color": "hsl(186, 90%, 61%)",
        "--background": "rgb(27, 46, 48)",
        "--on-background": "rgb(215,245,255)"
    }));


    const [_themeColor, _setThemeColor] = useState('blue' as THEMES);

    const getTheme = useCallback((theme: THEMES) => {
        // console.log("theme: " + theme);
        switch (theme) {
            case 'blue':
                return _blueTheme;
            case 'green':
                return _greenTheme;
            default:
                return _salmonTheme;
        }
    }, [_blueTheme, _greenTheme, _salmonTheme]);

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

    /** Determine if calendar display closes after precise selected date is chosen from the calendar. */
    const _handleDateSelectionFromCalendar = (data: DateData) => {
        // TODO: make sure startAt dates are being reset in Calendar

        console.log("received date from calendar:");
        console.log(data);

        _setSelectedDate(data.selectedDate);
        _setBeginDate(data.beginDate);
        _setEndDate(data.endDate);

        // console.log("-- selected date: " + (data.selectedDate));
        // console.log("-- begin date: " + (data.beginDate));
        // console.log("-- end date: " + (data.endDate));

        if (_closeAfterSelection && _canCloseCalendar) {
            _setOpen(false);
        }
    }

    // const _onDateChange = (d: DateData) => {
    //     console.log("date change: ");
    //     console.log(d);
    //     _setBeginDate(d.beginDate);
    //     _setEndDate(d.endDate);
    //     _setSelectedDate(d.selectedDate);
    // }
    const _onCalendarDateChange = (d: DateData) => {
        console.log("date change in calendar");
        console.log(d);
        // _setBeginDate(d.beginDate);
        // _setEndDate(d.endDate);
        // _setSelectedDate(d.selectedDate);
    }
    const _onInputDateChange = (d: DateData) => {
        console.log("date change in input");
        // todo: ensure that all input and calendar date changes also fire ondatechange
        // _setBeginDate(d.beginDate);
        // _setEndDate(d.endDate);
        // _setSelectedDate(d.selectedDate);
    }
    const _onDaySelected = (_d: DateData) => {
        console.log("day selected in month view:");
        console.log(_d);

    }
    const _onMonthSelected = (_d: DateData) => {
        // console.log("month selected in year view");
    }
    const _onYearSelected = (_d: DateData) => {
        // console.log("year selected in multiyear view");
    }

    /** On first text input change, update internal state. */
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : '');
    }
    /** On second text input change, update internal state. */
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("End input recieved: ");
        console.log(event.target.value);
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
        console.log("Blurred end input");

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
        // console.log("received focus from child.");
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

                onFinalDateChange={(d) => _handleDateSelectionFromCalendar(d)}
                onDateChange={(d) => _handleDateSelectionFromCalendar(d)}
                onDaySelected={(d) => _onDaySelected(d)}
                onMonthSelected={(d) => _onMonthSelected(d)}
                onYearSelected={(d) => _onYearSelected(d)}

                minDate={_minDate}
                maxDate={_maxDate}
                dateFilter={(d) => _dateFilter(d)}

                rangeMode={_rangeMode}
                beginDate={_beginDate}
                endDate={_endDate}

                disableMonth={_disableMonth}
                disableYear={_disableYear}
                disableMultiyear={_disableMultiyear}

                disable={_disable}
                disableCalendar={_disableCalendar}
                disableInput={_disableInput}
                calendarOpenDisplay={_calendarOpenDisplay}
                canCloseCalendar={_canCloseCalendar}
                closeAfterSelection={_closeAfterSelection}
                setCalendarOpen={_open}

                theme={getTheme(_themeColor)}
            ></DatepickerProvider>
        </div>
    );
}

export default InputTest;