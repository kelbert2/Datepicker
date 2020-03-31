import { DateData, IDatepickerContext, IDatepickerProps, IInputProps, IInputContext, datepickerReducer, DatepickerContext, InputContext, inputReducer } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, makeDatepickerThemeArrayFromStrings, simpleUID } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect, useEffect, useState } from "react";
import Input from "./Input";
import './Datepicker.css';
import { DEFAULT_THEME_STRINGS, DatepickerThemeStrings, resetTheme } from "./theming";

// TODO: add support for Moment.js and non-native date adaptors
// TODO: add in class name, filter object to apply class to dates that support that filter
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

    let [state, dispatch] = React.useReducer(datepickerReducer, props);

    const inputProps = {
        onInputDateChange,

        disableInput,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,
    } as IInputContext;

    let [inputState, inputDispatch] = React.useReducer(inputReducer, inputProps);
    // may need to add dispatch so can modify this without remounting all children ^

    const [_UID] = useState(simpleUID("calendar-datepicker-"));

    // The below works, but would have to do for all input props, which doesn't feel ideal.
    useEffect(() => {
        dispatch({
            type: 'set-selected-date',
            payload: selectedDate
        });
    }, [selectedDate]);
    useEffect(() => {
        dispatch({
            type: 'set-today-date',
            payload: todayDate
        });
    }, [todayDate]);

    useEffect(() => {
        dispatch({
            type: 'set-final-date-change',
            payload: onFinalDateChange
        });
    }, [onFinalDateChange]);
    useEffect(() => {
        dispatch({
            type: 'set-date-change',
            payload: onDateChange
        });
    }, [onDateChange]);
    useEffect(() => {
        dispatch({
            type: 'set-calendar-date-change',
            payload: onCalendarDateChange
        });
    }, [onCalendarDateChange]);
    useEffect(() => {
        inputDispatch({
            type: 'set-input-date-change',
            payload: onInputDateChange
        });
    }, [onInputDateChange]);
    useEffect(() => {
        dispatch({
            type: 'set-day-selected',
            payload: onDaySelected
        });
    }, [onDaySelected]);
    useEffect(() => {
        dispatch({
            type: 'set-month-selected',
            payload: onMonthSelected
        });
    }, [onMonthSelected]);
    useEffect(() => {
        dispatch({
            type: 'set-year-selected',
            payload: onYearSelected
        });
    }, [onYearSelected]);

    useEffect(() => {
        dispatch({
            type: 'set-start-at',
            payload: startAt
        });
    }, [startAt]);
    useEffect(() => {
        dispatch({
            type: 'set-start-view',
            payload: startView
        });
    }, [startView]);
    useEffect(() => {
        dispatch({
            type: 'set-first-day-of-week',
            payload: firstDayOfWeek
        });
    }, [firstDayOfWeek]);

    useEffect(() => {
        dispatch({
            type: 'set-min-date',
            payload: minDate
        });
    }, [minDate]);
    useEffect(() => {
        dispatch({
            type: 'set-max-date',
            payload: maxDate
        });
    }, [maxDate]);
    useEffect(() => {
        dispatch({
            type: 'set-date-filter',
            payload: dateFilter
        });
    }, [dateFilter]);

    useEffect(() => {
        dispatch({
            type: 'set-range-mode',
            payload: rangeMode
        });
    }, [rangeMode]);
    useEffect(() => {
        dispatch({
            type: 'set-begin-date',
            payload: beginDate
        });
    }, [beginDate]);
    useEffect(() => {
        dispatch({
            type: 'set-end-date',
            payload: endDate
        });
    }, [endDate]);

    useEffect(() => {
        dispatch({
            type: 'set-disable-month',
            payload: disableMonth
        });
    }, [disableMonth]);
    useEffect(() => {
        dispatch({
            type: 'set-disable-year',
            payload: disableYear
        });
    }, [disableYear]);
    useEffect(() => {
        dispatch({
            type: 'set-disable-multiyear',
            payload: disableMultiyear
        });
    }, [disableMultiyear]);


    useEffect(() => {
        dispatch({
            type: 'set-disable',
            payload: disable
        });
    }, [disable]);
    useEffect(() => {
        dispatch({
            type: 'set-disable-calendar',
            payload: disableCalendar
        });
    }, [disableCalendar]);
    useEffect(() => {
        inputDispatch({
            type: 'set-disable-input',
            payload: disableInput
        });
    }, [disableInput]);
    useEffect(() => {
        dispatch({
            type: 'set-calendar-display',
            payload: calendarOpenDisplay
        });
    }, [calendarOpenDisplay]);
    useEffect(() => {
        dispatch({
            type: 'set-can-close-calendar',
            payload: canCloseCalendar
        });
    }, [canCloseCalendar]);
    useEffect(() => {
        dispatch({
            type: 'set-close-after-selection',
            payload: closeAfterSelection
        });
    }, [closeAfterSelection]);

    useEffect(() => {
        dispatch({
            type: 'set-format-month-label',
            payload: formatMonthLabel
        });
    }, [formatMonthLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-format-month-text',
            payload: formatMonthText
        });
    }, [formatMonthText]);

    useEffect(() => {
        dispatch({
            type: 'set-format-year-label',
            payload: formatYearLabel
        });
    }, [formatYearLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-format-year-text',
            payload: formatYearText
        });
    }, [formatYearText]);

    useEffect(() => {
        dispatch({
            type: 'set-format-multiyear-label',
            payload: formatMultiyearLabel
        });
    }, [formatMultiyearLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-format-multiyear-text',
            payload: formatMultiyearText
        });
    }, [formatMultiyearText]);

    useEffect(() => {
        dispatch({
            type: 'set-calendar-label',
            payload: calendarLabel
        });
    }, [calendarLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-open-calendar-label',
            payload: openCalendarLabel
        });
    }, [openCalendarLabel]);

    useEffect(() => {
        dispatch({
            type: 'set-next-month-label',
            payload: nextMonthLabel
        });
    }, [nextMonthLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-next-year-label',
            payload: nextYearLabel
        });
    }, [nextYearLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-next-multiyear-label',
            payload: nextMultiyearLabel
        });
    }, [nextMultiyearLabel]);

    useEffect(() => {
        dispatch({
            type: 'set-prev-month-label',
            payload: prevMonthLabel
        });
    }, [prevMonthLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-prev-year-label',
            payload: prevYearLabel
        });
    }, [prevYearLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-prev-multiyear-label',
            payload: prevMultiyearLabel
        });
    }, [prevMultiyearLabel]);

    useEffect(() => {
        dispatch({
            type: 'set-switch-to-month-view-label',
            payload: switchToMonthViewLabel
        });
    }, [switchToMonthViewLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-switch-to-year-view-label',
            payload: switchToYearViewLabel
        });
    }, [switchToYearViewLabel]);
    useEffect(() => {
        dispatch({
            type: 'set-switch-to-multiyear-view-label',
            payload: switchToMultiyearViewLabel
        });
    }, [switchToMultiyearViewLabel]);

    useEffect(() => {
        inputDispatch({
            type: 'set-single-input-label',
            payload: singleInputLabel
        });
    }, [singleInputLabel]);
    useEffect(() => {
        inputDispatch({
            type: 'set-begin-input-label',
            payload: beginInputLabel
        });
    }, [beginInputLabel]);
    useEffect(() => {
        inputDispatch({
            type: 'set-end-input-label',
            payload: endInputLabel
        });
    }, [endInputLabel]);

    useEffect(() => {
        inputDispatch({
            type: 'set-parse-string-to-date',
            payload: parseStringToDate
        });
    }, [parseStringToDate]);
    useEffect(() => {
        inputDispatch({
            type: 'set-display-date-as-string',
            payload: displayDateAsString
        });
    }, [displayDateAsString]);

    useEffect(() => {
        dispatch({
            type: 'set-theme',
            payload: theme
        });
    }, [theme]);

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
    // const DatepickerContextProvider = ({ children }: { children: any }) => {
    //     let [state, dispatch] = React.useReducer(datepickerReducer, props);
    //     return (
    //         <DatepickerContext.Provider value={{ ...state, dispatch }}>
    //             <InputContext.Provider value={inputProps}>
    //                 {children}
    //             </InputContext.Provider>
    //         </DatepickerContext.Provider>
    //     );
    // };
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
        // <DatepickerContextProvider
        // props={props}
        // inputProps={inputProps}
        // >
        <DatepickerContext.Provider value={{ ...state, dispatch }}>
            <InputContext.Provider value={inputProps}>
                {/* <button
                onClick={() => _applyTheme()}
            >Theme</button> */}
                <Input></Input>
                {/* </DatepickerContextProvider > */}
            </InputContext.Provider>
        </DatepickerContext.Provider>
    )
}

export default DatepickerInput;