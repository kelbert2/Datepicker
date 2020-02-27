import React, { useContext, useEffect, useState } from 'react';
import DatepickerContext from './DatepickerContext';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';
import Month from './Month';
import { VIEW, compareDaysMonthsAndYears } from './CalendarUtils';

function Calendar() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange: dateChange,
        onDateInput: dateInput,
        onYearSelected: yearSelected,
        onMonthSelected: monthSelected,
        onDaySelected: daySelected,

        startAt,
        startView,
        firstDayOfWeek,

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

    const [_currentView, _setCurrentView] = useState(startView);
    // const [activeDate, setActiveDate] = useState();
    // const [beginDateSelected, setBeginDateSelected] = useState(false);

    /** Run on mount: set active date and view changes. */
    useEffect(() => {
        dispatch({
            type: 'set-active-date',
            payload: startAt ? startAt : new Date()
        });

        /** On yearSelected change, check if view should be updated. */

        // if (!disableMonth) {
        //     console.log("month selected!");
        //     _setCurrentView('month');
        // }

        /** On multiyearSelected change, check if view should be updated. */
        // console.log("year selected!");
        // if (!disableYear) {
        //     _setCurrentView('year');
        // }
    }, []);

    /** On activeDate change, make sure today's date is up-to-date. */
    useEffect(() => {
        const newDate = new Date();
        if (!todayDate || compareDaysMonthsAndYears(todayDate, newDate) !== 0) {
            dispatch({
                type: 'set-today-date',
                payload: newDate
            });
        }
    }, [activeDate]);

    /** On rangeMode change, reset selected, begin, and end dates. */
    useEffect(() => {
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
    }, [rangeMode]);


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

    /** Handles year selection in the multiyear view. */
    const yearSelectedInMultiYearView = (normalizedYear: Date) => {
        // this.yearSelected.emit(normalizedYear);
    }

    /** Handles month selection in the year view. */
    const monthSelectedInYearView = (normalizedMonth: Date) => {
        // this.monthSelected.emit(normalizedMonth);
    }

    /** Handles year/ month selection in the multi-year/year views. */
    const _goToDateInView = (date: Date, view: VIEW) => {
        dispatch({
            type: 'set-active-date',
            payload: date
        });
        _setCurrentView(view);
    }

    const renderView = () => {
        switch (_currentView) {
            case 'year':
                return <Year></Year>;
            case 'multiyear':
                return <Multiyear></Multiyear>;
            default:
                return <Month></Month>;
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