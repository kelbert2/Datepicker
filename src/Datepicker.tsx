import DatepickerContext, { DateData, IDatepickerContext, reducer, IDatepickerProps, DatepickerTheme } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, makeDatepickerThemeArray } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect, useEffect } from "react";
import Input from "./Input";
import './Datepicker.css';

export const DEFAULT_THEME = {
    "--color": "salmon",
    "--color-light": "rgb(250, 186, 160)",
    "--on-color": "var(--background)",
    "--on-color-light": "var(--background)",

    "--background": "white",
    "--neutral-light": "rgba(0, 0, 0, .2)",
    "--neutral": "rgba(0, 0, 0, .3)",
    "--neutral-dark": "rgba(0, 0, 0, .4)",
    "--on-background": "black",
    "--on-neutral-light": "var(--on-background)",
    "--on-neutral": "var(--background)",

    "--weekday-row": "var(--background)",
    "--on-weekday-row": "var(--neutral)",

    "--divider": "var(--neutral-light)",
    "--label-text": "var(--neutral - dark)",

    "--button-background": "transparent",
    "--on-button": "var(--neutral - dark)",
    "--button-border": "none",

    "--hover": "var(--neutral)",
    "--on-hover": "var(--on-neutral)",
    "--hover-range": "var(--neutral-light)",
    "--on-hover-range": "var(--on-neutral-light)",

    "--today": "var(--neutral)",

    "--disabled": "transparent",
    "--on-disabled": "var(--neutral)"
} as DatepickerTheme;


const resetTheme = (theme: DatepickerTheme) => {
    let retTheme = {} as DatepickerTheme;
    retTheme["--color"] = theme["--color"] ? theme["--color"] : DEFAULT_THEME["--color"];
    retTheme["--color-light"] = theme["--color-light"] ? theme["--color-light"] : DEFAULT_THEME["--color-light"];
    retTheme["--on-color"] = theme["--on-color"] ? theme["--on-color"] : DEFAULT_THEME["--on-color"];
    retTheme["--on-color-light"] = theme["--on-color-light"] ? theme["--on-color-light"] : DEFAULT_THEME["--on-color-light"];

    retTheme["--background"] = theme["--background"] ? theme["--background"] : DEFAULT_THEME["--background"];
    retTheme["--neutral-light"] = theme["--neutral-light"] ? theme["--neutral-light"] : DEFAULT_THEME["--neutral-light"];
    retTheme["--neutral"] = theme["--neutral"] ? theme["--neutral"] : DEFAULT_THEME["--neutral"];
    retTheme["--neutral-dark"] = theme["--neutral-dark"] ? theme["--neutral-dark"] : DEFAULT_THEME["--neutral-dark"];
    retTheme["--on-background"] = theme["--on-background"] ? theme["--on-background"] : DEFAULT_THEME["--on-background"];
    retTheme["--on-neutral-light"] = theme["--on-neutral-light"] ? theme["--on-neutral-light"] : DEFAULT_THEME["--on-neutral-light"];
    retTheme["--on-neutral"] = theme["--on-neutral"] ? theme["--on-neutral"] : DEFAULT_THEME["--on-neutral"];

    retTheme["--weekday-row"] = theme["--weekday-row"] ? theme["--weekday-row"] : DEFAULT_THEME["--weekday-row"];
    retTheme["--on-weekday-row"] = theme["--on-weekday-row"] ? theme["--on-weekday-row"] : DEFAULT_THEME["--on-weekday-row"];

    retTheme["--divider"] = theme["--divider"] ? theme["--divider"] : DEFAULT_THEME["--divider"];
    retTheme["--label-text"] = theme["--label-text"] ? theme["--label-text"] : DEFAULT_THEME["--label-text"];

    retTheme["--button-background"] = theme["--button-background"] ? theme["--button-background"] : DEFAULT_THEME["--button-background"];
    retTheme["--on-button"] = theme["--on-button"] ? theme["--on-button"] : DEFAULT_THEME["--on-button"];
    retTheme["--button-border"] = theme["--button-border"] ? theme["--button-border"] : DEFAULT_THEME["--button-border"];

    retTheme["--hover"] = theme["--hover"] ? theme["--hover"] : DEFAULT_THEME["--hover"];
    retTheme["--on-hover"] = theme["--on-hover"] ? theme["--on-hover"] : DEFAULT_THEME["--on-hover"];
    retTheme["--hover-range"] = theme["--hover-range"] ? theme["--hover-range"] : DEFAULT_THEME["--hover-range"];
    retTheme["--on-hover-range"] = theme["--on-hover-range"] ? theme["--on-hover-range"] : DEFAULT_THEME["--on-hover-range"];

    retTheme["--today"] = theme["--today"] ? theme["--today"] : DEFAULT_THEME["--today"];

    retTheme["--disabled"] = theme["--disabled"] ? theme["--disabled"] : DEFAULT_THEME["--disabled"];
    retTheme["--on-disabled"] = theme["--on-disabled"] ? theme["--on-disabled"] : DEFAULT_THEME["--on-disabled"];

    return retTheme;
}

