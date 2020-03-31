import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen, getByTestId } from '@testing-library/react';
// import { getByTestId } from '@testing-library/jest-dom/extend-expect';
import DatepickerInput from "../DatepickerInput";
import renderer, { ReactTestRenderer, create } from 'react-test-renderer';
import Datepicker from '../Datepicker';
import { datepickerContextDefault, DatepickerContext, datepickerReducer, DatepickerContextProvider } from '../DatepickerContext';
import Calendar from '../Calendar';
// import Hello from "..";

// test("Component should show 'red' text 'Hello World'", () => {
//     const component = renderer.create(<Hello text="World" />);
//     const testInstance = component.root;

//     expect(testInstance.findByType(Hello).props.text).toBe("World");

//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// });

// let wrapper: ShallowWrapper<DatepickerInputProps>;
// let snapshot: ReactTestRenderer;
// function renderDP() {
//     return renderer.create(<DatepickerInput></DatepickerInput>);
// }


let container: HTMLDivElement;

beforeEach(() => {
    // const dpInputRaw = <DatepickerInput></DatepickerInput>;
    // const dp = create(<DatepickerInput></DatepickerInput>);

    // document.body.appendChild(dp);

    container = document.createElement('div');
    document.body.appendChild(container);
    // const dpInput = render(dpInputRaw);
    // wrapper = shallow(dpInputRaw);
    // snapshot = create(dpInputRaw);
});

afterEach(() => {
    document.body.removeChild(container);
    // container = null;
})

// describe("Snapshot", () => {
//     test("Should match the snapshot", () => {
//         const renderDP = renderer.create(<DatepickerInput></DatepickerInput>);
//         expect(renderDP.toJSON()).toMatchSnapshot();
//     })
// });


test("clicking twelve times advances the year", () => {
    ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);

    // fireEvent.click(getByTestId(container, "open-button"));

    const nextYear = (new Date()).getFullYear() + 1;
    //const nextButton = screen.getByTestId("next-button");

    for (let i = 0; i < 12; i++) {
        fireEvent.click(getByTestId(container, "next-button"));
    }
    const periodButton = getByTestId(container, "period-button");
    expect(screen.getByTestId("period-button")).toHaveTextContent('' + nextYear);
});


// describe("Selected begin and end dates", () => {
//     const dpInput = render(<DatepickerInput
//     // selectedDate={_selectedDate}
//     // todayDate={new Date()}

//     // onFinalDateChange={_onFinalDateChange}
//     // onDateChange={_onDateChange}
//     // onCalendarDateChange={_onCalendarDateChange}
//     // onInputDateChange={_onInputDateChange}
//     // onDaySelected={_onDaySelected}
//     // onMonthSelected={_onMonthSelected}
//     // onYearSelected={_onYearSelected}

//     // startAt={_startAt}
//     // startView={_startView}
//     // firstDayOfWeek={_firstDayOfWeek}

//     // minDate={_minDate}
//     // maxDate={_maxDate}
//     // dateFilter={_dateFilter}

//     // rangeMode={_rangeMode}
//     // beginDate={_beginDate}
//     // endDate={_endDate}

//     // disableMonth={_disableMonth}
//     // disableYear={_disableYear}
//     // disableMultiyear={_disableMultiyear}

//     // disable={_disable}
//     // disableCalendar={_disableCalendar}
//     // disableInput={_disableInput}
//     // calendarOpenDisplay={_calendarOpenDisplay}
//     // canCloseCalendar={_canCloseCalendar}
//     // closeAfterSelection={_closeAfterSelection}
//     // // setCalendarOpen={_open}

//     // formatMonthLabel={_formatMonthLabel}
//     // formatMonthText={_formatMonthText}

//     // formatYearLabel={_formatYearLabel}
//     // formatYearText={_formatYearText}

//     // formatMultiyearLabel={_formatMultiyearLabel}
//     // formatMultiyearText={_formatMultiyearText}

//     // calendarLabel={_calendarLabel}
//     // openCalendarLabel={_openCalendarLabel}

//     // nextMonthLabel={_nextMonthLabel}
//     // nextYearLabel={_nextYearLabel}
//     // nextMultiyearLabel={_nextMultiyearLabel}

//     // prevMonthLabel={_prevMonthLabel}
//     // prevMultiyearLabel={_prevMultiyearLabel}
//     // prevYearLabel={_prevYearLabel}

//     // switchToMonthViewLabel={_switchToMonthViewLabel}
//     // switchToYearViewLabel={_switchToYearViewLabel}
//     // switchToMultiyearViewLabel={_switchToMultiyearViewLabel}

//     // singleInputLabel={_singleInputLabel}
//     // beginInputLabel={_beginInputLabel}
//     // endInputLabel={_endInputLabel}

//     // parseStringToDate={_parseStringToDate}
//     // displayDateAsString={_displayDateAsString}

//     // theme={getTheme(_themeColor)}
//     ></DatepickerInput>)

//     test("Selecting a date that is before the selected begin and end dates sets a new begin date", () => {

//     });
//     test("Selecting a date after the begin and end dates sets a new end date", () => {

//     });
// });
// describe("Selected begin but no end date", () => {
//     test("Selecting before the selected beginDate switches the two", () => {

//     });
//     test("Selecting a date after a begin date selects the end date", () => {

//     });
// });
// describe("Selected end but no begin date", () => {
//     test("Selecting a date before the end date sets a begin date", () => {

//     });
//     test("Selecting a date after the end date sets a new end date and sets the previous end date to the begin date", () => {

//     });
// });

// // expect(function()).toEqual(output);


// test("Selecting the selected begin date resets range selection", () => {

// });
// test("Selecting the selected end date resets range selection", () => {

// });

// describe("Disable Month View", () => {
//     test("It should open up in Year View", () => {

//     });
//     test("It is impossible to navigate to Month View by pressing the Period Button", () => {

//     });
// });