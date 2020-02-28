import React from 'react';
import { VIEW, getMonthNames, getMonth, YEARS_PER_PAGE, getYear } from './CalendarUtils';

// Based on: https://github.com/SaturnTeam/saturn-datepicker/tree/master/saturn-datepicker/src/datepicker
// All IDatepickerContext values will be public and updateable outside except for dispatch

interface DateCell {
    date: Date | null,
    cell: number | null
}
export interface DateData {
    date: Date | null,
    beginDate: Date | null,
    endDate: Date | null
}
interface IDatepickerContext {
    selectedDate: Date | null,
    todayDate: Date | null,
    activeDate: Date,

    onDateChange: (d: DateData) => {},
    onDateInput: (d: DateData) => {},
    onYearSelected: (d: DateData) => {},
    onMonthSelected: (d: DateData) => {},
    onDaySelected: (d: DateData) => {},

    startAt: Date | null,
    startView: VIEW,
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,

    minDate: Date | null,
    maxDate: Date | null,
    dateFilter: (date: Date | null) => true,

    rangeMode: boolean,
    beginDate: Date | null,
    endDate: Date | null,

    disableMonth: boolean,
    disableYear: boolean,
    disableMultiyear: boolean,

    disable: boolean,
    disablePopup: boolean,
    disableInput: boolean,
    popupLarge: boolean,

    formatMonthLabel: (date: Date) => string,
    formatMonthText: (date: Date) => string,

    formatYearLabel: (date: Date) => string,
    formatYearText: (date: Date) => string,

    formatMultiyearLabel: (date: Date, minYearOfPage?: number) => string,
    formatMultiyearText: (date: Date) => string,

    calendarLabel: string,
    openCalendarLabel: string,

    nextMonthLabel: string,
    nextYearLabel: string,
    nextMultiyearLabel: string,

    prevMonthLabel: string,
    prevYearLabel: string,
    prevMultiyearLabel: string,

    switchToMonthViewLabel: string,
    switchToYearViewLabel: string,
    switchToMultiyearViewLabel: string,

    dispatch: React.Dispatch<Action>
}

const datepickerContextDefaultValue = {
    selectedDate: null as Date | null,
    todayDate: new Date() as Date | null,
    activeDate: new Date() as Date | null,

    onDateChange: (d: DateData) => { },
    onDateInput: (d: DateData) => { },
    onYearSelected: (d: DateData) => { },
    onMonthSelected: (d: DateData) => { },
    onDaySelected: (d: DateData) => { },

    startAt: new Date() as Date | null,
    startView: 'month' as VIEW,
    firstDayOfWeek: 0,

    minDate: null as Date | null,
    maxDate: null as Date | null,
    dateFilter: (date: Date | null) => true,

    rangeMode: false,
    beginDate: null as Date | null,
    endDate: null as Date | null,

    disableMonth: false,
    disableYear: false,
    disableMultiyear: false,

    disable: false,
    disablePopup: false,
    disableInput: false,
    popupLarge: false,

    formatMonthLabel: (date: Date) =>
        getMonthNames('short')[getMonth(date)].toLocaleUpperCase() + ' ' + getYear(date),
    formatMonthText: (date: Date) => getMonthNames('short')[getMonth(date)].toLocaleUpperCase(),

    formatYearLabel: (date: Date) => date.getFullYear().toString(),
    formatYearText: (date: Date) => date.getFullYear().toString(),

    formatMultiyearLabel: (date: Date, minYearOfPage?: number) => {
        if (minYearOfPage) {
            const maxYearOfPage = minYearOfPage + YEARS_PER_PAGE - 1;
            return `${minYearOfPage} \u2013 ${maxYearOfPage}`;
        }
        return 'Years'
    },
    formatMultiyearText: (date: Date) => '',

    calendarLabel: 'Calendar',
    openCalendarLabel: 'Open calendar',

    nextMonthLabel: 'Next month',
    nextYearLabel: 'Next year',
    nextMultiyearLabel: 'Next years',

    prevMonthLabel: 'Previous month',
    prevMultiyearLabel: 'Previous years',
    prevYearLabel: 'Previous year',

    switchToMonthViewLabel: 'Switch to month view',
    switchToYearViewLabel: 'Switch to year view',
    switchToMultiyearViewLabel: 'Switch to multi-year view',
} as IDatepickerContext;
const DatepickerContext = React.createContext(datepickerContextDefaultValue);
// export default React.createContext(datepickerContextDefaultValue);