function Datepicker({
    selectedDate = null as Date | null,
    todayDate = new Date() as Date | null,
    activeDate = new Date() as Date,

    onDateChange = (d: DateData) => { },
    onCalendarDateChange = (d: DateData) => { },
    onInputDateChange = (d: DateData) => { },
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

    theme = DEFAULT_THEME
}: IDatepickerProps) {
    const props = {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange,
        onCalendarDateChange,
        onInputDateChange,
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
        calendarOpenDisplay: calendarOpenDisplay,
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

    const DatepickerContextProvider = ({ children }: { children: any }) => {
        let [state, dispatch] = React.useReducer(reducer, props);
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
    // }, []);

    // /** When style inputs change, update css. */
    // useLayoutEffect(() => {
    //     _applyTheme();
    // }, [_applyTheme]);

    const _applyThemeGlobal = useCallback((theme: DatepickerTheme) => {
        // TODO: Shouldn't have to check for empty string, but it seems to be re-rendering with default value
        // was doing that because it was resetting the css for Minimum date in Test Display
        // if (theme.length > 0) {

        const root = document.getElementsByTagName('html')[0];
        root.style.cssText = makeDatepickerThemeArray(resetTheme(theme)).join(';');
    }, []);

    /** When style inputs change, update css. */
    // useLayoutEffect(() => {
    //     _applyTheme();
    // }, [_applyTheme]);
    // Object.keys(theme).forEach(key => {
    //     const value = (theme as any)[key];
    //     document.documentElement.style.setProperty(key, value);
    // });
    // _applyThemeGlobal(blueThemeArray);
    // });

    // useLayoutEffect(() => {
    //     console.log("theme array prop on mount:");
    //     console.log(themeArray);
    //     _applyThemeGlobal(themeArray);
    // });
    useEffect(() => {
        console.log("running on mount");
    }, []);
    useEffect(() => {
        console.log("running on change");
    })

    useLayoutEffect(() => {
        // Object.keys(theme).forEach(key => {
        //     const value = (theme as any)[key];
        //     document.documentElement.style.setProperty(key, value);
        // });
        console.log("theme prop:");
        console.log(theme);
        _applyThemeGlobal(theme);

        // _applyThemeGlobal(Object.keys(theme).map((key) => {
        //     const value = (theme as any)[key];
        //     // console.log(key + ": " + value);
        //     return key + ": " + value;
        // }));

        // const root = document.getElementsByTagName('html')[0];
        // root.style.cssText = (blueThemeArray).join(";");
        // console.log((blueThemeArray).map((item) => {
        //     return item + ";";
        // }).join());
        // console.log(blueThemeArray.join(";"));
        // root.style.cssText = (Object.keys(theme).map((key) => {
        //     const value = (theme as any)[key];
        //     console.log(key + ": " + value);
        //     return key + ": " + value;
        // })).join(';');

    }, [_applyThemeGlobal, theme]);

    const makeArray = () => {
        let array = [] as string[];
        Object.keys(theme).forEach(key => {
            const value = (theme as any)[key];
            array.push(key + ": " + value);
        });
        return array;
    }

    // TODO: May refactor to have Calendar be called here
    return (
        <DatepickerContextProvider>
            {/* <button
                onClick={() => _applyTheme()}
            >Theme</button> */}
            <Input></Input>
        </DatepickerContextProvider >
    )
}

export default Datepicker;