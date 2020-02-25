import DatepickerContext from './DatepickerContext';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { YEARS_PER_PAGE, getYear, createDate, addCalendarYears, addCalendarDays, compareDatesGreaterThan, getYearName, getActiveOffset, getStartingYear, compareYears } from './CalendarUtils';
import CalendarBody, { ICalendarCell } from './CalendarBody';

export const YEARS_PER_ROW = 4;
export const isRtl = true; // language locale

function Multiyear() {
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

    /** Grid of ICalendarCells representing years. */
    const [_years, _setYear] = useState([] as ICalendarCell[][]);
    /** Previous active date. */
    const [_prevActiveDate, _setPrevActiveDate] = useState(activeDate);

    /** Run on mount */
    useEffect(() => {
        // constructor
        // dispatch({ type: 'set-active-date', payload: new Date() });

        // init
        /* We want a range years such that we maximize the number of
         enabled dates visible at once. This prevents issues where the minimum year
         is the last item of a page OR the maximum year is the first item of a page.
        */

        // The offset from the active year to the "slot" for the starting year is the
        // *actual* first rendered year in the multi-year view.
        _populateYears();

        /** Handles when a new year is selected. */
        // dispatch({
        //     type: 'set-year-selected', payload: (year: number) => {
        //         let month = getMonth(activeDate);
        //         let daysInMonth =
        //             getDaysPerMonth(month);
        //         return dateChange({ date: createDate(year, month, Math.min(getDate(activeDate), daysInMonth)), beginDate, endDate });
        //     }
        // });
    }, []); // run on mount 

    /** Repopulate on activeDate change. */
    useEffect(() => {
        if (!_isSameMultiyearView(activeDate, _prevActiveDate)) {
            _populateYears();
        }
        _setPrevActiveDate(activeDate);
    }, [activeDate])

    /** Reloads years. */
    const _populateYears = () => {
        const activeYear = getYear(activeDate);
        const minYearOfPage = activeYear - getActiveOffset(
            activeDate, minDate, maxDate);

        let years = [] as ICalendarCell[][];
        for (let i = 0, row: ICalendarCell[] = []; i < YEARS_PER_PAGE; i++) {
            // row.push(minYearOfPage + i);
            row.push(_createCellForYear(minYearOfPage + i));
            if (row.length === YEARS_PER_ROW) {
                // years.push(row.map(year => _createCellForYear(year)));
                years.push(row);
                row = [];
            }
        }
        _setYear(years); // needs to register as a change
    }

    /** Handles when a new year is selected. */
    const _yearSelected = (cellValue: Date) => {
        let date = createDate(getYear(cellValue), 0, 1);

        if (rangeMode) {
            if (!beginDate || date < beginDate) {
                // reset begin selection
                yearSelected({ date, beginDate: date, endDate: null });

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
                yearSelected({ date, beginDate, endDate: date });

                dispatch({
                    type: 'set-selected-date', payload: date
                });
                dispatch({
                    type: 'set-end-date', payload: date
                });
                // } else {
                //     // reset begin selection
                //     yearSelected({ date, beginDate: date, endDate: null });
                //     // yearSelected({date, beginDate: date, endDate:beginDate});
                //     dispatch({
                //         type: 'set-selected-date', payload: date
                //     });
                //     dispatch({
                //         type: 'set-begin-date', payload: date
                //     });
                //     dispatch({
                //         type: 'set-end-date', payload: null
                //     });
                // }
            }
        } else {
            yearSelected({ date, beginDate: null, endDate: null });

            dispatch({
                type: 'set-selected-date', payload: date
            });
        }
    }

    /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    const _handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        const { keyCode } = event;
        // const isRtl = isRtl();

        // const oldActiveDate = activeDate;
        switch (keyCode) {
            // case 13: {// Enter
            // }
            case 32: { // SPACE
                _yearSelected(activeDate);
                break;
            }
            case 33: { // PAGE_UP
                dispatch({
                    type: 'set-active-date', payload: addCalendarYears(
                        activeDate, event.altKey ? -YEARS_PER_PAGE * 10 : -YEARS_PER_PAGE)
                });
                break;
            }
            case 34: { // PAGE_DOWN
                dispatch({
                    type: 'set-active-date', payload: addCalendarYears(
                        activeDate, event.altKey ? YEARS_PER_PAGE * 10 : YEARS_PER_PAGE)
                });
                break;
            }
            case 35: { // END
                dispatch({
                    type: 'set-active-date', payload: addCalendarYears(activeDate,
                        YEARS_PER_PAGE - getActiveOffset(
                            activeDate, minDate, maxDate) - 1)
                })
                break;
            }
            case 36: { // HOME
                dispatch({
                    type: 'set-active-date', payload: addCalendarYears(activeDate,
                        -getActiveOffset(activeDate, minDate, maxDate))
                });
                break;
            }
            case 37: { // LEFT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, isRtl ? 1 : -1) });
                break;
            }
            case 38: { // UP_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, -YEARS_PER_ROW) });
                break;
            }
            case 39: { // RIGHT_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, isRtl ? -1 : 1) });
                break;
            }
            case 40: { // DOWN_ARROW
                dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, YEARS_PER_ROW) });
                break;
            }
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        if (compareDatesGreaterThan(_prevActiveDate, activeDate)) {
            // activeDateChange(activeDate);
            // dispatch({ type: 'set-active-date', payload: activeDate });
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
        return getActiveOffset(activeDate, minDate, maxDate);
    }

    // /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // CalendarBody._focusActiveCell();
    }

    /** Creates an ICalendarCell for the given year. */
    const _createCellForYear = (year: number): ICalendarCell => {
        const yearName = getYearName(createDate(year, 0, 1));
        return {
            value: createDate(year, 0, 1),
            displayValue: yearName,
            ariaLabel: yearName,
            enabled: _shouldEnableYear(year)
        } as ICalendarCell;
    }

    /** Whether the given year is enabled. */
    const _shouldEnableYear = (year: number) => {
        // disable if the year is greater than maxDate lower than minDate
        if (year == null ||
            (maxDate && year > getYear(maxDate)) ||
            (minDate && year < getYear(minDate))) {
            return false;
        }
        // enable if it reaches here and there's no filter defined
        if (!dateFilter) {
            return true;
        }

        const firstOfYear = createDate(year, 0, 1);
        // If any date in the year is enabled, count the year as enabled.
        for (let date = firstOfYear; getYear(date) === year;
            date = addCalendarDays(date, 1)) {
            if (dateFilter(date)) {
                return true;
            }
        }
        return false;
    }

    // /** Determines whether the user has the Right To Left layout direction. */
    // //   private const _isRtl = () => {
    // //     return _dir && _dir.value === 'rtl';
    // // }

    /** Returns true if all cells are within the beginDate and endDate range. */
    const _isRangeFull = () => {
        if (rangeMode && beginDate && endDate) {
            return getYear(_years[0][0].value) > getYear(beginDate)
                && getYear(_years[_years.length - 1][YEARS_PER_ROW - 1].value) < getYear(endDate);
        }
        return false;
    }

    // /**  Returns true if two dates will display in the same multiyear view */
    const _isSameMultiyearView = (date1: Date, date2: Date) => {
        const year1 = getYear(date1);
        const year2 = getYear(date2);
        const startingYear = getStartingYear(minDate, maxDate);
        return Math.floor((year1 - startingYear) / YEARS_PER_PAGE) ===
            Math.floor((year2 - startingYear) / YEARS_PER_PAGE);
    }

    return (
        <table role="presentation">
            <thead>
                <tr>
                    <th colSpan={4} aria-hidden="true" className="divider"></th>
                </tr>
            </thead>

            <CalendarBody
                rows={_years}
                labelText={''}
                labelMinRequiredCells={4}
                selectedValueChange={_yearSelected}
                compare={compareYears}
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

export default Multiyear;