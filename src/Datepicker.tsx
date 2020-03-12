import DatepickerContext, { DateData, IDatepickerContext, reducer, IDatepickerProps } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect } from "react";
import Input, { blueThemeArray } from "./Input";
import './Datepicker.css';

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
    },
    themeArray = []
}: IDatepickerProps) {
    // "--color: salmon",
    // "--color-light: rgb(250, 186, 160)",
    // "--on-color: white",
    // "--on-color-light: black",

    // "--background: white",
    // "--neutral-light: rgba(0, 0, 0, .1)",
    // "--neutral: rgba(0, 0, 0, .4)",
    // "--neutral-dark: rgba(0, 0, 0, .5)",
    // "--on-background: black"

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

        theme,
        themeArray
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
    const _applyThemeGlobal = useCallback((theme: string[]) => {
        // TODO: Shouldn't have to check for empty string, but it seems to be re-rendering with default value
        if (theme.length > 0) {
            const root = document.getElementsByTagName('html')[0];
            root.style.cssText = theme.join(';');
        }
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
    useLayoutEffect(() => {
        // Object.keys(theme).forEach(key => {
        //     const value = (theme as any)[key];
        //     document.documentElement.style.setProperty(key, value);
        // });
        console.log("theme array prop:");
        console.log(themeArray);
        _applyThemeGlobal(themeArray);

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

    }, [_applyThemeGlobal, themeArray]);

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