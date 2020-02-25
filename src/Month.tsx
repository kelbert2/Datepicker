import React, { useContext, useState, useEffect, useCallback } from 'react';
import DatepickerContext from './DatepickerContext';
import { DAYS_PER_WEEK, WEEKDAY_NAMES, getYear, getMonth, createDate, getDaysPerMonth, addCalendarYears, addCalendarMonths, addCalendarDays, compareDatesGreaterThan, getDayOfWeek, getFirstDayOfWeek, getMonthNames, compareDates, hasSameMonthAndYear, getFirstDateOfMonthByDate, MONTH_NAMES, getDate, getDay, compareDaysMonthsAndYears } from './CalendarUtils';
import CalendarBody, { ICalendarCell } from './CalendarBody';

function Month() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        dateChange,
        dateInput,
        yearSelected,
        monthSelected,
        daySelected,

        startAt,
        startView,
        firstDayOfWeek,

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
        disableInput,
        popupLarge,

        formatMonthLabel,
        formatMonthText,

        formatYearLabel,
        formatYearText,

        formatMultiyearLabel,
        formatMultiyearText,

        calendarLabel,
        openCalendarLabel,

        nextMonthLabel,
        nextYearLabel,
        nextMultiyearLabel,

        prevMonthLabel,
        prevYearLabel,
        prevMultiyearLabel,

        switchToMonthViewLabel,
        switchToYearViewLabel,
        switchToMultiyearViewLabel,

        dispatch
    } = useContext(DatepickerContext);

    /** Grid of ICalendarCells representing days. */
    const [_days, _setDays] = useState([] as ICalendarCell[][]);
    /** First day of interval. */
    // const [beginDateNumber, setBeginDateNumber] = useState(null as number | null);
    /* Last day of interval. */
    // const [endDateNumber, setEndDateNumber] = useState(null as number | null);
    /** Whenever user already selected start of dates interval. An inner property that avoid asynchronous problems */
    // const [_beginDateSelectedAsync, _setBeginDateSelectedAsync] = useState(null as Date | null);
    /** Whenever full month is inside dates interval. */
    // const [rangeFull, setRangeFull] = useState(false);
    // const  = useState(null as Date | null);
    /** Previous active date. */
    const [_prevActiveDate, _setPrevActiveDate] = useState(activeDate);
    /** The label for this year (e.g. "FEB"). */
    const [_monthLabel, _setMonthLabel] = useState('');
    //  const [calendarCells, setCalendarCells] = useState([] as ICalendarCell[][]);
    /** Number of blank cells before month starts. */
    const [_firstWeekOffset, _setFirstWeekOffset] = useState(0);
    /** Weekday labels. */
    const [_weekdays, _setWeekdays] = useState(WEEKDAY_NAMES);


    /** Run on mount */
    useEffect(() => {
        // constructor
        // dispatch({ type: 'set-active-date', payload: new Date() });

        // init
        //updateRangeSpecificValues();
        // dispatch({ type: 'set-selected-date', payload: getDateInCurrentMonth(selectedDate) });
        // dispatch({ type: 'set-today-date', payload: getDateInCurrentMonth(new Date()) });

        // Rotate the labels for days of the week based on the configured first day of the week.
        _setWeekdays(WEEKDAY_NAMES.slice(firstDayOfWeek).concat(WEEKDAY_NAMES.slice(0, firstDayOfWeek)));

        _populateDays();
        // this._changeDetectorRef.markForCheck();
    }, [firstDayOfWeek]);

    /** Repopulate on activeDate change. */
    useEffect(() => {
        _setMonthLabel(getMonthNames('short')[getMonth(activeDate)].toLocaleUpperCase());

        _populateDays();
    }, [activeDate, _firstWeekOffset]);

    /** Reloads days. */
    const _populateDays = () => {
        const daysInMonth = getDaysPerMonth(getMonth(activeDate));
        let firstOfMonth = createDate(getYear(activeDate), getMonth(activeDate), 1);
        _setFirstWeekOffset((DAYS_PER_WEEK + getDayOfWeek(firstOfMonth) - getFirstDayOfWeek()) % DAYS_PER_WEEK);

        let days = [[]] as ICalendarCell[][];
        for (let i = 0, cell = _firstWeekOffset; i < daysInMonth; i++ , cell++) {
            // const cellClasses = this.dateClass ? this.dateClass(date) : undefined;
            //         this._weeks[this._weeks.length - 1]
            //         .push(new SatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses));
            //   }
            if (cell === DAYS_PER_WEEK) {
                days.push([] as ICalendarCell[]);
                cell = 0;
            }
            days[days.length - 1].push(_createCellForDay(i + 1));
        }
        console.log("days:");
        console.log(days);
        _setDays(days);
    }

    /** Handles when a new day is selected. */
    const _dateSelected = (date: Date) => {
        if (rangeMode) {
            if (!beginDate || date < beginDate) {
                // reset begin selection
                daySelected({ date, beginDate: date, endDate: null });

                dispatch({
                    type: 'set-selected-date', payload: date
                });
                dispatch({
                    type: 'set-begin-date', payload: date
                });
                dispatch({
                    type: 'set-end-date', payload: null
                });

            } else {
                daySelected({ date, beginDate, endDate: date });

                dispatch({
                    type: 'set-selected-date', payload: date
                });
                dispatch({
                    type: 'set-end-date', payload: date
                });
            }
        } else {
            daySelected({ date, beginDate: null, endDate: null });

            dispatch({
                type: 'set-selected-date', payload: date
            });
        }
        // if (rangeMode) {
        //     if (_beginDateSelectedAsync) {
        //         _setBeginDateSelectedAsync(selectedDate);
        //         // selectedChange(newSelectedDate);
        //     } else {
        //         _setBeginDateSelectedAsync(null);
        //         //  selectedChange(newSelectedDate); // TODO: check if the order matters
        //         userSelection();
        //     }
        //     selectedChange(date);
        //     // createWeekCells();
        //     dispatch({ type: 'set-active-date', payload: date });
        //     // focusActiveCell();
        // } else if (selectedDate !== date && selectedDate) {
        //     selectedChange(selectedDate);
        //     userSelection();
        //     //  createWeekCells();
        // }
        _populateDays();
    }

    /** Handles keydown events on the calendar body when calendar is in month view. */
    const _handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        const { keyCode } = event;
        // const isRtl = isRtl();
        const isRtl = false;

        switch (keyCode) {
            // case 13: {// Enter
            // }
            case 32: { // SPACE
                if (!dateFilter || dateFilter(activeDate)) {
                    // dateSelected(getDay(activeDate));
                    _dateSelected(activeDate);
                    // if (!_beginDateSelectedAsync) {
                    //     userSelection();
                    //     //  }
                    //     // if (beginDateSelected || closeAfterSelection) {
                    //     //focusActiveCell();
                    // }
                    event.preventDefault();
                }
                break;
            }
            case 33: { // PAGE_UP
                dispatch({
                    type: 'set-active-date', payload: event.altKey ?
                        addCalendarYears(activeDate, -1) :
                        addCalendarMonths(activeDate, -1)
                });
                break;
            }
            case 34: { // PAGE_DOWN
                dispatch({
                    type: 'set-active-date', payload: event.altKey ?
                        addCalendarYears(activeDate, 1) :
                        addCalendarMonths(activeDate, 1)
                });
                break;
            }
            case 35: { // END
                dispatch({
                    type: 'set-active-date', payload: addCalendarDays(activeDate,
                        (getDaysPerMonth(getMonth(activeDate)) - getDay(activeDate)))
                })
                break;
            }
            case 36: { // HOME
                dispatch({
                    type: 'set-active-date', payload: addCalendarDays(activeDate,
                        (1 - getDay(activeDate)))
                })
                break;
            }
            case 37: { // LEFT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarDays(activeDate, isRtl ? 1 : -1) });
                break;
            }
            case 38: { // UP_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarDays(activeDate, -DAYS_PER_WEEK) });
                break;
            }
            case 39: { // RIGHT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarDays(activeDate, isRtl ? -1 : 1) });
                break;
            }
            case 40: { // DOWN_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarDays(activeDate, DAYS_PER_WEEK) });
                break;
            }
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // TODO: check if should be Greater Than or just any nonzero when compared
        if (compareDatesGreaterThan(_prevActiveDate, activeDate)) {
            // activeDateChange(activeDate);
            _setPrevActiveDate(activeDate);
        }

        _focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', _handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', _handleUserKeyPress);
        };
    }, [_handleUserKeyPress]);

    /** Returns flat index (not row, column) of active cell. */
    const _getActiveCell = () => {
        return getDay(activeDate) - 1;
    }

    /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // CalendarBody._focusActiveCell();
    }

    /** Creates an ICalendarCell for a given day (one-based, not zero-based) */
    const _createCellForDay = (day: number): ICalendarCell => {
        const date = createDate(getYear(activeDate), getMonth(activeDate), day);
        // const ariaLabel = this._dateAdapter.format(
        //      createDate(getYear(activeDate), getMonth(activeDate), day), 
        //      _dateFormats.display.dateA11yLabel);
        // const dateNames = getDateNames();
        // displayValue = dateNames[i];

        return {
            cellIndex: day - 1,
            value: date,
            displayValue: '' + day,
            ariaLabel: '' + day,
            enabled: _shouldEnableDay(date)
        } as ICalendarCell;
    }

    /** Date filter for the month */
    const _shouldEnableDay = (date: Date) => {
        return !!date &&
            (!dateFilter || dateFilter(date)) &&
            (!minDate || compareDates(date, minDate) >= 0) &&
            (!maxDate || compareDates(date, maxDate) <= 0);
    }

    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    const _getDateInCurrentMonth = (date: Date | null) => {
        return date && hasSameMonthAndYear(date, activeDate) ?
            getDate(date) : null;
        //  this._dateAdapter.getDate(date) : null;
    }

    /** Determines whether the user has the RTL layout direction. */
    // const isRtl = () => {
    //     return this._dir && this._dir.value === 'rtl';
    // }

    /** Returns true if all cells are within the beginDate and endDate range. */
    const _isRangeFull = () => {
        if (rangeMode && beginDate && endDate) {
            return getFirstDateOfMonthByDate(activeDate) > beginDate
                && createDate(getYear(activeDate), getMonth(activeDate), getDaysPerMonth(getMonth(activeDate))) < endDate;
        }
        return false;
    }

    /** Updates range full parameter on each begin or end of interval update.
     * Necessary to display calendar-body correctly
     */
    // const updateRangeSpecificValues = () => {
    //     if (rangeMode) {
    //         setBeginDateNumber(_getDateInCurrentMonth(beginDate));
    //         setEndDateNumber(_getDateInCurrentMonth(endDate));
    //         setRangeFull((beginDate && endDate
    //             && !beginDateNumber
    //             && !endDateNumber
    //             && compareDates(beginDate, activeDate) <= 0
    //             && compareDates(activeDate, endDate) <= 0) ? true : false);
    //     } else {
    //         setBeginDateNumber(null);
    //         setEndDateNumber(null);
    //         setRangeFull(false);
    //     }
    // }

    // const createDays = () => {
    //     const daysInMonth = getDaysPerMonth(month, year);
    //     // const dateNames = this._dateAdapter.getDateNames();
    //     let weeks = [[]] as [JSX.Element[]];
    //     const firstDayOfMonth = getFirstDateOfMonth(month, year);
    //     const firstWeekOffset = getFirstWeekOffset(firstDayOfMonth);
    //     for (let i = 0, cell = firstWeekOffset; i < daysInMonth; i++ , cell++) {
    //         if (cell === DAYS_PER_WEEK) {
    //             // created a week, move to the next row
    //             weeks.push([]);
    //             cell = 0;
    //         }
    //         // const date = createDate(getYear(firstDayOfMonth), getMonth(firstDayOfMonth), i + 1);
    //         // const enabled = this._shouldEnableDate(date);
    //         // const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
    //         // const cellClasses = this.dateClass ? this.dateClass(date) : undefined;

    //         //     weeks[weeks.length - 1]
    //         //         .push(new Cell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses));
    //         weeks[weeks.length - 1].push(
    //             createDay(cell, i)
    //         );
    //     }
    //     setDays(weeks);
    // }

    // const createWeek = (days: JSX.Element[], index: number) => {
    //     return (
    //         <tr>
    //             {days.map((day, dayIndex) => { return day; })}
    //         </tr>
    //     )
    // }
    // const createDay = (weekdayIndex: number, dayOfMonth: number) => {
    //     return (
    //         <td><Day
    //             dayLabel={WEEKDAY_NAMES[weekdayIndex].short}
    //             date={createDate(year, month, dayOfMonth)}
    //         ></Day></td>
    //         // key={getDateISO(createDate(year, month, dayOfMonth))}
    //     );
    // }

    // const renderDays = () => {
    //     createDays();
    //     return (
    //         <tr
    //             className="days">
    //             {days.map((week, weekIndex) => {
    //                 return createWeek(week, weekIndex);
    //             })}
    //             <td></td>
    //         </tr>
    //     );
    // };

    return (
        <table role="presentation">
            {/* <tr>
            <td>{formatMonthText(createDate(year, month))}</td>
        </tr> */}
            <thead>
                <tr
                    className="week-labels">
                    {_weekdays.map(dayLabel => (
                        <th
                            key={dayLabel.long}>
                            {dayLabel.short}
                        </th>
                    ))}
                </tr>
                <tr>
                    <th colSpan={7} aria-hidden="true" className="divider"></th>
                </tr>

            </thead>
            {/* {renderDays()} */}
            <CalendarBody
                rows={_days}
                labelText={_monthLabel}
                labelMinRequiredCells={3}
                selectedValueChange={_dateSelected}
                compare={compareDaysMonthsAndYears}
                beginDateSelected={false}
                isBeforeSelected={false}
                isCurrentMonthBeforeSelected={selectedDate ? getMonth(activeDate) > getMonth(selectedDate) : false}
                isRangeFull={_isRangeFull()}
                activeCell={_getActiveCell()}
                numCols={7}
                cellAspectRatio={1}
            ></CalendarBody>
            {/* 
            beginDateSelected: _beginDateSelectedAsync ? true : false, 
            isBeforeSelected: (_beginDateSelectedAsync && compareDates(activeDate, _beginDateSelectedAsync) < 0) ? true : false,
            */}
        </table>
    );
}

export default Month;