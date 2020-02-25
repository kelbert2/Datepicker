import DatepickerContext from './DatepickerContext';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import CalendarBody, { ICalendarCell } from './CalendarBody';
import { getYear, createDate, getDate, addCalendarMonths, getMonth, addCalendarYears, compareDates, getYearName, getMonthNames, MONTH_NAMES, addCalendarDays, isDateInstance, isValid, getMonthInCurrentYear, MONTHS_PER_ROW, compareMonthsAndYears } from './CalendarUtils';
import { getDaysPerMonth } from './CalendarUtils';


function Year() {
    // selectedChange: (date: Date) => {} | void

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

    /** Grid of ICalendarCells representing the months of the year. */
    const [_months, _setMonths] = useState([] as ICalendarCell[][]);
    // [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(row => row.map(
    //     month => _createCellForMonth(month, MONTH_NAMES[month].short))) as ICalendarCell[][]);
    /** Previous active date. */
    const [_prevActiveDate, _setPrevActiveDate] = useState(activeDate);
    /** The label for this year (e.g. "2017"). */
    const [_yearLabel, _setYearLabel] = useState(getYearName(activeDate));
    /** The month in this year that today falls on. Null if today is in a different year. */
    // const [_todayMonth, _setTodayMonth] = useState(getMonthInCurrentYear(todayDate) as number | null);
    /**
           * The month in this year that the selected Date falls on.
           * Null if the selected Date is in a different year.
           */
    //  const [_selectedMonth, _setSelectedMonth] = useState(getMonthInCurrentYear(selectedDate) as number | null);

    /** Repopulate on activeDate change. */
    useEffect(() => {
        const activeYear = getYear(activeDate);
        _setYearLabel('' + activeYear);

        _setMonths([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(row => row.map(
            month => _createCellForMonth(month, MONTH_NAMES[month].short))) as ICalendarCell[][]);
        // implies 4 months per row
    }, [activeDate]);

    /** Handles when a new month is selected. */
    // const _monthSelected = (month: number) => {
    const _monthSelected = (cellValue: Date) => {
        // const month = getMonth(date);

        // const normalizedDate =
        //     createDate(getYear(activeDate), month, 1);

        // monthSelected({ date: normalizedDate, beginDate, endDate });

        // const daysInMonth = getDaysPerMonth(month);

        // _selectedChange(createDate(
        //     getYear(activeDate), month,
        //     Math.min(getDate(activeDate), daysInMonth)));

        let date = createDate(getYear(cellValue), getMonth(cellValue), 1);

        if (rangeMode) {
            if (!beginDate || date < beginDate) {
                // reset begin selection
                monthSelected({ date, beginDate: date, endDate: null });

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
                monthSelected({ date, beginDate, endDate: date });

                dispatch({
                    type: 'set-selected-date', payload: date
                });
                dispatch({
                    type: 'set-end-date', payload: date
                });
            }
        } else {
            monthSelected({ date, beginDate: null, endDate: null });

            dispatch({
                type: 'set-selected-date', payload: date
            });
        }
    }

    /** Handles keydown events on the calendar body when calendar is in year view. */
    const _handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        const { keyCode } = event;
        // const isRtl = isRtl();
        const isRtl = false;

        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.

        switch (keyCode) {
            // case 13: {// Enter
            // }
            case 32: { // SPACE

                // monthSelected(getMonth());
                monthSelected({ date: activeDate, beginDate, endDate });
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
        if (compareDates(_prevActiveDate, activeDate)) {
            //  activeDateChange.emit(activeDate);
            // activeDateChange(activeDate);
            // dateChange({ date: activeDate, beginDate, endDate });
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
        return getMonth(activeDate);
    }

    /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // CalendarBody._focusActiveCell();
    }

    /** Creates an ICalendarCell for the given month. */
    const _createCellForMonth = (month: number, monthName: string) => {
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
    }

    /** Whether the given month is enabled. */
    const _shouldEnableMonth = (month: number) => {

        const activeYear = getYear(activeDate);

        if (month === undefined || month === null ||
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
    }

    /**
     * Tests whether the combination month/ year is after maxDate, considering
     * just the month and year of maxDate
     */
    const _isYearAndMonthAfterMaxDate = (year: number, month: number) => {
        if (maxDate) {
            const maxYear = getYear(maxDate);
            const maxMonth = getMonth(maxDate);

            return year > maxYear || (year === maxYear && month > maxMonth);
        }
        return false;
    }

    /**
     * Tests whether the combination month/ year is before minDate, considering
     * just the month and year of minDate
     */
    const _isYearAndMonthBeforeMinDate = (year: number, month: number) => {
        if (minDate) {
            const minYear = getYear(minDate);
            const minMonth = getMonth(minDate);

            return year < minYear || (year === minYear && month < minMonth);
        }
        return false;
    }

    /** Returns if all cells are within the beginDate and endDate range. */
    const _isRangeFull = () => {
        if (rangeMode && beginDate && endDate) {
            return _months[0][0].value > beginDate
                && _months[_months.length - 1][MONTHS_PER_ROW - 1].value < endDate;
        }
        return false;
    }

    // /** Determines whether the user has the Right To Left layout direction. */
    // //   private const _isRtl = () => {
    // //     return _dir && _dir.value === 'rtl';
    // // }

    return (
        <table role="presentation">
            <thead>
                <tr><th colSpan={4} className="divider"></th></tr>
            </thead>

            <CalendarBody
                rows={_months}
                labelText={_yearLabel}
                labelMinRequiredCells={3}
                selectedValueChange={_monthSelected}
                compare={compareMonthsAndYears}
                beginDateSelected={false}
                isBeforeSelected={false}
                isCurrentMonthBeforeSelected={false}
                isRangeFull={_isRangeFull()}
                activeCell={_getActiveCell()}
                numCols={4}
                cellAspectRatio={4 / 7}
            ></CalendarBody>
        </table>
    )

}

export default Year;