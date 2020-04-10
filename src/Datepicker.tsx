import { DateData, IDatepickerContext, IDatepickerProps, datepickerReducer, DatepickerContext } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, simpleUID, stagnantDateData, stagnantDate, compareDaysMonthsAndYears } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect, useEffect, useRef } from "react";
import './Datepicker.css';
import DatepickerHandler from "./DatepickerHandler";
import { DatepickerThemeStrings, resetTheme, DEFAULT_THEME_STRINGS, makeDatepickerThemeArrayFromStrings } from "./theming";

function Datepicker({
    selectedDate = null as Date | null,

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
    dateFilterTestInputs = [stagnantDate],

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

    theme = DEFAULT_THEME_STRINGS,
    id = simpleUID("calendar-datepicker-")
}: IDatepickerProps) {

    const props = {
        selectedDate,
        todayDate: new Date(),
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

    useEffect(() => {
        dispatch({
            type: 'set-selected-date',
            payload: selectedDate
        });
    }, [selectedDate]);

    const prevStartAt = useRef(startAt);
    useEffect(() => {
        if (startAt != null && (prevStartAt.current == null || compareDaysMonthsAndYears(prevStartAt.current, startAt))) {
            dispatch({
                type: 'set-start-at',
                payload: startAt
            });
            prevStartAt.current = startAt;
        }
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

    /** Accounting for date filter changes while relying on the notion that the date filter will be different given user inputs, dateFilterTestInputs. */
    const testDateFilter = useCallback(() => {
        let ret = [] as boolean[];
        for (let i = 0; i < dateFilterTestInputs.length; i++) {
            ret[i] = dateFilter(dateFilterTestInputs[i]);
        }
        return ret;
    }, [dateFilterTestInputs, dateFilter]);

    const prevDateFilterResults = useRef(testDateFilter());
    const differenceInDateFilter = () => {
        for (let i = 0; i < dateFilterTestInputs.length; i++) {
            if (dateFilter(dateFilterTestInputs[i]) !== prevDateFilterResults.current[i]) {
                return true;
            }
        }
        return false;
    }

    const prevCompareDateFilter = useRef(differenceInDateFilter());
    useEffect(() => {
        const compare = differenceInDateFilter();
        if (prevCompareDateFilter.current !== compare) {
            let res = testDateFilter();

            dispatch({
                type: 'set-date-filter',
                payload: dateFilter
            });
            prevDateFilterResults.current = res;
            prevCompareDateFilter.current = compare;
        }
    }, [differenceInDateFilter(), testDateFilter, dateFilter]);

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
            type: 'set-calendar-open',
            payload: setCalendarOpen
        });
    }, [setCalendarOpen]);


    useEffect(() => {
        dispatch({
            type: 'set-format-month-label',
            payload: formatMonthLabel
        });
    }, [formatMonthLabel(stagnantDate)]);
    useEffect(() => {
        dispatch({
            type: 'set-format-month-text',
            payload: formatMonthText
        });
    }, [formatMonthText(stagnantDate)]);

    useEffect(() => {
        dispatch({
            type: 'set-format-year-label',
            payload: formatYearLabel
        });
    }, [formatYearLabel(stagnantDate)]);
    useEffect(() => {
        dispatch({
            type: 'set-format-year-text',
            payload: formatYearText
        });
    }, [formatYearText(stagnantDate)]);

    useEffect(() => {
        dispatch({
            type: 'set-format-multiyear-label',
            payload: formatMultiyearLabel
        });
    }, [formatMultiyearLabel(stagnantDate)]);
    useEffect(() => {
        dispatch({
            type: 'set-format-multiyear-text',
            payload: formatMultiyearText
        });
    }, [formatMultiyearText(stagnantDate)]);

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
        dispatch({
            type: 'set-theme',
            payload: theme
        });
    }, [theme]);
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

    const _applyTheme = useCallback((theme: DatepickerThemeStrings) => {
        // const root = document.getElementsByTagName('html')[0];
        const element = document.getElementById(id);
        if (element) element.style.cssText = makeDatepickerThemeArrayFromStrings(resetTheme(theme)).join(';');
    }, [id, theme]);

    useLayoutEffect(() => {
        _applyTheme(theme);
    }, [_applyTheme, theme]);

    return (
        <DatepickerContext.Provider value={{ ...state, dispatch }}>
            <DatepickerHandler
                id={id}></DatepickerHandler>
        </DatepickerContext.Provider>
    );
}

export default Datepicker;