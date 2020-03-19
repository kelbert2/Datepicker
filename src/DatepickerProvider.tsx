import React, { useCallback, useLayoutEffect } from "react";
import { getMonthNames, getMonth, getYear, parseStringAsDate, formatDateDisplay } from "./CalendarUtils";
import './Datepicker.css';
import DatepickerNoInput from "./DatepickerNoInput";
import DatepickerContext, { DateData, VIEW, YEARS_PER_PAGE, IDatepickerProps, IDatepickerContext, datepickerReducer } from "./DatepickerContext";
import { DEFAULT_THEME_STRINGS, DatepickerThemeStrings, resetTheme } from "./theming";

/** Creates a datepicker without an input component. */
function DatepickerProvider({
    selectedDate = null as Date | null,
    todayDate = new Date() as Date | null,

    onDateChange = (d: DateData) => { },
    onDaySelected = (d: DateData) => { },
    onMonthSelected = (d: DateData) => { },
    onYearSelected = (d: DateData) => { },

    startAt = new Date() as Date | null,
    startView = 'month' as VIEW,
    firstDayOfWeek = 0,

    minDate = null as Date | null,
    maxDate = null as Date | null,
    dateFilter = (date: Date | null) => true,

    rangeMode = false,
    beginDate = null as Date | null,
    endDate = null as Date | null,

    disableMonth = false,
    disableYear = false,
    disableMultiyear = false,

    disable = false,
    disableCalendar = false,
    disableInput = false,
    calendarOpenDisplay = 'popup',
    canCloseCalendar = true,
    closeAfterSelection = true,
    setCalendarOpen = false,

    formatMonthLabel = (date: Date) =>
        getMonthNames('short')[getMonth(date)].toLocaleUpperCase() + ' ' + getYear(date),
    formatMonthText = (date: Date) => getMonthNames('short')[getMonth(date)].toLocaleUpperCase(),

    formatYearLabel = (date: Date) => date.getFullYear().toString(),
    formatYearText = (date: Date) => date.getFullYear().toString(),

    formatMultiyearLabel = (date: Date, minYearOfPage?: number) => {
        if (minYearOfPage) {
            const maxYearOfPage = minYearOfPage + YEARS_PER_PAGE - 1;
            return `${minYearOfPage} \u2013 ${maxYearOfPage}`;
        }
        return 'Years'
    },
    formatMultiyearText = (date: Date) => '',

    calendarLabel = 'Calendar',
    openCalendarLabel = 'Open calendar',

    nextMonthLabel = 'Next month',
    nextYearLabel = 'Next year',
    nextMultiyearLabel = 'Next years',

    prevMonthLabel = 'Previous month',
    prevMultiyearLabel = 'Previous years',
    prevYearLabel = 'Previous year',

    switchToMonthViewLabel = 'Switch to month view',
    switchToYearViewLabel = 'Switch to year view',
    switchToMultiyearViewLabel = 'Switch to multi-year view',

    singleInputLabel = "Choose a date",
    beginInputLabel = "Choose a start date",
    endInputLabel = "end date",

    parseStringToDate = (input: string) => parseStringAsDate(input),
    displayDateAsString = (date: Date) => formatDateDisplay(date),

    theme = DEFAULT_THEME_STRINGS
}: IDatepickerProps) {

    const props = {
        selectedDate,
        todayDate,
        activeDate: startAt ? startAt : new Date(),

        onDateChange,
        onDaySelected,
        onMonthSelected,
        onYearSelected,

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
        disableCalendar,
        disableInput,
        calendarOpenDisplay,
        canCloseCalendar,
        closeAfterSelection,
        setCalendarOpen,

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
        prevMultiyearLabel,
        prevYearLabel,

        switchToMonthViewLabel,
        switchToYearViewLabel,
        switchToMultiyearViewLabel,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,

        theme
    } as IDatepickerContext;

    /** Provide access to context for children with input values. */
    const DatepickerContextProvider = ({ children }: { children: any }) => {
        let [state, dispatch] = React.useReducer(datepickerReducer, props);
        return (
            <DatepickerContext.Provider value={{ ...state, dispatch }}> {children} </DatepickerContext.Provider>
        );
    }

    /** Replace element's styles with input. */
    const _applyThemeLocal = useCallback((theme: DatepickerThemeStrings) => {
        // TODO: May pass in an id instead so can only target this specific datepicker
        const datepickers = (document.getElementsByClassName('datepicker-container') as HTMLCollectionOf<HTMLElement>);

        const cleanTheme = resetTheme(theme);

        Object.keys(cleanTheme).map(key => {
            const value = cleanTheme[key];
            for (let i = 0; i < datepickers.length; i++) {
                datepickers[i].style.setProperty(key, value);
            }
            return key;
        });
    }, []);

    /** When style inputs change, update css. */
    useLayoutEffect(() => {
        _applyThemeLocal(theme);
    }, [_applyThemeLocal, theme]);

    // TODO: May refactor to have Calendar be called here
    return (
        <DatepickerContextProvider>
            <DatepickerNoInput
                className='datepicker-container'
            ></DatepickerNoInput>
        </DatepickerContextProvider>
    )
}

export default DatepickerProvider;