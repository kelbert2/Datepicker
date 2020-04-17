import React, { useContext } from 'react';
import { VIEW, getMonthNames, getMonth, YEARS_PER_PAGE, getYear, formatDateDisplay, parseStringAsDate, simpleUID, stagnantDate } from './CalendarUtils';
import { DatepickerThemeStrings } from './theming';

// Based on: https://github.com/SaturnTeam/saturn-datepicker/tree/master/saturn-datepicker/src/datepicker

export interface DateData {
    selectedDate: Date | null,
    beginDate: Date | null,
    endDate: Date | null,
    activeDate?: Date | null
}
export type CalendarDisplay = 'popup' | 'popup-large' | 'inline';

/** Context for Datepicker.
 * @param selectedDate: Most recently clicked or otherwise selected date.
 * @param todayDate: Today's date.
 * @param activeDate: Active date for tab navigation.
 *
 * @param onFinalDateChange: Function that takes most recently selected date, beginDate, and endDate upon completed selection process.
 * @param onDateChange: Function that takes selected date, beginDate, and endDate upon selection.
 * @param onCalendarDateChange: Function that takes selected date, beginDate, and endDate upon Calendar selection.
 * @param onInputDateChange: Function that takes selected date, beginDate, and endDate upon Text Input.
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
 * @param disableCalendar: Disallows any calendar from displaying.
 * @param disableInput: Disables text input.
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
 * @param singleInputLabel: 
 * @param beginInputLabel: 
 * @param endInputLabel: 
 * 
 * @param parseStringToDate: 
 * @param displayDateAsString: 
 * 
 * @param theme: Provides DatepickerTheme colors for styling purposes.
 * 
 * @param dispatch: For React useReducer to modify context values.
 */
export interface IDatepickerContext {
    selectedDate: Date | null,
    todayDate: Date | null,
    activeDate: Date,

    onFinalDateChange: (d: DateData) => {} | void,
    onDateChange: (d: DateData) => {} | void,
    onCalendarDateChange: (d: DateData) => {} | void,
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

    theme: DatepickerThemeStrings | undefined,

    dispatch: React.Dispatch<IAction>,
}

export interface IInputContext {
    onInputDateChange: (d: DateData) => {} | void,

    disableInput: boolean,

    singleInputLabel: string,
    beginInputLabel: string,
    endInputLabel: string,

    parseStringToDate: (input: string) => Date | null,
    displayDateAsString: (date: Date) => string,

    dispatch: React.Dispatch<IAction>,
}

export interface IDatepickerInputContext extends IDatepickerContext, IInputContext {
}

export const datepickerContextDefault = {
    selectedDate: null as Date | null,
    todayDate: new Date() as Date | null,
    activeDate: new Date() as Date,

    onFinalDateChange: (d: DateData) => { },
    onDateChange: (d: DateData) => { },
    onCalendarDateChange: (d: DateData) => { },
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
    disableCalendar: false,
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

    theme: undefined,
} as IDatepickerContext;

// TODO: add onCalendarDateChange, disableCalendar
const inputContextDefault = {
    onInputDateChange: (d: DateData) => { },

    disableInput: false,

    singleInputLabel: "Choose a date",
    beginInputLabel: "Choose a start date",
    endInputLabel: "end date",

    parseStringToDate: (input: string) => parseStringAsDate(input),
    displayDateAsString: (date: Date) => formatDateDisplay(date),
} as IInputContext;

export const DatepickerInputContext = React.createContext({ ...datepickerContextDefault, ...inputContextDefault } as IDatepickerInputContext);
// export default React.createContext(datepickerContextDefaultValue);
export const DatepickerContext = React.createContext(datepickerContextDefault);
export const InputContext = React.createContext(inputContextDefault);

