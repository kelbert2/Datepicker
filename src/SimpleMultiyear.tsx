import DatepickerContext from './DatepickerContext';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { getYear, getMonth, getDaysPerMonth, createDate, addCalendarYears, addCalendarDays, compareDatesGreaterThan, getYearName, isDateInstance, isValid, getDate } from './CalendarUtils';
import SimpleCalendarBody, { ICalendarCell } from './SimpleCalendarBody';

export const YEARS_PER_PAGE = 24;
export const YEARS_PER_ROW = 4;
export const isRtl = true; // language locale

function SimpleMultiyear() {
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

    const [_years, _setYear] = useState([] as ICalendarCell[][]);
    // const [_todayYear, _setTodayYear] = useState((todayDate ? todayDate : new Date()).getFullYear());
    // const [_selectedYear, _setSelectedYear] = useState();

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
        const activeYear = getYear(activeDate);
        const minYearOfPage = activeYear - _getActiveOffset(
            activeDate, minDate, maxDate);

        let years = [] as ICalendarCell[][];
        for (let i = 0, row: number[] = []; i < YEARS_PER_PAGE; i++) {
            row.push(minYearOfPage + i);
            if (row.length === YEARS_PER_ROW) {
                years.push(row.map(year => _createCellForYear(year)));
                row = [];
            }
        }
        _setYear(years); // needs to register as a change

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

    /** Handles when a new year is selected. */
    const _yearSelected = (cellValue: Date) => {
        let date = createDate(getYear(cellValue), 0, 1);

        console.log("--------Year selected: " + getYear(cellValue));

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

    // const _activeDateChange = (date: Date) => {
    //     dispatch({ type: 'set-active-date', payload: date });
    // }
    // /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    // const _handleUserKeyPress = useCallback((event) => {
    //     const { keyCode } = event;
    //     // const isRtl = isRtl();

    //     const oldActiveDate = activeDate;
    //     switch (keyCode) {
    //         // case 13: {// Enter
    //         // }
    //         case 32: { // SPACE
    //             _yearSelected(getYear(activeDate));
    //             break;
    //         }
    //         case 33: { // PAGE_UP
    //             dispatch({
    //                 type: 'set-active-date', payload: addCalendarYears(
    //                     activeDate, event.altKey ? -YEARS_PER_PAGE * 10 : -YEARS_PER_PAGE)
    //             });
    //             break;
    //         }
    //         case 34: { // PAGE_DOWN
    //             dispatch({
    //                 type: 'set-active-date', payload: addCalendarYears(
    //                     activeDate, event.altKey ? YEARS_PER_PAGE * 10 : YEARS_PER_PAGE)
    //             });
    //             break;
    //         }
    //         case 35: { // END
    //             dispatch({
    //                 type: 'set-active-date', payload: addCalendarYears(activeDate,
    //                     YEARS_PER_PAGE - _getActiveOffset(
    //                         activeDate, minDate, maxDate) - 1)
    //             })
    //             break;
    //         }
    //         case 36: { // HOME
    //             dispatch({
    //                 type: 'set-active-date', payload: addCalendarYears(activeDate,
    //                     -_getActiveOffset(activeDate, minDate, maxDate))
    //             });
    //             break;
    //         }
    //         case 37: { // LEFT_ARROW
    //             dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, isRtl ? 1 : -1) });
    //             break;
    //         }
    //         case 38: { // UP_ARROW
    //             dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, -YEARS_PER_ROW) });
    //             break;
    //         }
    //         case 39: { // RIGHT_ARROW
    //             dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, isRtl ? -1 : 1) });
    //             break;
    //         }
    //         case 40: { // DOWN_ARROW
    //             dispatch({ type: 'set-active-date', payload: addCalendarYears(activeDate, YEARS_PER_ROW) });
    //             break;
    //         }
    //         default:
    //             // Don't prevent default or focus active cell on keys that we don't explicitly handle.
    //             return;
    //     }
    //     if (compareDatesGreaterThan(oldActiveDate, activeDate)) {
    //         // activeDateChange.emit(activeDate);
    //         _activeDateChange(activeDate);
    //     }

    //     // focusActiveCell();
    //     // Prevent unexpected default actions such as form submission.
    //     event.preventDefault();
    // }, []);

    // useEffect(() => {
    //     window.addEventListener('keydown', _handleUserKeyPress);

    //     return () => {
    //         window.removeEventListener('keydown', _handleUserKeyPress);
    //     };
    // }, [_handleUserKeyPress]);


    const _getActiveCell = () => {
        return _getActiveOffset(activeDate, minDate, maxDate);
    }

    // /** Focuses the active cell after the microtask queue is empty. */
    // const _focusActiveCell = () => {
    //     // CalendarBody._focusActiveCell();
    // }

    /** Creates an ICalendarCell for the given year. */
    const _createCellForYear = (year: number) => {
        let yearName = getYearName(createDate(year, 0, 1));
        return { value: createDate(year, 0, 1), displayValue: yearName, ariaLabel: yearName, enabled: _shouldEnableYear(year) } as ICalendarCell;
    }

    /** Whether the given year is enabled. */
    const _shouldEnableYear = (year: number) => {
        // disable if the year is greater than maxDate lower than minDate
        if (year === undefined || year === null ||
            (maxDate && year > getYear(maxDate)) ||
            (minDate && year < getYear(minDate))) {
            return false;
        }
        // enable if it reaches here and there's no filter defined
        if (!dateFilter) {
            return true;
        }

        const firstOfYear = createDate(year, 0, 1);
        // If any date in the year is enabled count the year as enabled.
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

    // /**  Returns true if two dates will display in the same multiyear view */
    // function _isSameMultiyearView(date1: Date, date2: Date) {
    //     const year1 = getYear(date1);
    //     const year2 = getYear(date2);
    //     const startingYear = _getStartingYear(minDate, maxDate);
    //     return Math.floor((year1 - startingYear) / YEARS_PER_PAGE) ===
    //         Math.floor((year2 - startingYear) / YEARS_PER_PAGE);
    // }

    /**
     * When the multi-year view is first opened, the active year will be in view.
     * So we compute how many years are between the active year and the *slot* where our
     * "startingYear" will render when paged into view.
     */
    function _getActiveOffset(
        activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
        const activeYear = getYear(activeDate);
        return _euclideanModulo((activeYear - _getStartingYear(minDate, maxDate)),
            YEARS_PER_PAGE);
    }

    /**
     * We pick a "starting" year such that either the maximum year would be at the end
     * or the minimum year would be at the beginning of a page.
     */
    function _getStartingYear(
        minDate: Date | null, maxDate: Date | null): number {
        let startingYear = 0;
        if (maxDate) {
            const maxYear = getYear(maxDate);
            startingYear = maxYear - YEARS_PER_PAGE + 1;
        } else if (minDate) {
            startingYear = getYear(minDate);
        }
        return startingYear;
    }

    /** Gets remainder that is non-negative, even if first number is negative */
    const _euclideanModulo = (a: number, b: number) => {
        return (a % b + b) % b;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan={4} className="divider"></th>
                </tr>
            </thead>

            <SimpleCalendarBody
                rows={_years}
                labelText={'LabelText'}
                labelMinRequiredCells={4}
                selectedValueChange={_yearSelected}
                beginDateSelected={false}
                isBeforeSelected={false}
                isCurrentMonthBeforeSelected={false}
                isRangeFull={false}
                activeCell={_getActiveCell()}
                numCols={4}
                cellAspectRatio={4 / 7}
            ></SimpleCalendarBody>
        </table>
    )
}

export default SimpleMultiyear;