import React, { useContext } from 'react';
import { DatepickerContext } from './DatepickerContext';
import { getYear, VIEW, addCalendarMonths, addCalendarYears, getActiveOffset, YEARS_PER_PAGE, getStartingYear, compareMonthsAndYears, compareYears, getMonth, formatDateDisplay } from './CalendarUtils';

function CalendarHeader({
    currentView,
    setCurrentView,
    disableAll = false
}: {
    currentView: VIEW,
    setCurrentView: (view: VIEW) => {} | void,
    disableAll: boolean
}) {
    let {
        activeDate,

        minDate,
        maxDate,

        disableMonth,
        disableYear,
        disableMultiyear,

        formatMonthLabel,

        formatYearLabel,

        formatMultiyearLabel,

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

    /** Whether the two dates represent the same view in the current view mode. */
    const _isSameView = (date1: Date, date2: Date) => {
        if (currentView === 'month') {
            return compareMonthsAndYears(date1, date2);
        }
        if (currentView === 'year') {
            return compareYears(date1, date2);
        }
        // currentView === 'multiyear'

        const year1 = getYear(date1);
        const year2 = getYear(date2);
        const startingYear = getStartingYear(minDate, maxDate);
        return Math.floor((year1 - startingYear) / YEARS_PER_PAGE) ===
            Math.floor((year2 - startingYear) / YEARS_PER_PAGE);
    }

    /** Handles clicks on the period label. */
    const _currentPeriodClicked = () => {
        console.log("Current period clicked!");
        switch (currentView) {
            case 'month':
                if (!disableMultiyear) {
                    setCurrentView('multiyear');
                } else if (!disableYear) {
                    setCurrentView('year');
                }
                break;
            case 'year':
                if (!disableMonth) {
                    setCurrentView('month');
                } else if (!disableMultiyear) {
                    setCurrentView('multiyear');
                }
                break;
            default:
                if (!disableYear) {
                    setCurrentView('year');
                } else if (!disableMonth) {
                    setCurrentView('month');
                }
                break;
        }
    }

    /** Handles user clicks on the previous button. */
    const _previousClicked = () => {
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
            return formatMonthLabel(activeDate ? activeDate : new Date());
        }
        if (currentView === 'year') {
            return formatYearLabel(activeDate ? activeDate : new Date());
        }
        // currentView is 'multiyear'

        const minYearOfPage = getYear(activeDate) - getActiveOffset(
            activeDate, minDate, maxDate);

        return formatMultiyearLabel(activeDate ? activeDate : new Date(), minYearOfPage);
    }

    /** Gets aria-label for period button */
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
        if (disableAll) return false;
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
        return !disableAll && (!minDate ||
            _isSameView(activeDate, minDate) < 0);
    }

    /** Whether the next period button is enabled. */
    const _nextEnabled = () => {
        return !disableAll && (!maxDate ||
            _isSameView(activeDate, maxDate) > 0);
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