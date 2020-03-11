import React, { useContext, useEffect, useState, useCallback } from 'react';
import DatepickerContext, { DateData } from './DatepickerContext';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';
import Month from './Month';
import { compareDaysMonthsAndYears, VIEW, compareYears, compareMonthsAndYears } from './CalendarUtils';

/** Returns a calendar.
 *  @param onFinalDateSelection: Calls with selectedDate, beginDate, and endDate when selected in the most precise enabled view.
 *  @param classNames: A string of class(es) to apply to the overarching div.
 */
export function Calendar(
    {
        onFinalDateSelection = (date: DateData) => { },
        classNames = ''
    }: {
        onFinalDateSelection: (data: DateData) => {} | void,
        classNames: string
    }) {

    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange,
        onYearSelected,
        onMonthSelected,
        onDaySelected,

        startAt,
        startView,

        rangeMode,
        beginDate,
        endDate,

        disableMonth,
        disableYear,
        disableMultiyear,

        dispatch
    } = useContext(DatepickerContext);

    const [_currentView, _setCurrentView] = useState(startView);

    // const _prevSelectedDate = useRef(selectedDate as Date);
    // const _prevEndDate = useRef(endDate as Date);
    // const [beginDateSelected, setBeginDateSelected] = useState(false);

    /** Run on mount: set active date and view changes. */
    useEffect(() => {
        if (!activeDate) {
            dispatch({
                type: 'set-active-date',
                payload: startAt ? startAt : selectedDate ? selectedDate : new Date()
            });
        }
    }, [activeDate, startAt, selectedDate, dispatch]);

    /** Update today's date. */
    const _updateTodayDate = useCallback(() => {
        const newDate = new Date();
        if (!todayDate || compareDaysMonthsAndYears(todayDate, newDate) !== 0) {
            dispatch({
                type: 'set-today-date',
                payload: newDate
            });
        }
    }, [todayDate, dispatch]);

    /** On activeDate change, make sure today's date is up-to-date. */
    useEffect(() => {
        _updateTodayDate();
    }, [activeDate, _updateTodayDate]);

    // TODO: See if this worked
    /** On selected date change, set the active date. */
    useEffect(() => {
        if (selectedDate) {
            dispatch({
                type: 'set-active-date',
                payload: selectedDate
            });
        }
    }, [dispatch, selectedDate]);

    // const dateSelected = (date: Date) => {
    //     if (rangeMode) {
    //         if (!beginDateSelected) {
    //             setBeginDateSelected(true);
    //             beginDate = date;
    //             endDate = date;
    //             //   this.beginDateSelectedChange.emit(date);
    //         } else {
    //             setBeginDateSelected(false);
    //             if (beginDate && beginDate <= date) {
    //                 endDate = date;
    //             } else {
    //                 endDate = beginDate;
    //                 beginDate = date;
    //             }
    //             // this.dateRangesChange.emit({begin: <D>this.beginDate, end: this.endDate});
    //         }
    //     } else if (!selectedDate || (selectedDate && !sameDay(date, selectedDate))) {
    //         // this.selectedChange.emit(date);
    //     }

    // /** Handles year selection in the multiyear view. */
    // const yearSelectedInMultiYearView = (normalizedYear: Date) => {
    //     // this.yearSelected.emit(normalizedYear);
    // }

    // /** Handles month selection in the year view. */
    // const monthSelectedInYearView = (normalizedMonth: Date) => {
    //     // this.monthSelected.emit(normalizedMonth);
    // }

    // /** Handles year/ month selection in the multi-year/year views. */
    // const _goToDateInView = (date: Date, view: VIEW) => {
    //     dispatch({
    //         type: 'set-active-date',
    //         payload: date
    //     });
    //     _setCurrentView(view);
    // }

    /** On selectedDate change, check if view should be updated. */
    useEffect(() => {
        _setCurrentView(current =>
            (current === 'year' && !disableMonth)
                ? 'month'
                : (current === 'multiyear' && !disableYear)
                    ? 'year'
                    : current);
    }, [selectedDate, disableMonth, disableYear]);

    /**  */
    // const _determineIfDone = useCallback((isMonthDisabled: boolean, isYearDisabled: boolean, currentViewFromSelection: VIEW) => {
    //     if ((isMonthDisabled && isYearDisabled && currentViewFromSelection === 'multiyear')
    //         || (isMonthDisabled && currentViewFromSelection === 'year')
    //         || (currentViewFromSelection === 'month')) {
    //         if (rangeMode && beginDate != null && endDate != null) {
    //             onFinalDateSelection({ date: selectedDate, beginDate, endDate });
    //         } else if (!rangeMode && selectedDate) {
    //             onFinalDateSelection({ date: selectedDate, beginDate, endDate });
    //         }
    //     }
    // }, [beginDate, endDate, onFinalDateSelection, rangeMode, selectedDate]);

    /** Determines if the supplied view is the most precise allowed. */
    const _isMostPreciseView = useCallback((view: VIEW) => {
        switch (view) {
            case 'multiyear':
                return !disableMultiyear && disableMonth && disableYear;
            case 'year':
                return !disableYear && disableMonth;
            default:
                return !disableMonth;
        }
    }, [disableMonth, disableYear, disableMultiyear]);

    const _getCompareFromView = (view: VIEW, date1: Date, date2: Date) => {
        switch (view) {
            case 'multiyear':
                return compareYears(date1, date2);
            case 'year':
                return compareMonthsAndYears(date1, date2);
            default:
                return compareDaysMonthsAndYears(date1, date2);
        }
    }

    const _getSelectedFromView = (view: VIEW, data: DateData) => {
        switch (view) {
            case 'multiyear':
                return onYearSelected(data);
            case 'year':
                return onMonthSelected(data);
            default:
                return onDaySelected(data);
        }
    }
    const _finalDateSelection = (data: DateData) => {
        // console.log("recieved final date selection");
        // TODO: see if this worked
        dispatch({
            type: 'set-start-at',
            payload: data.selectedDate
        });

        onFinalDateSelection(data);
        onDateChange(data);
    }
    /** Handles date changes from calendar body. */
    const _handleDateChange = (date: Date) => {
        dispatch({
            type: 'set-active-date',
            payload: date
        });
        dispatch({
            type: 'set-selected-date',
            payload: date
        });

        if (rangeMode) {
            if ((!beginDate && !endDate)
                || (beginDate && _getCompareFromView(_currentView, beginDate, date) === 0)
                || (endDate && _getCompareFromView(_currentView, endDate, date)) === 0) {
                // reset begin selection if nothing has been selected or if previously-selected beginDate or endDate are clicked again
                dispatch({
                    type: 'set-begin-date',
                    payload: date
                });
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
                _getSelectedFromView(_currentView, { selectedDate: date, beginDate: date, endDate: null });

            } else if (!beginDate && endDate) {
                // if no beginDate has been selected but an endDate has, just set the beginDate
                dispatch({
                    type: 'set-begin-date',
                    payload: date
                });
            } else if (beginDate && _getCompareFromView(_currentView, date, beginDate) < 0) {
                // if the new selection is before the beginDate, make it the new beginDate
                const prevBeginDate = beginDate;

                if (endDate) {
                    // if there is an endDate selected, make the earlier beginDate the new beginDate
                    dispatch({
                        type: 'set-begin-date',
                        payload: date
                    });
                    const data = { selectedDate: date, beginDate: date, endDate };
                    _getSelectedFromView(_currentView, data);

                    if (_isMostPreciseView(_currentView)) {
                        _finalDateSelection(data);
                    }

                } else {
                    // if there is no endDate selected, make the earlier date the beginDate and the later one the endDate
                    dispatch({
                        type: 'set-begin-date',
                        payload: date
                    });
                    dispatch({
                        type: 'set-end-date',
                        payload: prevBeginDate
                    });
                    const data = { selectedDate: date, beginDate: date, endDate: prevBeginDate };
                    _getSelectedFromView(_currentView, data);

                    if (_isMostPreciseView(_currentView)) {
                        _finalDateSelection(data);
                    }
                }
            } else {
                // if the new selection is after the endDate, make it the new endDate
                dispatch({
                    type: 'set-end-date', payload: date
                });
                const data = { selectedDate: date, beginDate, endDate: date };
                _getSelectedFromView(_currentView, data);

                if (_isMostPreciseView(_currentView)) {
                    _finalDateSelection(data);
                }
            }
        } else {
            // if not in range mode, simply update the selected date
            const data = { selectedDate: date, beginDate: null, endDate: null };
            _getSelectedFromView(_currentView, data);

            if (_isMostPreciseView(_currentView)) {
                _finalDateSelection(data);
            }
        }
    }

    /** Run on selection or endDate change to determine if the most precise date that can be selected has been selected. */
    // useEffect(() => {
    //     // if (
    //     //     (disableMonth && disableYear && _currentView === 'multiyear')
    //     //     || (disableMonth && _currentView === 'year')
    //     //     || (_currentView === 'month')
    //     // ) {
    //     if (_isMostPreciseView(_currentView)) {
    //         if (rangeMode) {
    //             if (endDate != null
    //                 && (
    //                     _prevEndDate.current == null
    //                     || _getCompareFromView(_currentView, endDate, _prevEndDate.current)
    //                 )
    //                 && beginDate != null
    //             ) {
    //                 onFinalDateSelection({ date: selectedDate, beginDate, endDate });
    //                 _prevEndDate.current = endDate;
    //             }
    //         } else {
    //             if (selectedDate != null
    //                 && (
    //                     _prevSelectedDate.current == null
    //                     || _getCompareFromView(_currentView, selectedDate, _prevSelectedDate.current)
    //                 )) {
    //                 onFinalDateSelection({ date: selectedDate, beginDate, endDate });
    //                 _prevSelectedDate.current = selectedDate;
    //             }
    //         }
    //     }
    // }, [_currentView, _isMostPreciseView, beginDate, endDate, onFinalDateSelection, rangeMode, selectedDate]);

    /** Return styling for surrounding Calendar div. */
    const _getCalendarClasses = () => {
        return "calendar " + classNames;
    }

    /** Renders the current view. */
    const renderView = () => {
        switch (_currentView) {
            case 'multiyear':
                if (!disableMultiyear) {
                    return <Multiyear
                        dateSelected={_handleDateChange}></Multiyear>;
                }
                if (!disableYear) {
                    _setCurrentView('year');
                } else if (!disableMonth) {
                    _setCurrentView('month');
                }
                break;
            case 'year':
                if (!disableYear) {
                    return <Year
                        dateSelected={_handleDateChange}></Year>;
                }
                if (!disableMonth) {
                    _setCurrentView('month');
                } else if (!disableMultiyear) {
                    _setCurrentView('multiyear');
                }
                break;
            default:
                if (!disableMonth) {
                    return <Month
                        dateSelected={_handleDateChange}></Month>;
                }
                if (!disableMultiyear) {
                    _setCurrentView('multiyear');
                } else if (!disableYear) {
                    _setCurrentView('year');
                }
        }
        return '';
    }

    return (
        <div className={_getCalendarClasses()}
            tabIndex={-1}
        >
            <CalendarHeader
                currentView={_currentView}
                setCurrentView={_setCurrentView}
            ></CalendarHeader>
            {renderView()}
        </div>
    );
}

export default Calendar;