interface Action {
    type: string,
    payload: any
}
const reducer = (state: IDatepickerContext, action: Action) => {
    switch (action.type) {
        case "reset":
            return datepickerContextDefaultValue;
        case "set-selected-date":
            return { ...state, selectedDate: action.payload };
        case "set-today-date":
            return { ...state, todayDate: action.payload };
        case "set-active-date":
            return { ...state, activeDate: action.payload };

        case "set-date-change":
            return { ...state, dateChange: action.payload };
        case "set-date-input":
            return { ...state, dateInput: action.payload };
        case "set-year-selected":
            return { ...state, yearSelected: action.payload };
        case "set-month-selected":
            return { ...state, monthSelected: action.payload };
        case "set-day-selected":
            return { ...state, daySelected: action.payload };

        case "set-start-at":
            return { ...state, startAt: action.payload };
        case "set-start-view":
            return { ...state, startView: action.payload };
        case "set-first-day-of-week":
            return { ...state, firstDayOfWeek: action.payload };

        case "set-min-date":
            return { ...state, minDate: action.payload };
        case "set-max-date":
            return { ...state, maxDate: action.payload };
        case "set-date-filter":
            return { ...state, dateFilter: action.payload };

        case "set-range-mode":
            return { ...state, rangeMode: action.payload };
        case "set-begin-date":
            return { ...state, beginDate: action.payload };
        case "set-end-date":
            return { ...state, endDate: action.payload };

        case "set-disable-month":
            return { ...state, disableMonth: action.payload };
        case "set-disable-year":
            return { ...state, disableYear: action.payload };
        case "set-disable-multiyear":
            return { ...state, disableMultiyear: action.payload };

        case "set-disable":
            return { ...state, disable: action.payload };
        case "set-disable-popup":
            return { ...state, disablePopup: action.payload };
        case "set-disable-input":
            return { ...state, disableInput: action.payload };
        case "set-popup-large":
            return { ...state, popupLarge: action.payload };

        case "set-format-month-label":
            return { ...state, formatMonthLabel: action.payload };
        case "set-format-month-text":
            return { ...state, formatMonthText: action.payload };

        case "set-format-year-label":
            return { ...state, formatYearLabel: action.payload };
        case "set-format-year-text":
            return { ...state, formatYearText: action.payload };

        case "set-format-multiyear-label":
            return { ...state, formatMultiyearLabel: action.payload };
        case "set-format-multiyear-text":
            return { ...state, formatMultiyearText: action.payload };

        case "set-calendar-label":
            return { ...state, calendarLabel: action.payload };
        case "set-open-calendar-label":
            return { ...state, openCalendarLabel: action.payload };

        case "set-next-month-label":
            return { ...state, nextMonthLabel: action.payload };
        case "set-year-label":
            return { ...state, nextYearLabel: action.payload };
        case "set-next-multiyear-label":
            return { ...state, nextMultiyearLabel: action.payload };

        case "set-prev-month-label":
            return { ...state, prevMonthLabel: action.payload };
        case "set-prev-year-label":
            return { ...state, prevYearLabel: action.payload };
        case "set-prev-multiyear-label":
            return { ...state, prevMultiyearLabel: action.payload };

        case "set-switch-to-month-view-label":
            return { ...state, switchToMonthViewLabel: action.payload };
        case "set-switch-to-year-view-label":
            return { ...state, switchToYearViewLabel: action.payload };
        case "set-switch-to-multiyear-view-label":
            return { ...state, switchToMultiyearViewLabel: action.payload };

        default:
            return state;
    }
}

export function DatepickerContextProvider({ children }: { children: any }) {
    let [state, dispatch] = React.useReducer(reducer, datepickerContextDefaultValue);
    return (
        <DatepickerContext.Provider value={{ ...state, dispatch }}> {children} </DatepickerContext.Provider>
    );
}

export const DatepickerContextConsumer = DatepickerContext.Consumer;

//export { DatepickerContext, DatepickerContextProvider, DatepickerContextConsumer };
export default DatepickerContext;