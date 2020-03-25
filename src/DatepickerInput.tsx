import { DateData, IDatepickerContext, IDatepickerProps, IInputProps, IInputContext, datepickerReducer, DatepickerContext, InputContext } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, makeDatepickerThemeArrayFromStrings, simpleUID } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect, useEffect, useState } from "react";
import Input from "./Input";
import './Datepicker.css';
import { DEFAULT_THEME_STRINGS, DatepickerThemeStrings, resetTheme } from "./theming";

function DatepickerInput({
    selectedDate = null as Date | null,
    todayDate = new Date() as Date | null,

    onFinalDateChange = (d: DateData) => { },
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

    theme = DEFAULT_THEME_STRINGS
}: IDatepickerProps & IInputProps) {

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

        theme
    } as IDatepickerContext;

    const inputProps = {
        onInputDateChange,

        disableInput,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,
    } as IInputContext;

    const [_UID] = useState(simpleUID("calendar-datepicker-"));

    useEffect(() => {
        console.log("Datepicker input mounted " + _UID);
        return () => {
            console.log("Datepicker input unmounted " + _UID);
        }
    }, [_UID]);

    // const DatepickerContextProvider = ({ props, inputProps, children }: { props: IDatepickerContext, inputProps: IInputContext, children: any }) => {
    //     let [state, dispatch] = React.useReducer(datepickerReducer, props);
    //     return (
    //         <DatepickerContext.Provider value={{ ...state, dispatch }}>
    //             <InputContext.Provider value={inputProps}>
    //                 {children}
    //             </InputContext.Provider>
    //         </DatepickerContext.Provider>
    //     );
    // }
    const DatepickerContextProvider = ({ children }: { children: any }) => {
        let [state, dispatch] = React.useReducer(datepickerReducer, props);
        return (
            <DatepickerContext.Provider value={{ ...state, dispatch }}>
                <InputContext.Provider value={inputProps}>
                    {children}
                </InputContext.Provider>
            </DatepickerContext.Provider>
        );
    };
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

    // TODO: reference by ID so can keep it just to this specific datepicker
    const _applyThemeGlobal = useCallback((theme: DatepickerThemeStrings) => {
        const root = document.getElementsByTagName('html')[0];
        root.style.cssText = makeDatepickerThemeArrayFromStrings(resetTheme(theme)).join(';');
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

    // const makeArray = () => {
    //     let array = [] as string[];
    //     Object.keys(theme).forEach(key => {
    //         const value = (theme as any)[key];
    //         array.push(key + ": " + value);
    //     });
    //     return array;
    // }

    // TODO: May refactor to have Calendar be called here
    return (
        <DatepickerContextProvider
        // props={props}
        // inputProps={inputProps}
        >
            {/* <button
                onClick={() => _applyTheme()}
            >Theme</button> */}
            <Input></Input>
        </DatepickerContextProvider >
    )
}

export default DatepickerInput;