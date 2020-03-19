import React from 'react';
import { getMonthNames, getMonth, getYear } from './CalendarUtils';
import { DatepickerThemeStrings, DEFAULT_THEME_STRINGS } from './theming';

// Based on: https://github.com/SaturnTeam/saturn-datepicker/tree/master/saturn-datepicker/src/datepicker, written in Angular

/** Shape of data returned by datepicker event emissions. */
export interface DateData {
    selectedDate: Date | null,
    beginDate: Date | null,
    endDate: Date | null
}
/** Determines how the calendar appears when open. */
export type CalendarDisplay = 'popup' | 'popup-large' | 'inline';
/** For use describing the current display state of the calendar. */
export type OPEN_STATES = CalendarDisplay | 'close';
/** Views that the calendar can display. */
export type VIEW = 'month' | 'year' | 'multiyear';

export const DAYS_PER_WEEK = 7;
export const YEARS_PER_PAGE = 16; // divisible by 4, or number of years per row in Multiyear
export const MONTHS_PER_ROW = 4;

/** Properties for Datepicker.
 * @param selectedDate: Most recently clicked or otherwise selected date.
 * @param todayDate: Today's date.
 *
 * @param onFinalDateChange: Function that most recently selected date, beginDate, and endDate upon close of calendar or complete selection.
 * @param onDateChange: Function that takes selected date, beginDate, and endDate upon selection.
 * @param onDaySelected: Function that takes date data upon selection in the 'month' view.
 * @param onMonthSelected: Function that takes date data upon selection in the 'year' view.
 * @param onYearSelected: Function that takes date data upon selection in the 'multiyear' view.
 *
 * @param startAt: Starting date to display, such as today.
 * @param startView: Starting view to display upon Calendar opening.
 * @param firstDayOfWeek: 0-indexed representing first day of the week, where 0 is Sunday (accepts ints 0 to 6).
 *
 * @param minDate: Minimum selectable date, used for setting a floor.
 * @param maxDate: Maximum selectable date, used for setting a ceiling.
 * @param dateFilter: Filter that dates must pass through in order to be selectable (ex: weekdays only).
 
 * @param rangeMode: Whether the user can select a range of dates or just a single date.
 * @param beginDate: Starting date used when rangeMode is true.
 * @param endDate: End date used when rangeMode is true.
 * 
 * @param disableMonth: Disallows the month view being shown.
 * @param disableYear: Disallows the year view being shown.
 * @param disableMultiyear: Disallows the multiyear view being shown.
 * 
 * @param disable: Disables input and calendar display.
 * @param calendarOpenDisplay: Decides if the calendar will display as a popup, inline, or large popup, for Touch UIs or Mobile applications.
 * @param canCloseCalendar: Allows calendar to be closed.
 * @param closeAfterSelection: Closes the calendar upon selection of the most precise date allowed (ex: won't close after year selection if can display the month view).
 * @param setCalendarOpen: On true, opens the calendar; on false, closes the calendar.
 * 
 * @param formatMonthLabel: Formats the header that appears in the month view.
 * @param formatMonthText: Formats the text that appears in the first row of the month view.
 * 
 * @param formatYearLabel: Formats the header that appears in the year view.
 * @param formatYearText: Formats the text that appears in the first row of the year view.
 * 
 * @param formatMultiyearLabel: Formats the header that appears in the multiyear view.
 * @param formatMultiyearText: Formats the text that appears in the first row of the multiyear view.
 * 
 * @param calendarLabel: string,
 * @param openCalendarLabel: string,
 * 
 * @param nextMonthLabel: Screen readers: 
 * @param nextYearLabel: 
 * @param nextMultiyearLabel: 
 * 
 * @param prevMonthLabel: 
 * @param prevYearLabel: 
 * @param prevMultiyearLabel: 
 * 
 * @param switchToMonthViewLabel: 
 * @param switchToYearViewLabel: 
 * @param switchToMultiyearViewLabel: 
 * 
 * @param theme: Provides DatepickerTheme colors for styling purposes.
 * 
 * @param dispatch: For React useReducer to modify context values.
 */
export interface IDatepickerProps {
    selectedDate?: Date | null,
    todayDate?: Date | null,

    onFinalDateChange?: (d: DateData) => {} | void,
    onDateChange?: (d: DateData) => {} | void,
    onDaySelected?: (d: DateData) => {} | void,
    onMonthSelected?: (d: DateData) => {} | void,
    onYearSelected?: (d: DateData) => {} | void,

    startAt?: Date | null,
    startView?: VIEW,
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,

    minDate?: Date | null,
    maxDate?: Date | null,
    dateFilter?: (date: Date | null) => boolean,

