import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import DatepickerContext from './DatepickerContext';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';
import Month from './Month';
import { compareDaysMonthsAndYears } from './CalendarUtils';

function Calendar() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange,
        onDateInput,
        onYearSelected,
        onMonthSelected,
        onDaySelected,

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

        dispatch
    } = useContext(DatepickerContext);

    const [_currentView, _setCurrentView] = useState(startView);
    const _prevRangeMode = useRef(rangeMode);
    // const [beginDateSelected, setBeginDateSelected] = useState(false);

    /** Run on mount: set active date and view changes. */
    useEffect(() => {
        dispatch({
            type: 'set-active-date',
            payload: startAt ? startAt : new Date()
        });
    }, [startAt, dispatch]);

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

    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
        if (rangeMode !== _prevRangeMode.current) {
            if (rangeMode) {
                dispatch({
                    type: 'set-begin-date',
                    payload: selectedDate
                });
            } else {
                if (beginDate) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: beginDate
                    });
                }
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
            }
            _prevRangeMode.current = rangeMode;
        }
    }, [beginDate, dispatch, rangeMode, selectedDate]);

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

    const renderView = () => {
        switch (_currentView) {
            case 'multiyear':
                if (!disableMultiyear) {
                    return <Multiyear></Multiyear>;
                }
                if (!disableYear) {
                    _setCurrentView('year');
                } else if (!disableMonth) {
                    _setCurrentView('month');
                }
                break;
            case 'year':
                if (!disableYear) {
                    return <Year></Year>;
                }
                if (!disableMonth) {
                    _setCurrentView('month');
                } else if (!disableMultiyear) {
                    _setCurrentView('multiyear');
                }
                break;
            default:
                if (!disableMonth) {
                    return <Month></Month>;
                }
                if (!disableMultiyear) {
                    _setCurrentView('multiyear');
                } else if (!disableYear) {
                    _setCurrentView('year');
                }
        }
    }

    return (
        <div className="calendar">
            <CalendarHeader
                currentView={_currentView}
                setCurrentView={_setCurrentView}
            ></CalendarHeader>
            {renderView()}
        </div>
    );
}

export default Calendar;