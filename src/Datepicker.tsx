import { DateData, IDatepickerContext, datepickerInputReducer, IDatepickerProps, IAction, datepickerReducer, DatepickerContext } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, makeDatepickerThemeArrayFromStrings } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect } from "react";
import './Datepicker.css';
import DatepickerHandler from "./DatepickerHandler";
import { DatepickerThemeStrings, resetTheme } from "./theming";

function Datepicker({
    selectedDate = null as Date | null,
    todayDate = new Date() as Date | null,

    onFinalDateChange = (d: DateData) => { },
    onDateChange = (d: DateData) => { },
    onCalendarDateChange = (d: DateData) => { },
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

    theme = {
        "--color": "salmon",
        "--color-light": "rgb(250, 186, 160)",
        "--on-color": "white",
        "--on-color-light": "black",

        "--background": "white",
        "--neutral-light": "rgba(0, 0, 0, .1)",
        "--neutral": "rgba(0, 0, 0, .4)",
        "--neutral-dark": "rgba(0, 0, 0, .5)",
        "--on-background": "black"
    }

}: IDatepickerProps) {

    const props = {
        selectedDate,
        todayDate,
        activeDate: startAt ? startAt : new Date(),

        onFinalDateChange,
        onDateChange,
        onCalendarDateChange,
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

        theme
    } as IDatepickerContext;

    const DatepickerContextProvider = ({ children }: { children: any }) => {
        let [state, dispatch] = React.useReducer(datepickerReducer, props);
        return (
            <DatepickerContext.Provider value={{ ...state, dispatch }}> {children} </DatepickerContext.Provider>
        );
    }
    // const DatepickerContextConsumer = DatepickerContext.Consumer;

    // /** Replace styles with input. */
    // const _applyTheme = useCallback(() => {
    //     //for (let key in theme) {
    //     Object.keys(theme).forEach(key => {
    //         const value = (theme as any)[key];
    //         document.documentElement.style.setProperty(key, value);
    //     });
    // }, [theme]);

    // /** Set theme on mount. */
    // useLayoutEffect(() => {
    //     _applyTheme();
    // });

    // /** When style inputs change, update css. */
    // useLayoutEffect(() => {
    //     _applyTheme();
    // }, [_applyTheme]);
    // Object.keys(theme).forEach(key => {
    //     const value = (theme as any)[key];
    //     document.documentElement.style.setProperty(key, value);
    // });
    // }, [theme]);

    const _applyThemeGlobal = useCallback((theme: DatepickerThemeStrings) => {
        const root = document.getElementsByTagName('html')[0];
        root.style.cssText = makeDatepickerThemeArrayFromStrings(resetTheme(theme)).join(';');
    }, []);

    useLayoutEffect(() => {
        _applyThemeGlobal(theme);
    }, [_applyThemeGlobal, theme]);

    // TODO: May refactor to have Calendar be called here
    return (
        <DatepickerContextProvider>
            <DatepickerHandler></DatepickerHandler>
        </DatepickerContextProvider>
    )
}

export default Datepicker;