    rangeMode?: boolean,
    beginDate?: Date | null,
    endDate?: Date | null,

    disableMonth?: boolean,
    disableYear?: boolean,
    disableMultiyear?: boolean,

    disable?: boolean,
    disableCalendar?: boolean,
    disableInput?: boolean,
    calendarOpenDisplay?: CalendarDisplay,
    canCloseCalendar?: boolean,
    closeAfterSelection?: boolean,
    setCalendarOpen?: boolean,

    formatMonthLabel?: (date: Date) => string,
    formatMonthText?: (date: Date) => string,

    formatYearLabel?: (date: Date) => string,
    formatYearText?: (date: Date) => string,

    formatMultiyearLabel?: (date: Date, minYearOfPage?: number) => string,
    formatMultiyearText?: (date: Date) => string,

    calendarLabel?: string,
    openCalendarLabel?: string,

    nextMonthLabel?: string,
    nextYearLabel?: string,
    nextMultiyearLabel?: string,

    prevMonthLabel?: string,
    prevYearLabel?: string,
    prevMultiyearLabel?: string,

    switchToMonthViewLabel?: string,
    switchToYearViewLabel?: string,
    switchToMultiyearViewLabel?: string,

    singleInputLabel?: string,
    beginInputLabel?: string,
    endInputLabel?: string,

    parseStringToDate?: (input: string) => Date | null,
    displayDateAsString?: (date: Date) => string,

    theme?: DatepickerThemeStrings,
}

export const datepickerDefaultProps = {
    selectedDate: null as Date | null,
    todayDate: new Date() as Date | null,

    onFinalDateChange: (d: DateData) => { },
    onDateChange: (d: DateData) => { },
    onDaySelected: (d: DateData) => { },
    onMonthSelected: (d: DateData) => { },
    onYearSelected: (d: DateData) => { },

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
    calendarOpenDisplay: 'popup',
    canCloseCalendar: true,
    closeAfterSelection: true,
    setCalendarOpen: false,

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

    theme: DEFAULT_THEME_STRINGS,
} as IDatepickerProps;

/** Includes internal values to pass through components.
 * @param activeDate: Active date for tab navigation.
 * @param dispatch: Allows for modification of context values.
 */
export interface IDatepickerContext {
    selectedDate: Date | null,
    todayDate: Date | null,
    activeDate: Date,

    onFinalDateChange: (d: DateData) => {} | void,
    onDateChange: (d: DateData) => {} | void,
    onDaySelected: (d: DateData) => {} | void,
    onMonthSelected: (d: DateData) => {} | void,
    onYearSelected: (d: DateData) => {} | void,

    startAt: Date | null,
    startView: VIEW,
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,

    minDate: Date | null,
    maxDate: Date | null,
    dateFilter: (date: Date | null) => boolean,

    rangeMode: boolean,
    beginDate: Date | null,
    endDate: Date | null,

    disableMonth: boolean,
    disableYear: boolean,
    disableMultiyear: boolean,

    disable: boolean,
    disableCalendar: boolean,
    disableInput: boolean,
    calendarOpenDisplay: CalendarDisplay,
    canCloseCalendar: boolean,
    closeAfterSelection: boolean,
    setCalendarOpen: boolean,

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

    singleInputLabel: string,
    beginInputLabel: string,
    endInputLabel: string,

    parseStringToDate: (input: string) => Date | null,
    displayDateAsString: (date: Date) => string,

    theme: DatepickerThemeStrings,

    dispatch: React.Dispatch<IAction>
}

export interface IAction {
    type: string,
    payload: any
}

export const datepickerReducer = (state: IDatepickerContext, action: IAction): IDatepickerContext => {
    switch (action.type) {
        // case "reset":
        //     return datepickerDefaultProps;
        case "set-selected-date":
            return { ...state, selectedDate: action.payload };
        case "set-today-date":
            return { ...state, todayDate: action.payload };
        case "set-active-date":
            return { ...state, activeDate: action.payload };

        case "set-start-at":
            return { ...state, startAt: action.payload };

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
        default:
            return state;
    }
}

const datepickerDefaultContext = { ...datepickerDefaultProps, activeDate: new Date() as Date } as IDatepickerContext;
export const DatepickerContext = React.createContext(datepickerDefaultContext);

/** Provide access to context for children. */
export function DatepickerContextProvider({ children }: { children: any }) {
    let [state, dispatch] = React.useReducer(datepickerReducer, datepickerDefaultContext);
    return (
        <DatepickerContext.Provider value={{ ...state, dispatch }}>{children}</DatepickerContext.Provider>
    );
}

export default DatepickerContext;

// TODO: add custom className applied for dates like holidays