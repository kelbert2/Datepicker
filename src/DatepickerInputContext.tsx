import React from "react";
import { DateData, IAction, datepickerDefaultProps, IDatepickerContext } from "./DatepickerContext";
import { parseStringAsDate, formatDateDisplay } from "./CalendarUtils";

/** Properties for DatepickerInput
  * @param onCalendarDateChange: Function that takes selected date, beginDate, and endDate upon Calendar selection.
 * @param onInputDateChange: Function that takes selected date, beginDate, and endDate upon Text Input.
 * 
 * @param disableCalendar: Disallows any calendar from displaying.
 * @param disableInput: Disables text input.
 * 
 * @param singleInputLabel: Label for the first input, when not in range mode.
 * @param beginInputLabel: Label for the first input when in range mode.
 * @param endInputLabel: Label for the second input when in range mode.
 * 
 * @param parseStringToDate: Converts string input to Date object on success and null on failure.
 * @param displayDateAsString: Displays stored date values in input boxes.
 */
export interface IDatepickerInputProps {
    onCalendarDateChange?: (d: DateData) => {} | void,
    onInputDateChange?: (d: DateData) => {} | void,

    disableCalendar?: boolean,
    disableInput?: boolean,

    singleInputLabel?: string,
    beginInputLabel?: string,
    endInputLabel?: string,

    parseStringToDate?: (input: string) => Date | null,
    displayDateAsString?: (date: Date) => string,
}

/** Default properties for input part of datepicker input. */
export const inputDefaultProps = {
    onCalendarDateChange: (d: DateData) => { },
    onInputDateChange: (d: DateData) => { },

    disableCalendar: false,
    disableInput: false,

    singleInputLabel: "Choose a date",
    beginInputLabel: "Choose a start date",
    endInputLabel: "end date",

    parseStringToDate: (input: string) => parseStringAsDate(input),
    displayDateAsString: (date: Date) => formatDateDisplay(date)
} as IDatepickerInputProps;

export interface IDatepickerInputContext extends IDatepickerContext {
    onCalendarDateChange: (d: DateData) => {} | void,
    onInputDateChange: (d: DateData) => {} | void,

    disableCalendar: boolean,
    disableInput: boolean,

    singleInputLabel: string,
    beginInputLabel: string,
    endInputLabel: string,

    parseStringToDate: (input: string) => Date | null,
    displayDateAsString: (date: Date) => string,
}

export const datepickerInputReducer = (state: IDatepickerInputContext, action: IAction): IDatepickerInputContext => {
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

const datepickerInputDefaultContext = { ...inputDefaultProps, ...datepickerDefaultProps } as IDatepickerInputContext;
export const DatepickerInputContext = React.createContext(datepickerInputDefaultContext);

/** Provide access to context for children. */
export function DatepickerInputContextProvider({ children }: { children: any }) {
    let [state, dispatch] = React.useReducer(datepickerInputReducer, datepickerInputDefaultContext);
    return (
        <DatepickerInputContext.Provider value={{ ...state, dispatch }}>{children}</DatepickerInputContext.Provider>
    );
}

export default DatepickerInputContext;