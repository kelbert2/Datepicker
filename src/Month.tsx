import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DatepickerContext } from './DatepickerContext';
import { DAYS_PER_WEEK, WEEKDAY_NAMES, getYear, getMonth, createDate, getDaysPerMonth, addCalendarYears, addCalendarMonths, addCalendarDays, getDayOfWeek, compareDates, getFirstDateOfMonthByDate, getDay, compareDaysMonthsAndYears } from './CalendarUtils';
import CalendarBody, { ICalendarCell } from './CalendarBody';

function Month({
    dateSelected = (date: Date) => { },
    disableAll = false
}: {
    dateSelected: (date: Date) => {} | void,
    disableAll: boolean
}) {
    const {
        activeDate,

        onDaySelected,

        firstDayOfWeek,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate,

        formatMonthText,

        dispatch
    } = useContext(DatepickerContext);

    /** Grid of ICalendarCells representing days. */
    const [_days, _setDays] = useState([] as ICalendarCell[][]);
    /** The text label for this year (e.g. "FEB"). */
    const [_monthText, _setMonthText] = useState('');
    /** Previous active date. */
    const _prevActiveDate = useRef(activeDate);
    /** Number of blank cells before month starts. */
    const [_firstWeekOffset, _setFirstWeekOffset] = useState(0);
    /** Weekday labels. */
    const [_weekdays, _setWeekdays] = useState(WEEKDAY_NAMES);

    /** Date filter for the month. */
    const _shouldEnableDay = useCallback((date: Date) => {
        return !!date && !disableAll &&
            (!dateFilter || dateFilter(date)) &&
            (!minDate || compareDates(date, minDate) >= 0) &&
            (!maxDate || compareDates(date, maxDate) <= 0);
    }, [dateFilter, maxDate, minDate, disableAll]);

    /** Creates an ICalendarCell for a given day (one-based, not zero-based). */
    const _createCellForDay = useCallback((day: number) => {
        const date = createDate(getYear(activeDate), getMonth(activeDate), day);
        // const ariaLabel = this._dateAdapter.format(
        //      createDate(getYear(activeDate), getMonth(activeDate), day), 
        //      _dateFormats.display.dateA11yLabel);
        // const dateNames = getDateNames();
        // displayValue = dateNames[i];

        return {
            value: date,
            displayValue: '' + day,
            ariaLabel: '' + day,
            enabled: _shouldEnableDay(date)
        } as ICalendarCell;
    }, [_shouldEnableDay, activeDate]);


    /** Reloads days. */
    const _populateDays = useCallback(() => {
        const daysInMonth = getDaysPerMonth(getMonth(activeDate));
        let firstOfMonth = createDate(getYear(activeDate), getMonth(activeDate), 1);
        _setFirstWeekOffset((DAYS_PER_WEEK + getDayOfWeek(firstOfMonth) - firstDayOfWeek) % DAYS_PER_WEEK);

        let days = [[]] as ICalendarCell[][];
        for (let i = 0, cell = _firstWeekOffset; i < daysInMonth; i++ , cell++) {
            if (cell === DAYS_PER_WEEK) {
                days.push([] as ICalendarCell[]);
                cell = 0;
            }
            days[days.length - 1].push(_createCellForDay(i + 1));
        }
        _setDays(days);
    }, [_createCellForDay, _firstWeekOffset, activeDate, firstDayOfWeek]);

    /** Runs setup on mount. */
    useEffect(() => {
        // constructor
        // dispatch({ type: 'set-active-date', payload: new Date() });

        // init
        //updateRangeSpecificValues();
        // dispatch({ type: 'set-today-date', payload: getDateInCurrentMonth(new Date()) });

        // Rotate the labels for days of the week based on the configured first day of the week.
        _setWeekdays(WEEKDAY_NAMES.slice(firstDayOfWeek).concat(WEEKDAY_NAMES.slice(0, firstDayOfWeek)));

        _populateDays();
        // this._changeDetectorRef.markForCheck();
    }, [_populateDays, firstDayOfWeek]);

    /** Repopulates on activeDate change. */
    useEffect(() => {
        _setMonthText(formatMonthText(activeDate));

        _populateDays();
    }, [activeDate, _firstWeekOffset, formatMonthText, _populateDays]);

    /** Handles when a new day is selected. */
    const _dateSelected = useCallback((cellValue: Date) => {
        dateSelected(cellValue);
        // _populateDays();
    }, [dateSelected]);

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
        if (compareDates(_prevActiveDate.current, activeDate) > 0) {
            // activeDateChange(activeDate);
            _prevActiveDate.current = activeDate;
        }

        _focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }, [_dateSelected, activeDate, dateFilter, dispatch]);

    useEffect(() => {
        window.addEventListener('keydown', _handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', _handleUserKeyPress);
        };
    }, [_handleUserKeyPress]);

    /** Convert a given date to a day cell index. */
    const _dateToCellIndex = useCallback((date: Date) => {
        if (getYear(date) < getYear(activeDate) || getMonth(date) < getMonth(activeDate)) {
            return -1;
        }
        if (getYear(date) > getYear(activeDate) || getMonth(date) > getMonth(activeDate)) {
            return 32;
        }
        return getDay(date) - 1;
    }, [activeDate]);

    /** Returns flat index (not row, column) of active cell. */
    const _getActiveCell = () => {
        return getDay(activeDate) - 1;
    }

    // TODO: Clean this up.
    /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // CalendarBody._focusActiveCell();
    }

    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    // const _getDateInCurrentMonth = (date: Date | null) => {
    //     return date && hasSameMonthAndYear(date, activeDate) ?
    //         getDate(date) : null;
    //     //  _dateAdapter.getDate(date) : null;
    // }

    // /** Determines whether the user has the RTL layout direction. */
    // const isRtl = () => {
    //     // return _dir && _dir.value === 'rtl';
    //     return false;
    // }

    /** Returns true if all cells are within the beginDate and endDate range. */
    const _isRangeFull = () => {
        if (rangeMode && beginDate && endDate) {
            return getFirstDateOfMonthByDate(activeDate) > beginDate
                && createDate(getYear(activeDate), getMonth(activeDate), getDaysPerMonth(getMonth(activeDate))) < endDate;
        }
        return false;
    }

    return (
        <table
            role="grid">
            <thead>
                <tr
                    className="week-labels">
                    {_weekdays.map(dayLabel => (
                        <th scope="col"
                            key={dayLabel.long}>
                            {dayLabel.short}
                        </th>
                    ))}
                </tr>
                <tr>
                    <th colSpan={7} aria-hidden="true" className="divider"></th>
                </tr>
            </thead>

            <CalendarBody
                rows={_days}
                labelText={_monthText}
                labelMinRequiredCells={3}
                selectedValueChange={_dateSelected}
                compare={compareDaysMonthsAndYears}
                dateSelected={onDaySelected}
                createDateFromSelectedCell={(date: Date) => { return date }}
                dateToCellIndex={(date) => _dateToCellIndex(date)}
                isRangeFull={_isRangeFull()}
                handleUserKeyPress={(e) => _handleUserKeyPress(e)}
                activeCell={_getActiveCell()}
                numCols={7}
                cellAspectRatio={1}
            ></CalendarBody>
        </table >
    );
}

export default Month;