export interface IAction {
    type: string,
    payload: any
}
export const datepickerInputReducer = (state: IDatepickerContext & IInputContext, action: IAction): IDatepickerContext & IInputContext => {
    switch (action.type) {
        case "reset":
            return { ...datepickerContextDefault, ...inputContextDefault, dispatch: state.dispatch };
        case "set-selected-date":
            return { ...state, selectedDate: action.payload };
        case "set-today-date":
            return { ...state, todayDate: action.payload };
        case "set-active-date":
            return { ...state, activeDate: action.payload };

        case "set-final-date-change":
            return { ...state, onFinalDateChange: action.payload };
        case "set-date-change":
            return { ...state, onDateChange: action.payload };
        case "set-calendar-date-change":
            return { ...state, onCalendarDateChange: action.payload };
        case "set-input-date-change":
            return { ...state, onInputDateChange: action.payload };
        case "set-day-selected":
            return { ...state, onDaySelected: action.payload };
        case "set-month-selected":
            return { ...state, onMonthSelected: action.payload };
        case "set-year-selected":
            return { ...state, onYearSelected: action.payload };

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
        case "set-disable-calendar":
            return { ...state, disableCalendar: action.payload };
        case "set-disable-input":
            return { ...state, disableInput: action.payload };
        case "set-calendar-open-display":
            return { ...state, calendarOpenDisplay: action.payload };
        case "set-can-close-calendar":
            return { ...state, canCloseCalendar: action.payload };
        case "set-close-after-selection":
            return { ...state, closeAfterSelection: action.payload };

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

        case "set-single-input-label":
            return { ...state, singleInputLabel: action.payload };
        case "set-begin-input-label":
            return { ...state, beginInputLabel: action.payload };
        case "set-end-input-label":
            return { ...state, endInputLabel: action.payload };

        case "set-parse-string-to-date":
            return { ...state, parseStringToDate: action.payload };
        case "set-display-date-as-string":
            return { ...state, displayDateAsString: action.payload };

        case "set-theme":
            return { ...state, theme: action.payload };
        default:
            return state;
    }
}

export const datepickerReducer = (state: IDatepickerContext, action: IAction): IDatepickerContext => {
    switch (action.type) {
        case "reset":
            return { ...datepickerContextDefault, dispatch: state.dispatch };

        case "set-dates":
            console.log("setting new dates");
            return { ...state, selectedDate: action.payload.selectedDate, beginDate: action.payload.beginDate, endDate: action.payload.endDate };
        case "set-selected-date":
            return { ...state, selectedDate: action.payload };
        case "set-today-date":
            return { ...state, todayDate: action.payload };
        case "set-active-date":
            return { ...state, activeDate: action.payload };

        case "set-final-date-change":
            return { ...state, onFinalDateChange: action.payload };
        case "set-date-change":
            return { ...state, onDateChange: action.payload };
        case "set-calendar-date-change":
            return { ...state, onCalendarDateChange: action.payload };
        case "set-day-selected":
            return { ...state, onDaySelected: action.payload };
        case "set-month-selected":
            return { ...state, onMonthSelected: action.payload };
        case "set-year-selected":
            return { ...state, onYearSelected: action.payload };

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
        case "set-disable-calendar":
            return { ...state, disableCalendar: action.payload };
        case "set-calendar-open-display":
            return { ...state, calendarOpenDisplay: action.payload };
        case "set-can-close-calendar":
            return { ...state, canCloseCalendar: action.payload };
        case "set-close-after-selection":
            return { ...state, closeAfterSelection: action.payload };
        case "set-calendar-open":
            return { ...state, setCalendarOpen: action.payload };

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
        case "set-next-year-label":
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

        case "set-theme":
            return { ...state, theme: action.payload };

        default:
            return state;
    }
}

export const inputReducer = (state: IInputContext, action: IAction): IInputContext => {
    switch (action.type) {
        case "reset":
            return { ...inputContextDefault, dispatch: state.dispatch };
        case "set-input-date-change":
            return { ...state, onInputDateChange: action.payload };
        case "set-disable-input":
            return { ...state, disableInput: action.payload };

        case "set-single-input-label":
            return { ...state, singleInputLabel: action.payload };

        case "set-begin-input-label":
            return { ...state, beginInputLabel: action.payload };
        case "set-end-input-label":
            return { ...state, endInputLabel: action.payload };

        case "set-parse-string-to-date":
            return { ...state, parseStringToDate: action.payload };
        case "set-display-date-as-string":
            return { ...state, displayDateAsString: action.payload };
        default:
            return state;
    }
}
// allow input override with props
export function DatepickerInputContextProvider({ children, props }: { children: any, props?: IDatepickerProps & IInputProps }) {
    let [state, dispatch] = React.useReducer(datepickerInputReducer, { ...datepickerContextDefault, ...inputContextDefault });
    return (
        <DatepickerInputContext.Provider value={{ ...state, dispatch, ...props }}> {children} </DatepickerInputContext.Provider>
    );
}

