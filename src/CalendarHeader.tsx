import React, { useContext, useState } from 'react';
import DatepickerContext from './DatepickerContext';
import { getYear, getMonth, VIEW, addCalendarMonths, addCalendarYears, getActiveOffset, YEARS_PER_PAGE, getStartingYear } from './CalendarUtils';

interface CalenderHeaderProps {
    currentView: VIEW,
    setCurrentView: (view: VIEW) => {} | void
}
function CalendarHeader({ currentView, setCurrentView }: CalenderHeaderProps) {
    let {
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

    /** Whether the two dates represent the same view in the current view mode (month or year). */
    const _isSameView = (date1: Date, date2: Date) => {
        if (currentView === 'month') {
            return getYear(date1) === getYear(date2) &&
                getMonth(date1) === getMonth(date2);
        }
        if (currentView === 'year') {
            return getYear(date1) === getYear(date2);
        }
        _isSameMultiyearView(date1, date2);
    }

    // /**  Returns true if two dates will display in the same multiyear view */
    function _isSameMultiyearView(date1: Date, date2: Date) {
        const year1 = getYear(date1);
        const year2 = getYear(date2);
        const startingYear = getStartingYear(minDate, maxDate);
        return Math.floor((year1 - startingYear) / YEARS_PER_PAGE) ===
            Math.floor((year2 - startingYear) / YEARS_PER_PAGE);
    }

    /** Handles user clicks on the period label.
     * Option`calendar.orderPeriodLabel` sort the label period views.
     * - Default [multiyear]: multiyear then back to month
     * - Month [month]: month > year > multi-year
     */
    const _currentPeriodClicked = () => {
        // const monthFirstOrder: VIEW[] = ['month', 'year', 'multiyear']
        // const defaultOrder: VIEW[] = ['month', 'multiyear', 'month'];
        // const orderPeriod = orderPeriodLabel === 'month' ? monthFirstOrder : defaultOrder;

        switch (currentView) {
            case 'month':
                if (!disableMultiyear) {
                    setCurrentView('multiyear');
                } else if (!disableYear) {
                    setCurrentView('year');
                }
                // currentView = orderPeriod[1];
                break;
            case 'year':
                if (!disableMonth) {
                    setCurrentView('month');
                } else if (!disableMultiyear) {
                    setCurrentView('multiyear');
                }
                // currentView = orderPeriod[2]
                break;
            default:
                if (!disableYear) {
                    setCurrentView('year');
                } else if (!disableMonth) {
                    setCurrentView('month');
                }
                // currentView = orderPeriod[0]
                break;
        }
    }

    /** Handles user clicks on the previous button. */
    const _previousClicked = () => {
        // _currentPeriodClicked();
        dispatch(
            {
                type: 'set-active-date',
                payload: (currentView === 'month')
                    ? addCalendarMonths(activeDate, -1)
                    : addCalendarYears(
                        activeDate,
                        (currentView === 'year') ? -1 : -YEARS_PER_PAGE
                    )
            }
        );
    }

    /** Handles user clicks on the next button. */
    const _nextClicked = () => {
        //  _currentPeriodClicked();
        dispatch(
            {
                type: 'set-active-date',
                payload: (currentView === 'month')
                    ? addCalendarMonths(activeDate, 1)
                    : addCalendarYears(
                        activeDate,
                        (currentView === 'year') ? 1 : YEARS_PER_PAGE
                    )
            }
        );
    }

    /** Gets header label for current view */
    const _getHeaderLabel = () => {
        if (currentView === 'month') {
            // return this._dateAdapter
            //     .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
            //     .toLocaleUpperCase();
            return formatMonthLabel(activeDate ? activeDate : new Date());
        }
        if (currentView === 'year') {
            return getYear(activeDate ? activeDate : new Date());
        }
        // currentView is 'multiyear'

        // The offset from the active year to the "slot" for the starting year is the
        // *actual* first rendered year in the multi-year view, and the last year is
        // just YEARS_PER_PAGE - 1 away.

        const activeYear = getYear(activeDate ? activeDate : new Date());
        const minYearOfPage = activeYear - getActiveOffset(
            activeDate, minDate, maxDate);
        const maxYearOfPage = minYearOfPage + YEARS_PER_PAGE - 1;
        return `${minYearOfPage} \u2013 ${maxYearOfPage}`;
        // TODO: get active offset from multi-year view
    }
    const _getPeriodButtonLabel = () => {
        switch (currentView) {
            case 'month':
                if (disableMultiyear) {
                    if (disableYear) {
                        return;
                    } else {
                        return switchToYearViewLabel;
                    }
                }
                return switchToMultiyearViewLabel;
            case 'year':
                if (disableMonth) {
                    if (disableMultiyear) {
                        return;
                    } else {
                        return switchToMultiyearViewLabel;
                    }
                }
                return switchToMonthViewLabel;
            case 'multiyear':
                if (disableYear) {
                    if (disableMonth) {
                        return;
                    } else {
                        return switchToMonthViewLabel;
                    }
                }
                return switchToYearViewLabel;
        }
    }

    /** The label for the previous button. */
    const _getPrevButtonLabel = () => {
        return ({
            'month': prevMonthLabel,
            'year': prevYearLabel,
            'multiyear': prevMultiyearLabel
        } as { [key: string]: string })[currentView];
    }

    /** The label for the next button. */
    const _getNextButtonLabel = () => {
        return ({
            'month': nextMonthLabel,
            'year': nextYearLabel,
            'multiyear': nextMultiyearLabel
        } as { [key: string]: string })[currentView];
    }

    /** Whether the period button is enabled. */
    const _periodEnabled = () => {
        switch (currentView) {
            case 'month':
                return !disableYear || !disableMultiyear;
            case 'year':
                return !disableMonth! || !disableMultiyear;
            case 'multiyear':
                return !disableMonth || !disableYear;
            default:
                return !disableMonth || !disableYear || !disableMultiyear;
        }
    }

    /** Whether the previous period button is enabled. */
    const _previousEnabled = () => {
        if (!minDate) {
            return true;
        }
        return !minDate ||
            !_isSameView(activeDate, minDate);
    }

    /** Whether the next period button is enabled. */
    const _nextEnabled = () => {
        return !maxDate ||
            !_isSameView(activeDate, maxDate);
    }


    return (
        <div
            className="header">
            <button
                onClick={_previousClicked}
                disabled={!_previousEnabled()}
                aria-label={_getPrevButtonLabel()}
                type="button"
                className="left"
            ></button>
            <button
                onClick={_currentPeriodClicked}
                disabled={!_periodEnabled()}
                aria-label={_getPeriodButtonLabel()}
                type="button"
                className="period">
                {_getHeaderLabel()}
            </button>
            <button
                onClick={_nextClicked}
                disabled={!_nextEnabled()}
                aria-label={_getNextButtonLabel()}
                type="button"
                className="right"
            ></button>
        </div>
    );
}

export default CalendarHeader;