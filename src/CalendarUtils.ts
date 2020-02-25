export type VIEW = 'month' | 'year' | 'multiyear';

export const DAYS_PER_WEEK = 7;
export const YEARS_PER_PAGE = 12;

// Months and Years
export const CURRENT_YEAR = +(new Date().getFullYear());
export const CURRENT_MONTH = +(new Date().getMonth());

interface longShortNames {
    long: string,
    short: string
}
export const WEEKDAY_NAMES = [
    { long: "Sunday", short: "S" },
    { long: "Monday", short: "M" },
    { long: 'Tuesday', short: 'T' },
    { long: 'Wednesday', short: 'W' },
    { long: 'Thursday', short: "T" },
    { long: 'Friday', short: 'F' },
    { long: 'Saturday', short: 'S' }
] as longShortNames[];
export const MONTH_NAMES = [
    { long: "January", short: "Jan" },
    { long: "February", short: "Feb" },
    { long: "March", short: "Mar" },
    { long: "April", short: "Apr" },
    { long: "May", short: "May" },
    { long: "June", short: "June" },
    { long: "July", short: "July" },
    { long: "August", short: "Aug" },
    { long: "September", short: "Sep" },
    { long: "October", short: "Oct" },
    { long: "November", short: "Nov" },
    { long: "December", short: "Dec" }
] as longShortNames[];

// create
export const createDate = (year: number, month: number, day = 1) => {
    return new Date(year, month, day);
}
// get Date
export const getYear = (date: Date) => {
    return date.getFullYear();
}
export const getMonth = (date: Date) => {
    return date.getMonth();
}
export const getDay = (date: Date) => {
    return date.getDay();
}
export const getDateISO = (date = new Date()) => {
    if (!isDate(date)) return null;
    return [
        date.getFullYear(),
        zeroPad(+date.getMonth(), 2),
        zeroPad(+date.getDate(), 2)
    ].join('-');
}
export const getDate = (date: Date) => {
    return date.getDate();
}

// get day
export const getDayOfWeek = (date: Date) => {
    return date.getDay();
}
export const getDayOfWeekNames = (length: 'short' | 'long') => {
    if (length === 'short') {
        return WEEKDAY_NAMES.map(month => month.short);
    } else {
        return WEEKDAY_NAMES.map(month => month.long)
    }
}

// get month, 0-based
export const getFirstDayOfWeek = () => {
    return 0;
}
export const getFirstDateOfMonthByDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
export const getFirstDateOfMonth = (month = CURRENT_MONTH, year = CURRENT_YEAR) => {
    return new Date(year, month, 1);
}
export const getFirstWeekOffset = (firstOfMonth: Date) => {
    return (DAYS_PER_WEEK + getDayOfWeek(firstOfMonth) - getFirstDayOfWeek()) % DAYS_PER_WEEK;
}
export const getPrevMonth = (month: number, year: number) => {
    return { month: (month - 1) % 12, year: (month > 0) ? year - 1 : year };
}

export const getNextMonth = (month: number, year: number) => {
    return { month: (month + 1) % 12, year: (month < 11) ? year : year + 1 };
}
export const getMonthNames = (length: 'short' | 'long') => {
    if (length === 'short') {
        return MONTH_NAMES.map(month => month.short);
    } else {
        return MONTH_NAMES.map(month => month.long)
    }
    // return short ? MONTH_NAMES[getMonth(date)].short : MONTH_NAMES[getMonth(date)].long;
}

export const getDaysPerMonth = (month = CURRENT_MONTH, year = CURRENT_YEAR) => {
    const monthsWith30 = [3, 5, 8, 10]; // month number starts at 0 for January
    const leapYear = (year % 4 === 0);

    return (month === 1
        ? leapYear ? 29 : 28
        : monthsWith30.includes(month) ? 30 : 31);
}

// year
export const getYearName = (date: Date) => {
    return date.getFullYear() + '';
}

// validation
export const isDate = (date: string | Date | null) => {
    if (!date) return false;
    const isDate = Object.prototype.toString.call(date) === '[object Date]';
    const isValidDate = date && !Number.isNaN(date.valueOf() as number);
    // TODO: check this
    return isDate && isValidDate;
}
export const isDateInstance = (date: string | Date) => {
    return isDate(date);
}
export const isValid = (date: string | Date) => {
    return isDate(date);
}

// tools
export const zeroPad = (value: string | number, length: number) => {
    return `${value}`.padStart(length, '0');
}
// comparison
export const sameMonth = (date: Date | null, baseDate = new Date() as Date | null): boolean => {
    if (!(isDate(date) && isDate(baseDate))) return false;

    return (date && baseDate && date.getMonth() === baseDate.getMonth())
        && (date.getFullYear() === baseDate.getFullYear()) ? true : false; // so will not return null
}
export const sameDate = (date: Date | null, baseDate = new Date() as Date | null): boolean => {
    if (!(isDate(date) && isDate(baseDate))) return false;
    return (date && baseDate && date.getDate() === baseDate.getDate()) && sameMonth(date, baseDate) ? true : false; // so will not return null
}
export const compareDatesGreaterThan = (date1: Date, date2: Date) => {
    return date1 > date2;
}
// from: https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript 
const convert = (date: any) => {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp) 
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return (
        date.constructor === Date
            ? date
            : date.constructor === Array
                ? new Date(date[0], date[1], date[2])
                : date.constructor === Number
                    ? new Date(date)
                    : date.constructor === String
                        ? new Date(date)
                        : typeof date === "object"
                            ? new Date(date.year, date.month, date.date)
                            : NaN
    );
}
export const compareDates = (date1: Date, date2: Date) => {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (isFinite(date1 = convert(date1).valueOf())
        && isFinite(date2 = convert(date2).valueOf()) ?
        (date1 > date2 ? 1 : -1) - (date1 < date2 ? 1 : -1) :
        NaN);
}
export const getDayDifference = (date1: Date, date2: Date) => {
    // divided by milliseconds per day
    return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
}

/** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
export const hasSameMonthAndYear = (date1: Date | null, date2: Date | null) => {
    return !!(date1 && date2
        && getMonth(date1) === getMonth(date2)
        && getYear(date1) === getYear(date2));
}

// Calendar
export const addCalendarYears = (date: Date, add: number) => {
    return new Date(getYear(date) + add, getMonth(date), getDay(date));
}
export const addCalendarMonths = (date: Date, add: number) => {
    return new Date(getYear(date), (getMonth(date) + add) % 11, getDay(date));
}

export const addCalendarDays = (date: Date, add: number) => {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + add);
    return date;
}
// Numbers 
export const dateToNumber = (date: Date) => {
    return Number(date);
}
// Cells
export const dateToMonthCellIndex = (date: Date) => {
    return getDayDifference(date, getFirstDateOfMonthByDate(date));
}