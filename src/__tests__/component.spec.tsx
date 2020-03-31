import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen, getByTestId, getByText, queryByText, getByRole, getAllByRole } from '@testing-library/react';
// import { getByTestId } from '@testing-library/jest-dom/extend-expect';
import DatepickerInput from "../DatepickerInput";
import renderer, { ReactTestRenderer, create } from 'react-test-renderer';
import Datepicker from '../Datepicker';
import { datepickerContextDefault, DatepickerContext, datepickerReducer, DatepickerContextProvider, InputContextProvider, useDatepickerContext } from '../DatepickerContext';
import Calendar from '../Calendar';
import Input from '../Input';
// import Hello from "..";
import { renderHook } from '@testing-library/react-hooks';

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

// Works!:
describe("Header buttons", () => {
    test("clicking twelve times advances the year", () => {
        ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
        const nextYear = (new Date()).getFullYear() + 1;
        const nextButton = document.getElementsByClassName("right")[0];
        for (let i = 0; i < 12; i++) {
            fireEvent.click(nextButton);
        }
        const periodButton = document.getElementsByClassName("period")[0];
        expect(periodButton).toHaveTextContent('' + nextYear);
    });

    test("clicking twelve times decreases the year", () => {
        ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
        const prevYear = (new Date()).getFullYear() - 1;
        const prevButton = document.getElementsByClassName("left")[0];

        for (let i = 0; i < 12; i++) {
            fireEvent.click(prevButton);
        }
        const periodButton = document.getElementsByClassName("period")[0];
        expect(periodButton).toHaveTextContent('' + prevYear);
    });
});

describe("Selected begin and end dates", () => {
    test("can select begin and end dates", () => {
        ReactDOM.render(
            <DatepickerContextProvider props={{ rangeMode: true }}>
                < Calendar ></Calendar >
            </DatepickerContextProvider >, container);

        let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
                fireEvent.click(cell);
                expect(beginValue).toHaveClass("beginRange");
            } else if (cell.textContent === '4') {
                endValue = cell;
                fireEvent.click(cell);
                expect(beginValue).toHaveClass("beginRange");
                expect(endValue).toHaveClass("endRange");
                console.log("Ran can select begin and end dates.");
            }
        });
    });

    test("can pass begin and end dates", () => {
        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);
        ReactDOM.render(
            <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
                < Calendar ></Calendar >
            </DatepickerContextProvider >, container);

        let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
                expect(beginValue).toHaveClass("beginRange");
            } else if (cell.textContent === '3') {
                withinValue = cell;
                expect(withinValue).toHaveClass("withinRange");
            } else if (cell.textContent === '4') {
                endValue = cell;
                expect(beginValue).toHaveClass("beginRange");
                expect(endValue).toHaveClass("endRange");
                console.log("Ran Can pass begin and end dates.");
            }
        });
    });

    // const dpInput = render(<DatepickerInput
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
    //  ></DatepickerInput>)

    // TODO: Currently it recognizes being at the end of a hover range, being selected and active, but not being at the end of the selected range - may be a timing issue?
    test("Selecting a date that is before the selected begin and end dates sets a new begin date", () => {
        //ReactDOM.render(<DatepickerInput></DatepickerInput>, container);
        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);
        // _endDate.setDate(_endDate.getDate() - 2);
        // const { result } = renderHook(() => useReducer(datepickerReducer, datepickerContextDefault));
        // const [state, dispatch] = result.current;

        // const state = datepickerReducer(datepickerContextDefault, { type: "reset", payload: null });
        // const { getByText } = 
        ReactDOM.render(
            <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
                {/* ReactDOM.render( , container)
                 <InputContextProvider>
                    <Input></Input>
                </InputContextProvider> */}
                < Calendar ></Calendar >

                {/* {
                    (_value: any) => {
                        const {
                            beginDate, endDate
                        } = useDatepickerContext();
                        return (
                            <div>
                                <div>Begin: {beginDate?.getDate()}</div>
                                <div>End: {endDate?.getDate()}</div>
                            </div>
                        );
                    }
                } */}
            </DatepickerContextProvider >, container);
        // TODO: Can't seem to render DatepickerInput without a loop due to the useEffects that run dispatch on prop changes, so don't know how to pass defaults for beginDate, endDate, and rangeMode in order to test Calendar and Input behaviors.

        // const beginInput = getByText(container, /begin/i);
        // const endInput = getByText(container, /end/i);
        // let beforeDate = new Date();
        // beforeDate.setDate(beforeDate.getDate() - 7);
        // fireEvent.change(input, { target: { value: '23' } });

        // let beginDiv = getByText(container, 'Begin: ');
        // let endDiv = getByText(container, 'End:');

        let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement;
        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '1') {
                beforeValue = cell;
            } else if (cell.textContent === '2') {
                beginValue = cell;
                //  fireEvent.click(beginValue);
                expect(beginValue).toHaveClass("beginRange");
            } else if (cell.textContent === '3') {
                withinValue = cell;
                expect(withinValue).toHaveClass("withinRange");
            } else if (cell.textContent === '4') {
                endValue = cell;
                // fireEvent.click(endValue);

                fireEvent.click(beforeValue);
                expect(endValue).toHaveClass("endRange");

                expect(beforeValue).toHaveClass("beginRange");
                console.log("Ran Selecting a date that is before the selected begin and end dates sets a new begin date.");
            } else if (cell.textContent === '5') {

            }
        });

        //let beginValue = getByText(container, '3');
        // let endValue = getByText(container, '4');
        // let beforeValue = getByText(container, '2');

        // fireEvent.click(beginValue);
        // fireEvent.click(endValue);


        //if (beginValue) console.log(beginValue.classList.item(0)); // null if out of range
        // expect(beginDiv).toHaveTextContent('2');
        // expect(endDiv).toHaveTextContent('4');

        //expect(endValue).toHaveClass("endRange");
        // expect(beforeValue).toHaveClass("beginRange");
    });

    test("Selecting a date after the begin and end dates sets a new end date", () => {
        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);
        ReactDOM.render(
            <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
                < Calendar ></Calendar >
            </DatepickerContextProvider >, container);

        let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '1') {
                beforeValue = cell;
            } else if (cell.textContent === '2') {
                beginValue = cell;
                expect(beginValue).toHaveClass("beginRange");
            } else if (cell.textContent === '3') {
                withinValue = cell;
                expect(withinValue).toHaveClass("withinRange");
            } else if (cell.textContent === '4') {
                endValue = cell;
                expect(endValue).toHaveClass("endRange");
            } else if (cell.textContent === '5') {
                afterValue = cell;
                fireEvent.click(cell);

                expect(beginValue).toHaveClass("beginRange");
                expect(afterValue).toHaveClass("endRange");

                console.log("Ran Selecting a date after the begin and end dates sets a new end date.");
            }
        });
    });
});
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