export function DatepickerContextProvider({ children, props }: { children: any, props?: IDatepickerProps }) {
    // TODO: check if should use memo here
    let [state, dispatch] = React.useReducer(datepickerReducer, { ...datepickerContextDefault, ...props });
    return (
        <DatepickerContext.Provider value={{ ...state, dispatch }} >{children}</DatepickerContext.Provider>
    );
}

export function InputContextProvider({ children, props }: { children: any, props?: IInputProps }) {
    let [state, dispatch] = React.useReducer(inputReducer, inputContextDefault);
    return <InputContext.Provider value={{ ...state, dispatch, ...props }}></InputContext.Provider>
}
// TODO: Use these safer useContexts in all components
export const useDatepickerInputContext = () => {
    const context = useContext(DatepickerInputContext);
    if (!context) {
        throw new Error('Cannot use `useDatepickerInputContext` outsider of DatepickerInputContextProvider.');
    }
    return context;
}
export const useDatepickerContext = () => {
    const context = useContext(DatepickerContext);
    if (!context) {
        throw new Error('Cannot use `useDatepickerContext` outsider of DatepickerContextProvider.');
    }
    return context;
}
export const useInputContext = () => {
    const context = useContext(InputContext);
    if (!context) {
        throw new Error('Cannot use `useInputContext` outsider of InputContextProvider.');
    }
    return context;
}
// export const DatepickerContextConsumer = DatepickerContext.Consumer;

// TODO: add custom className applied for dates like holidays
/* 
 * @param id: id to be applied to the datepicker html element.
 */
export interface IDatepickerProps {
    selectedDate?: Date | null,

    onFinalDateChange?: (d: DateData) => {} | void,
    onDateChange?: (d: DateData) => {} | void,
    onCalendarDateChange?: (d: DateData) => {} | void,
    onDaySelected?: (d: DateData) => {} | void,
    onMonthSelected?: (d: DateData) => {} | void,
    onYearSelected?: (d: DateData) => {} | void,

    startAt?: Date | null,
    startView?: VIEW,
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,

    minDate?: Date | null,
    maxDate?: Date | null,
    dateFilter?: (date: Date | null) => boolean,
    dateFilterTestInputs?: Date[],

    rangeMode?: boolean,
    beginDate?: Date | null,
    endDate?: Date | null,

    disableMonth?: boolean,
    disableYear?: boolean,
    disableMultiyear?: boolean,

    disable?: boolean,
    disableCalendar?: boolean,
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

    theme?: DatepickerThemeStrings,
    id?: string
}

export interface IInputProps {
    onInputDateChange?: (d: DateData) => {} | void,
    disableInput?: boolean,

    switchToMonthViewLabel?: string,
    switchToYearViewLabel?: string,
    switchToMultiyearViewLabel?: string,

    singleInputLabel?: string,
    beginInputLabel?: string,
    endInputLabel?: string,

    parseStringToDate?: (input: string) => Date | null,
    displayDateAsString?: (date: Date) => string,
}

export const DatepickerPropsDefault: IDatepickerProps = {
    selectedDate: null as Date | null,

    onFinalDateChange: (d: DateData) => { },
    onDateChange: (d: DateData) => { },
    onCalendarDateChange: (d: DateData) => { },
    onDaySelected: (d: DateData) => { },
    onMonthSelected: (d: DateData) => { },
    onYearSelected: (d: DateData) => { },

    startAt: new Date(new Date().setHours(0, 0, 0, 0)) as Date | null,
    startView: 'month' as VIEW,
    firstDayOfWeek: 0,

    minDate: null as Date | null,
    maxDate: null as Date | null,
    dateFilter: (date: Date | null) => true,
    dateFilterTestInputs: [stagnantDate],

    rangeMode: false,
    beginDate: null as Date | null,
    endDate: null as Date | null,

    disableMonth: false,
    disableYear: false,
    disableMultiyear: false,

    disable: false,
    disableCalendar: false,
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

    theme: undefined,
    id: simpleUID("calendar-datepicker-")
}

export const InputPropsDefault: IInputProps = {
    onInputDateChange: (d: DateData) => { },

    disableInput: false,

    singleInputLabel: "Choose a date",
    beginInputLabel: "Choose a start date",
    endInputLabel: "end date",

    parseStringToDate: (input: string) => parseStringAsDate(input),
    displayDateAsString: (date: Date) => formatDateDisplay(date),
}

export const combinedPropsDefault = {
    ...DatepickerPropsDefault,
    ...InputPropsDefault
}