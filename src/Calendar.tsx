import React, { useContext, useEffect, useState, useCallback, useLayoutEffect, useRef } from 'react';
import { DateData, IDatepickerContext, DatepickerContext } from './DatepickerContext';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';
import Month from './Month';
import { compareDaysMonthsAndYears, VIEW, getCompareFromView } from './CalendarUtils';

/** Returns a calendar.
 *  @param onFinalDateSelection: Calls with selectedDate, beginDate, and endDate when selected in the most precise enabled view.
 *  @param classNames: A string of class(es) to apply to the overarching div.
 */
export function Calendar(
    {
        onFinalDateSelection = (date: DateData) => { },
        onDateSelection = (date: DateData) => { },
        classNames = '',
        // context = NIDatepickerContext
        disableCalendar = false
    }: {
        onFinalDateSelection?: (data: DateData) => {} | void,
        onDateSelection?: (data: DateData) => {} | void,
        classNames?: string,
        disableCalendar?: boolean
        // context: React.Context<IDatepickerContext>
    }) {

    const {
        selectedDate,
        todayDate,
        activeDate,

        // onDateChange,
        // onCalendarDateChange,
        // onFinalDateChange,
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
    }: IDatepickerContext = useContext(DatepickerContext);

    const [_currentView, _setCurrentView] = useState(startView);

    const prevStartView = useRef(startView);
    const prevDisableMonth = useRef(disableMonth);
    const prevDisableYear = useRef(disableYear);
    const prevDisableMultiyear = useRef(disableMultiyear);
    const prevActiveDate = useRef(activeDate);

    // const _prevSelectedDate = useRef(selectedDate as Date);
    // const _prevEndDate = useRef(endDate as Date);
    // const [beginDateSelected, setBeginDateSelected] = useState(false);

    /** Update current view on startView change to an allowed view. */
    useLayoutEffect(() => {
        if (startView !== prevStartView.current) {
            switch (startView) {
                case 'multiyear':
                    if (!disableMultiyear) {
                        _setCurrentView('multiyear');
                    }
                    break;
                case 'year':
                    if (!disableYear) {
                        _setCurrentView('year');
                    }
                    break;
                default:
                    if (!disableMonth) {
                        _setCurrentView('month');
                    }
            }
            prevStartView.current = startView;
        }
    }, [startView, disableMultiyear, disableYear, disableMonth]);

    /** On disableMonth change, make sure the current view is set to one that can be displayed. */
    useLayoutEffect(() => {
        if (disableMonth && !prevDisableMonth.current && _currentView === 'month') {
            _setCurrentView(current => !disableMultiyear
                ? 'multiyear'
                : !disableYear
                    ? 'year'
                    : current);
            prevDisableMonth.current = disableMonth;
        }
    }, [disableMonth, _currentView, disableYear, disableMultiyear]);
    /** On disableYear change, make sure the current view is set to one that can be displayed. */
    useLayoutEffect(() => {
        if (disableYear && !prevDisableYear.current && _currentView === 'year') {
            _setCurrentView(current => !disableMonth
                ? 'month'
                : !disableMultiyear
                    ? 'multiyear'
                    : current);
            prevDisableYear.current = disableYear;
        }
    }, [disableYear, _currentView, disableMonth, disableMultiyear]);
    /** On disableMultiyear change, make sure the current view is set to one that can be displayed. */
    useLayoutEffect(() => {
        if (disableMultiyear && !prevDisableMultiyear.current && _currentView === 'multiyear') {
            _setCurrentView(current => !disableYear
                ? 'year'
                : !disableMonth
                    ? 'month'
                    : current);
            prevDisableMultiyear.current = disableMultiyear;
        }
    }, [disableMultiyear, _currentView, disableYear, disableMonth]);

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

    /** On activeDate change, check if view should be updated. */
    // useEffect(() => {
    //     console.log("active date from calendar: ");
    //     console.log(activeDate);
    //     if (activeDate) {
    //         _setCurrentView(current => {
    //             if ((prevActiveDate.current == null) || (getCompareFromView(current, activeDate, prevActiveDate.current))) {
    //                 prevActiveDate.current = activeDate;
    //                 return (current === 'year' && !disableMonth)
    //                     ? 'month'
    //                     : (current === 'multiyear' && !disableYear)
    //                         ? 'year'
    //                         : current;
    //             }
    //             return current;
    //         });
    //     }
    // }, [activeDate, disableMonth, disableYear]);

    const updateCurrentView = () => {
        _setCurrentView(current => {
            //if ((prevActiveDate.current == null) || (getCompareFromView(current, activeDate, prevActiveDate.current))) {
            prevActiveDate.current = activeDate;
            return (current === 'year')
                ? (!disableMonth)
                    ? 'month'
                    : (!disableMultiyear)
                        ? 'multiyear'
                        : current
                : (current === 'multiyear')
                    ? (!disableYear)
                        ? 'year'
                        : (!disableMonth)
                            ? 'month'
                            : current
                    : current;
            // }
            // return current;
        });
    }

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

    /** Returns response to selected date based on provided view. */
    const _getSelectedFromView = (view: VIEW, data: DateData) => {
        // onDateSelection(data);
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
        // console.log("received final date selection");
        dispatch({
            type: 'set-start-at',
            payload: data.selectedDate
        });

        onDateSelection(data);
        onFinalDateSelection(data);
        // TODO: see if should move these one level up:
        // onCalendarDateChange(data);
    }
    /** Handles date changes from calendar body. */
    const _handleDateChange = (date: Date) => {
        dispatch({
            type: 'set-active-date',
            payload: date
        });

        if (_isMostPreciseView(_currentView)) {
            dispatch({
                type: 'set-selected-date',
                payload: date
            });
        }

        if (rangeMode) {
            if ((!beginDate && !endDate)
                || (beginDate && getCompareFromView(_currentView, beginDate, date) === 0)
                || (endDate && getCompareFromView(_currentView, endDate, date)) === 0) {
                // reset begin selection if nothing has been selected or if previously-selected beginDate or endDate are clicked again
                console.log("getting to set 1");
                _getSelectedFromView(_currentView, { selectedDate: date, beginDate: date, endDate: null });
                if (_isMostPreciseView(_currentView)) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: date
                    });
                    dispatch({
                        type: 'set-end-date',
                        payload: null
                    });
                }
            } else if (!beginDate && endDate) {
                // if no beginDate has been selected but an endDate has, check to see if selected date is before or after the selected end date
                if (getCompareFromView(_currentView, date, endDate) > 0) {
                    // date is after the end date
                    console.log("getting to set 2");
                    const prevEndDate = endDate;
                    _getSelectedFromView(_currentView, { selectedDate: date, beginDate: prevEndDate, endDate: date });
                    if (_isMostPreciseView(_currentView)) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: prevEndDate
                        });
                        dispatch({
                            type: 'set-end-date',
                            payload: date
                        });
                        // TODO: check if should be here
                        _finalDateSelection({ selectedDate: date, beginDate: prevEndDate, endDate: date });
                    }
                } else {
                    // date is before the end date, just set the begin date
                    console.log("getting to set 3");
                    _getSelectedFromView(_currentView, { selectedDate: date, beginDate: date, endDate });
                    if (_isMostPreciseView(_currentView)) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                        // TODO: check if should be here
                        _finalDateSelection({ selectedDate: date, beginDate: date, endDate });
                    }
                }
            } else if (beginDate && getCompareFromView(_currentView, date, beginDate) < 0) {
                // if the new selection is before the beginDate, make it the new beginDate
                const prevBeginDate = beginDate;

                if (endDate) {
                    // if there is an endDate selected, make the earlier beginDate the new beginDate
                    // dispatch({
                    //     type: 'set-begin-date',
                    //     payload: date
                    // });
                    const data = { selectedDate: date, beginDate: date, endDate };
                    _getSelectedFromView(_currentView, data);
                    console.log("getting to set 4");
                    if (_isMostPreciseView(_currentView)) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });

                        _finalDateSelection(data);
                    }
                } else {
                    // if there is no endDate selected, make the earlier date the beginDate and the later one the endDate
                    // dispatch({
                    //     type: 'set-begin-date',
                    //     payload: date
                    // });
                    // dispatch({
                    //     type: 'set-end-date',
                    //     payload: prevBeginDate
                    // });
                    const data = { selectedDate: date, beginDate: date, endDate: prevBeginDate };
                    _getSelectedFromView(_currentView, data);
                    console.log("getting to set 5");
                    if (_isMostPreciseView(_currentView)) {
                        dispatch({
                            type: 'set-begin-date',
                            payload: date
                        });
                        dispatch({
                            type: 'set-end-date',
                            payload: prevBeginDate
                        });

                        _finalDateSelection(data);
                    }
                }
            } else {
                // if the new selection is after the endDate, make it the new endDate
                // dispatch({
                //     type: 'set-end-date', payload: date
                // });
                const data = { selectedDate: date, beginDate, endDate: date };
                _getSelectedFromView(_currentView, data);

                if (_isMostPreciseView(_currentView)) {
                    dispatch({
                        type: 'set-end-date', payload: date
                    });

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
        updateCurrentView();
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
        return "calendar " + classNames + (disableCalendar ? ' disabled' : '');
    }

    /** Renders the current view. */
    const renderView = () => {
        switch (_currentView) {
            case 'multiyear':
                if (!disableMultiyear) {
                    return (
                        <Multiyear
                            dateSelected={_handleDateChange}
                            disableAll={disableCalendar}
                        ></Multiyear>
                    );
                }
                if (!disableYear) {
                    _setCurrentView('year');
                } else if (!disableMonth) {
                    _setCurrentView('month');
                }
                break;
            case 'year':
                if (!disableYear) {
                    return (
                        <Year
                            dateSelected={_handleDateChange}
                            disableAll={disableCalendar}
                        ></Year>
                    );
                }
                if (!disableMonth) {
                    _setCurrentView('month');
                } else if (!disableMultiyear) {
                    _setCurrentView('multiyear');
                }
                break;
            default:
                if (!disableMonth) {
                    return (
                        <Month
                            dateSelected={_handleDateChange}
                            disableAll={disableCalendar}
                        ></Month>
                    );
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
                disableAll={disableCalendar}
            ></CalendarHeader>
            {renderView()}
        </div>
    );
}

export default Calendar;