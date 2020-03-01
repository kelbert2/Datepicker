import DatepickerContext from './DatepickerContext';
import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import CalendarBody, { ICalendarCell } from './CalendarBody';
import { getYear, createDate, addCalendarMonths, getMonth, addCalendarYears, compareDates, getYearName, MONTH_NAMES, addCalendarDays, MONTHS_PER_ROW, compareMonthsAndYears } from './CalendarUtils';


function Year({ dateSelected = (date: Date) => { } }: { dateSelected: (date: Date) => {} | void }) {
    const {
        activeDate,

        onMonthSelected,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate,

        formatYearLabel,

        dispatch
    } = useContext(DatepickerContext);

    /** Grid of ICalendarCells representing the months of the year. */
    const [_months, _setMonths] = useState([] as ICalendarCell[][]);
    /** The text label for this year (e.g. "2017"). */
    const [_yearText, _setYearText] = useState(getYearName(activeDate));
    /** Previous active date. */
    const _prevActiveDate = useRef(activeDate);

    /** Tests whether the combination month/ year is after maxDate, considering just the month and year of maxDate. */
    const _isYearAndMonthAfterMaxDate = useCallback((year: number, month: number) => {
        if (maxDate) {
            const maxYear = getYear(maxDate);
            const maxMonth = getMonth(maxDate);

            return year > maxYear || (year === maxYear && month > maxMonth);
        }
        return false;
    }, [maxDate]);

    /** Tests whether the combination month/ year is before minDate, considering just the month and year of minDate. */
    const _isYearAndMonthBeforeMinDate = useCallback((year: number, month: number) => {
        if (minDate) {
            const minYear = getYear(minDate);
            const minMonth = getMonth(minDate);

            return year < minYear || (year === minYear && month < minMonth);
        }
        return false;
    }, [minDate]);

    /** Whether the given month is enabled. */
    const _shouldEnableMonth = useCallback((month: number) => {
        const activeYear = getYear(activeDate);

        if (month == null ||
            _isYearAndMonthAfterMaxDate(activeYear, month) ||
            _isYearAndMonthBeforeMinDate(activeYear, month)) {
            return false;
        }

        if (!dateFilter) {
            return true;
        }
        const firstOfMonth = createDate(activeYear, month, 1);
        // If any date in the month is enabled, count the month as enabled.
        for (let date = firstOfMonth; getMonth(date) === month;
            date = addCalendarDays(date, 1)) {
            if (dateFilter(date)) {
                return true;
            }
        }
        return false;
    }, [_isYearAndMonthAfterMaxDate, _isYearAndMonthBeforeMinDate, activeDate, dateFilter]);

    /** Creates an ICalendarCell for the given month, zero-based. */
    const _createCellForMonth = useCallback((month: number, monthName: string): ICalendarCell => {
        // let ariaLabel = format(
        //     createDate(getYear(activeDate), month, 1),
        //     _dateFormats.display.monthYearA11yLabel);

        return {
            cellIndex: month,
            value: createDate(getYear(activeDate), month, 1),
            displayValue: monthName.toLocaleUpperCase(),
            ariaLabel: MONTH_NAMES[month].long,
            enabled: _shouldEnableMonth(month)
        } as ICalendarCell;
    }, [_shouldEnableMonth, activeDate]);

    /** Repopulate on activeDate change. */
    useEffect(() => {
        _setYearText(formatYearLabel(activeDate));

        _setMonths([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(row => row.map(
            month => _createCellForMonth(month, MONTH_NAMES[month].short))) as ICalendarCell[][]);
        // implies 4 months per row
    }, [_createCellForMonth, activeDate, formatYearLabel]);

    /** Handles when a new month is selected. */
    const _monthSelected = (cellValue: Date) => {
        dateSelected(cellValue);
    }

    /** Handles keydown events on the calendar body when calendar is in year view. */
    const _handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        const { keyCode } = event;
        // const isRtl = isRtl();
        const isRtl = false;

        // TODO: Prevent navigation to unselectable disabled dates

        switch (keyCode) {
            // case 13: {// Enter
            // }
            case 32: { // SPACE

                // monthSelected(getMonth());
                onMonthSelected({ selectedDate: activeDate, beginDate, endDate });
                // event.preventDefault();
                break;
            }
            case 33: { // PAGE_UP
                dispatch({
                    type: 'set-active-date', payload:
                        addCalendarYears(activeDate, event.altKey ? -10 : -1)
                });
                break;
            }
            case 34: { // PAGE_DOWN
                dispatch({
                    type: 'set-active-date', payload:
                        addCalendarYears(activeDate, event.altKey ? 10 : 1)
                });
                break;
            }
            case 35: { // END
                dispatch({
                    type: 'set-active-date', payload: addCalendarMonths(activeDate,
                        (11 - getMonth(activeDate)))
                })
                break;
            }
            case 36: { // HOME
                dispatch({
                    type: 'set-active-date', payload: addCalendarMonths(activeDate,
                        -getMonth(activeDate))
                })
                break;
            }
            case 37: { // LEFT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarMonths(activeDate, isRtl ? 1 : -1) });
                break;
            }
            case 38: { // UP_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarMonths(activeDate, -4) });
                break;
            }
            case 39: { // RIGHT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarMonths(activeDate, isRtl ? -1 : 1) });
                break;
            }
            case 40: { // DOWN_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarMonths(activeDate, 4) });
                break;
            }
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        if (compareDates(_prevActiveDate.current, activeDate)) {
            _prevActiveDate.current = activeDate;
        }
        _focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }, [_prevActiveDate, activeDate, beginDate, dispatch, endDate, onMonthSelected]);

    useEffect(() => {
        window.addEventListener('keydown', _handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', _handleUserKeyPress);
        };
    }, [_handleUserKeyPress]);

    /** Returns flat index (not row, column) of active cell. */
    const _getActiveCell = () => {
        return getMonth(activeDate);
    }

    /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // CalendarBody._focusActiveCell();
    }

    // /** Determines whether the user has the Right To Left layout direction. */
    // //   private const _isRtl = () => {
    // //     return _dir && _dir.value === 'rtl';
    // // }

    /** Returns true if all cells are within the beginDate and endDate range. */
    const _isRangeFull = () => {
        if (rangeMode && beginDate && endDate && _months[0]) {
            return _months[0][0].value > beginDate
                && _months[_months.length - 1][MONTHS_PER_ROW - 1].value < endDate;
        }
        return false;
    }

    return (
        <table role="presentation">
            <thead>
                <tr><th colSpan={4} aria-hidden="true" className="divider"></th></tr>
            </thead>

            <CalendarBody
                rows={_months}
                labelText={_yearText}
                labelMinRequiredCells={3}
                selectedValueChange={_monthSelected}
                compare={compareMonthsAndYears}
                dateSelected={onMonthSelected}
                createDateFromSelectedCell={(date: Date) => { return createDate(getYear(date), getMonth(date), 1) }}
                beginDateSelected={false}
                isBeforeSelected={false}
                isCurrentMonthBeforeSelected={false}
                isRangeFull={_isRangeFull()}
                activeCell={_getActiveCell()}
                numCols={4}
                cellAspectRatio={4 / 7}
            ></CalendarBody>
        </table>
    );
}

export default Year;