import { DateData, IDatepickerContext, IDatepickerProps, IInputProps, IInputContext, datepickerReducer, DatepickerContext, InputContext, inputReducer, InputPropsDefault, DatepickerPropsDefault, combinedPropsDefault } from "./DatepickerContext";
import { VIEW, getMonthNames, getMonth, getYear, YEARS_PER_PAGE, parseStringAsDate, formatDateDisplay, simpleUID, stagnantDate, stagnantDateString, compareDaysMonthsAndYears } from "./CalendarUtils";
import React, { useCallback, useLayoutEffect, useEffect, useRef } from "react";
import Input from "./Input";
import './Datepicker.css';
import { DEFAULT_THEME_STRINGS, DatepickerThemeStrings, resetTheme, makeDatepickerThemeArrayFromStrings } from "./theming";

// TODO: Big change: add support for Moment.js and non-native date adaptors
// TODO: Additional Input: {filter, className} pairs that apply a class for dates that pass a certain filter
// Every input can be changed except the on* functions
function DatepickerInput({
    selectedDate = null as Date | null,

    onFinalDateChange = (d: DateData) => { },
    onDateChange = (d: DateData) => { },
    onCalendarDateChange = (d: DateData) => { },
    onInputDateChange = (d: DateData) => { },
    onDaySelected = (d: DateData) => { },
    onMonthSelected = (d: DateData) => { },
    onYearSelected = (d: DateData) => { },

    startAt = new Date(new Date().setHours(0, 0, 0, 0)) as Date | null,
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

    theme = undefined,
    id = simpleUID("calendar-datepicker-")
}: IDatepickerProps & IInputProps) {

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
        dateFilterTestInputs,

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

    /* Update values on input changes */
    // React uses Object.is to compare in order to determine when to re-render.


    // as use effects, all of these are emitting on object mount

    // const onFinalDateChangeWrapper = useCallback((dateData: DateData) => {
    //     return onFinalDateChange(dateData);
    // }, [onFinalDateChange]);

    // const onFinalDateChangeClone = () => {
    //     let dummyFinalDateChange = onFinalDateChange;

    // }
    // const prevFinalDateChange = useRef(onFinalDateChange(stagnantDateData));
    // useEffect(() => {
    //     if (prevFinalDateChange.current != onFinalDateChange(stagnantDateData)) {
    //         console.log("trying to update onFinalDateChange: " + onFinalDateChange(stagnantDateData));
    //         dispatch({
    //             type: 'set-final-date-change',
    //             payload: onFinalDateChange
    //         });
    //     }
    //     // currently is triggering a re-render when rendering the parent display
    // }, [onFinalDateChange(stagnantDateData)]);

    // useEffect(() => {
    //     dispatch({
    //         type: 'set-date-change',
    //         payload: onDateChange
    //     });
    // }, [onDateChange(stagnantDateData)]);
    // useEffect(() => {
    //     dispatch({
    //         type: 'set-calendar-date-change',
    //         payload: onCalendarDateChange
    //     });
    // }, [onCalendarDateChange(stagnantDateData)]);
    // useEffect(() => {
    //     inputDispatch({
    //         type: 'set-input-date-change',
    //         payload: onInputDateChange
    //     });
    // }, [onInputDateChange(stagnantDateData)]);
    // useEffect(() => {
    //     dispatch({
    //         type: 'set-day-selected',
    //         payload: onDaySelected
    //     });
    // }, [onDaySelected(stagnantDateData)]);
    // useEffect(() => {
    //     dispatch({
    //         type: 'set-month-selected',
    //         payload: onMonthSelected
    //     });
    // }, [onMonthSelected(stagnantDateData)]);
    // useEffect(() => {
    //     dispatch({
    //         type: 'set-year-selected',
    //         payload: onYearSelected
    //     });
    // }, [onYearSelected(stagnantDateData)]);

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

    /* Update on minDate. */
    const prevMinDate = useRef(minDate);
    useEffect(() => {
        if (prevMinDate.current != minDate) {
            dispatch({
                type: 'set-min-date',
                payload: minDate
            });
            if (minDate) {
                // If selected date is less than the minimum, make it the minimum
                if (selectedDate && compareDaysMonthsAndYears(selectedDate, minDate) < 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: minDate
                    });
                }
                if (beginDate && compareDaysMonthsAndYears(beginDate, minDate) < 0) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: minDate
                    });
                }
                if (endDate && compareDaysMonthsAndYears(endDate, minDate) < 0) {
                    dispatch({
                        type: 'set-end-date',
                        payload: minDate
                    });
                }
            }
        }
        // TODO: see if would be better to check in input and update if see minDate change
        // updateSelectedDatesOnMinDateChange(); // already doing in Input
    }, [minDate, selectedDate, beginDate, endDate]);

    /* Update on maxDate. */
    const prevMaxDate = useRef(maxDate);
    useEffect(() => {
        if (prevMaxDate.current != maxDate) {
            dispatch({
                type: 'set-max-date',
                payload: maxDate
            });
            // If selected date is greater than the maximum, make it the maximum
            if (maxDate) {
                if (selectedDate && compareDaysMonthsAndYears(selectedDate, maxDate) > 0) {
                    dispatch({
                        type: 'set-selected-date',
                        payload: maxDate
                    });
                }
                if (beginDate && compareDaysMonthsAndYears(beginDate, maxDate) > 0) {
                    dispatch({
                        type: 'set-begin-date',
                        payload: maxDate
                    });
                }
                if (endDate && compareDaysMonthsAndYears(endDate, maxDate) > 0) {
                    dispatch({
                        type: 'set-end-date',
                        payload: maxDate
                    });
                }
            }
        }
    }, [maxDate, selectedDate, beginDate, endDate]);

    /* Update dateFilterTestInputs */
    /** Compare dateFilterTestInputs array to previously stored version. */
    const prevDateFilterTestInputs = useRef(dateFilterTestInputs);
    const differenceInDateFilterTestInputs = useCallback(() => {
        if (prevDateFilterTestInputs.current.length !== dateFilterTestInputs.length) {
            return true;
        }
        for (let i = 0; i < dateFilterTestInputs.length; i++) {
            if (i < prevDateFilterTestInputs.current.length) {
                if (prevDateFilterTestInputs.current[i] !== dateFilterTestInputs[i]) return true;
            } else {
                return true;
            }
        }
        return false;
    }, [dateFilterTestInputs, prevDateFilterTestInputs]);
    useEffect(() => {
        if (differenceInDateFilterTestInputs()) {
            // console.log(differenceInDateFilterTestInputs());
            dispatch({
                type: 'set-date-filter-test-inputs',
                payload: dateFilterTestInputs
            });
            prevDateFilterTestInputs.current = dateFilterTestInputs;
        }
    }, [differenceInDateFilterTestInputs(), dateFilterTestInputs]);

    /* Update dateFilter */

    /** Accounting for date filter changes while relying on the notion that the date filter will be different given user inputs, dateFilterTestInputs. */
    const testDateFilter = useCallback(() => {
        let ret = [] as boolean[];
        for (let i = 0; i < dateFilterTestInputs.length; i++) {
            ret[i] = dateFilter(dateFilterTestInputs[i]);
        }
        return ret;
    }, [dateFilterTestInputs, dateFilter]);
    const prevDateFilterResults = useRef(testDateFilter());
    const differenceInDateFilter = useCallback(() => {
        for (let i = 0; i < dateFilterTestInputs.length; i++) {
            if (dateFilter(dateFilterTestInputs[i]) !== prevDateFilterResults.current[i]) {
                return true;
            }
        }
        return false;
    }, [dateFilterTestInputs, dateFilter]);

    // const prevCompareDateFilter = useRef(differenceInDateFilter());
    useEffect(() => {
        // console.log("got new datefilter");
        //  const compare = differenceInDateFilter();
        // if (prevCompareDateFilter.current !== compare) {
        if (differenceInDateFilter()) {
            let res = testDateFilter();
            // TODO: could update prevDateFilterResults in differenceInDateFilter()
            // console.log(res);
            // if (res !== prevDateFilterResults.current) {
            // console.log("date filter changed");
            // console.log("new date filter results: ");
            // console.log(res);
            // console.log("prev date filter results:");
            // console.log(prevDateFilterResults.current);

            dispatch({
                type: 'set-date-filter',
                payload: dateFilter
            });
            // updateSelectedDatesOnDateFilterChange();
            prevDateFilterResults.current = res;
            // prevCompareDateFilter.current = compare;
            // console.log(prevDateFilterResults.current);

            // Update selections to ensure they are allowed under the new date filter. TODO: check if would be better to do elsewhere.
            if (selectedDate && !dateFilter(selectedDate)) {
                dispatch({
                    type: 'set-selected-date',
                    payload: null
                });
            }
            if (beginDate && !dateFilter(beginDate)) {
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
            }
            if (endDate && !dateFilter(endDate)) {
                // console.log("End date resetting to null");
                // console.log("endDate: " + endDate?.getDate() + " and " + dateFilter(endDate));
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
            }
        }
    }, [differenceInDateFilter(), testDateFilter, dateFilter, selectedDate, beginDate, endDate]);

    /* Update selectedDate. */
    const selectableDate = useCallback((date: Date | null) => {
        if (!date) return false;
        if (dateFilter(date) && (!minDate || compareDaysMonthsAndYears(date, minDate) > -1)
            && (!maxDate || compareDaysMonthsAndYears(date, maxDate) < 1)) {
            return true;
        }
        return false;
    }, [differenceInDateFilter(), minDate, maxDate]);

    useEffect(() => {
        if (selectableDate(selectedDate)) {
            dispatch({
                type: 'set-selected-date',
                payload: selectedDate
            });
            if (selectedDate) {

            }
        }
    }, [selectedDate]);

    /* Update rangeMode. */
    useEffect(() => {
        dispatch({
            type: 'set-range-mode',
            payload: rangeMode
        });
    }, [rangeMode]);

    /* Update beginDate. */
    const prevBeginDate = useRef(beginDate);
    useEffect(() => {
        if (prevBeginDate.current != beginDate) {
            if (beginDate && dateFilter(beginDate)) {
                // beginDate exists and passes through the dateFilter
                if (!minDate || compareDaysMonthsAndYears(beginDate, minDate) > -1) {
                    // beginDate is at or after the minDate
                    if (!maxDate || compareDaysMonthsAndYears(beginDate, maxDate) < 1) {
                        // beginDate is at or before the maxDate
                        dispatch({
                            type: 'set-begin-date',
                            payload: beginDate
                        });
                        prevBeginDate.current = beginDate;
                    } else {
                        // attempted beginDate was after the maxDate
                        dispatch({
                            type: 'set-begin-date',
                            payload: maxDate
                        });
                        prevBeginDate.current = maxDate;
                    }
                } else {
                    // attempted beginDate was before the minDate
                    dispatch({
                        type: 'set-begin-date',
                        payload: minDate
                    });
                    prevBeginDate.current = minDate;
                }
            } else {
                // beginDate is null or it did not pass the dateFilter
                dispatch({
                    type: 'set-begin-date',
                    payload: null
                });
                prevBeginDate.current = null;
            }
        }
    }, [beginDate, minDate, maxDate, differenceInDateFilter()]);

    /* Update endDate. */
    const prevEndDate = useRef(endDate);
    useEffect(() => {
        // console.log("running endDate effect: " + differenceInDateFilterTestInputs());
        if (prevEndDate.current !== endDate) {
            //  console.log("new endDate seen: " + endDate?.getDate());
            if (endDate && dateFilter(endDate)) {
                // endDate exists and passes through the dateFilter
                //  console.log("endDate passed date filter");
                if (!minDate || compareDaysMonthsAndYears(endDate, minDate) > -1) {
                    // endDate is at or after the minDate
                    if (!maxDate || compareDaysMonthsAndYears(endDate, maxDate) < 1) {
                        // endDate is at or before the maxDate
                        dispatch({
                            type: 'set-end-date',
                            payload: endDate
                        });
                        prevEndDate.current = endDate;
                    } else {
                        // attempted endDate was after the maxDate
                        dispatch({
                            type: 'set-end-date',
                            payload: maxDate
                        });
                        prevEndDate.current = maxDate;
                    }
                } else {
                    // attempted endDate was before the minDate
                    dispatch({
                        type: 'set-end-date',
                        payload: minDate
                    });
                    prevEndDate.current = minDate;
                }
            } else {
                // endDate is null or it did not pass the dateFilter
                dispatch({
                    type: 'set-end-date',
                    payload: null
                });
                prevEndDate.current = null;
            }
        }
    }, [endDate, minDate, maxDate, differenceInDateFilter()]);

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
        // console.log("new calendar open display: " + calendarOpenDisplay)
        dispatch({
            type: 'set-calendar-open-display',
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
        // console.log("Noticed change in format month label");
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

    // const [counter, setCounter] = useState(0);
    const prevParseStringToDate = useRef(parseStringToDate(stagnantDateString));
    useEffect(() => {
        const parsedDate = parseStringToDate(stagnantDateString);
        if ((parsedDate != null)
            && (prevParseStringToDate.current == null
                || compareDaysMonthsAndYears(prevParseStringToDate.current, parsedDate))) {
            // console.log("different");
            inputDispatch({
                type: 'set-parse-string-to-date',
                payload: parseStringToDate
            });
            prevParseStringToDate.current = parseStringToDate(stagnantDateString);
        }
    }, [parseStringToDate(stagnantDateString)]);

    useEffect(() => {
        inputDispatch({
            type: 'set-display-date-as-string',
            payload: displayDateAsString
        });
    }, [displayDateAsString(stagnantDate)]);

    useEffect(() => {
        dispatch({
            type: 'set-theme',
            payload: theme
        });
    }, [theme]);
    /*
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

    const _applyTheme = useCallback((theme?: DatepickerThemeStrings) => {
        // const root = document.getElementsByTagName('html')[0];
        if (theme != null) {
            const element = document.getElementById(id);
            if (element) element.style.cssText = makeDatepickerThemeArrayFromStrings(resetTheme(theme)).join(';');
        }
    }, [id, theme]);

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
        _applyTheme(theme);

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

    }, [_applyTheme, theme]);

    // const makeArray = () => {
    //     let array = [] as string[];
    //     Object.keys(theme).forEach(key => {
    //         const value = (theme as any)[key];
    //         array.push(key + ": " + value);
    //     });
    //     return array;
    // }

    return (
        <DatepickerContext.Provider value={{ ...state, dispatch }}>
            <InputContext.Provider value={{ ...inputState, dispatch: inputDispatch }}>
                <Input
                    id={id}></Input>
            </InputContext.Provider>
        </DatepickerContext.Provider>
    );
}

export default DatepickerInput;