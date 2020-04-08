import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen, getByTestId, getByText, queryByText, getByRole, getAllByRole } from '@testing-library/react';
// import { getByTestId } from '@testing-library/jest-dom/extend-expect';
import DatepickerInput from "../DatepickerInput";
import renderer, { ReactTestRenderer, create } from 'react-test-renderer';
import Datepicker from '../Datepicker';
import { datepickerContextDefault, DatepickerContext, datepickerReducer, DatepickerContextProvider, InputContextProvider, useDatepickerContext, DateData } from '../DatepickerContext';
import Calendar from '../Calendar';
import Input from '../Input';
// import Hello from "..";
import { renderHook } from '@testing-library/react-hooks';
import { YEARS_PER_PAGE, euclideanModulo } from '../CalendarUtils';

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

// describe("Header buttons", () => {
//     test("clicking twelve times advances the year", () => {
//         expect.assertions(1);

//         ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
//         const nextYear = (new Date()).getFullYear() + 1;
//         const nextButton = document.getElementsByClassName("right")[0];
//         for (let i = 0; i < 12; i++) {
//             fireEvent.click(nextButton);
//         }
//         const periodButton = document.getElementsByClassName("period")[0];
//         expect(periodButton).toHaveTextContent('' + nextYear);
//     });

//     test("clicking twelve times decreases the year", () => {
//         expect.assertions(1);

//         ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
//         const prevYear = (new Date()).getFullYear() - 1;
//         const prevButton = document.getElementsByClassName("left")[0];

//         for (let i = 0; i < 12; i++) {
//             fireEvent.click(prevButton);
//         }
//         const periodButton = document.getElementsByClassName("period")[0];
//         expect(periodButton).toHaveTextContent('' + prevYear);
//     });

//     test("Clicking the period button once changes to the year selection view", () => {
//         expect.assertions(2);

//         ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
//         const todayYear = (new Date()).getFullYear();
//         const startYear = todayYear - euclideanModulo(todayYear, YEARS_PER_PAGE);
//         const periodButton = document.getElementsByClassName("period")[0];

//         fireEvent.click(periodButton);

//         expect(periodButton).toHaveTextContent(startYear + '');
//         let cells = getAllByRole(container, "gridcell");
//         expect(cells[0]).toHaveTextContent('' + startYear);
//     });
//     test("Choosing a year switches to the month selection view", () => {
//         expect.assertions(4);

//         ReactDOM.render(<DatepickerContextProvider><Calendar></Calendar></DatepickerContextProvider>, container);
//         const todayYear = (new Date()).getFullYear();
//         const startYear = todayYear - euclideanModulo(todayYear, YEARS_PER_PAGE);
//         const periodButton = document.getElementsByClassName("period")[0];

//         fireEvent.click(periodButton);

//         expect(periodButton).toHaveTextContent(startYear + '');
//         let cells = getAllByRole(container, "gridcell");
//         expect(cells[0]).toHaveTextContent('' + startYear);

//         fireEvent.click(cells[0]);
//         expect(periodButton).toHaveTextContent(startYear + '');
//         cells = getAllByRole(container, "gridcell");
//         expect(cells[0]).toHaveTextContent('JAN');
//     });
// });

// describe("Selected begin and end dates", () => {
//     test("can select begin and end dates", () => {
//         expect.assertions(3);

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beginValue = cell;
//                 fireEvent.click(cell);
//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '4') {
//                 endValue = cell;
//                 fireEvent.click(cell);
//                 expect(beginValue).toHaveClass("beginRange");
//                 expect(endValue).toHaveClass("endRange");
//             }
//         });
//     });

//     test("can pass begin and end dates", () => {
//         expect.assertions(4);

//         let _beginDate = new Date();
//         let _endDate = new Date();
//         _beginDate.setDate(2);
//         _endDate.setDate(4);
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beginValue = cell;
//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//                 expect(withinValue).toHaveClass("withinRange");
//             } else if (cell.textContent === '4') {
//                 endValue = cell;
//                 expect(beginValue).toHaveClass("beginRange");
//                 expect(endValue).toHaveClass("endRange");
//             }
//         });
//     });

//     // TODO: Currently it recognizes being at the end of a hover range, being selected and active, but not being at the end of the selected range - may be a timing issue?
//     test("Selecting a date that is before the selected begin and end dates sets a new begin date", () => {
//         expect.assertions(5);

//         let _beginDate = new Date();
//         let _endDate = new Date();
//         _beginDate.setDate(2);
//         _endDate.setDate(4);

//         let firedEvent = false;
//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement;

//         function onFinalDateSelection(date: DateData) {
//             console.log("fired final date");
//             // if (firedEvent && beforeValue) {
//             // console.log("length after emission: " + beforeValue.classList.length);
//             // console.log("beginDate from fired: " + date.beginDate?.getDate());
//             // for (let i = 0; i < beforeValue.classList.length; i++) {
//             //     console.log(beforeValue.classList[i]);
//             // }

//             // selected active withinHoveredRange hovered beginHoveredRange
//             // }
//             // if (withinValue) expect(withinValue).toHaveClass("withinRange");
//             // if (endValue) expect(endValue).toHaveClass("endRange");
//         }

//         function expectBefore() {
//             console.log("length: " + beforeValue.classList.length);
//             expect(beforeValue).toHaveClass("beginRange");
//         }

//         // TODO: doesn't work if initially pass in begin date: recognizes that beforeValue was selected and is at the beginning of a hover range, but not that 
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, endDate: _endDate }}>
//                 {/* ReactDOM.render( , container)
//                  <InputContextProvider>
//                     <Input></Input>
//                 </InputContextProvider> */}
//                 < Calendar onFinalDateSelection={onFinalDateSelection}></Calendar >
//             </DatepickerContextProvider >, container);
//         // TODO: Can't seem to render DatepickerInput without a loop due to the useEffects that run dispatch on prop changes, so don't know how to pass defaults for beginDate, endDate, and rangeMode in order to test Calendar and Input behaviors.

//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '1') {
//                 beforeValue = cell;
//             } else if (cell.textContent === '2') {
//                 beginValue = cell;
//                 // console.log("about to click begin");
//                 fireEvent.click(beginValue);
//                 // console.log("returned from clicking begin");
//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 endValue = cell;

//                 firedEvent = true;
//                 // console.log("about to click");
//                 fireEvent.click(beforeValue);

//                 // console.log("back to expecting after click");
//                 expect(endValue).toHaveClass("endRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(beginValue).toHaveClass("withinRange");
//                 // console.log("length: " + beforeValue.classList.length);
//                 expect(beforeValue).toHaveClass("beginRange");
//             }
//         });
//     });

//     test("Selecting a date after the begin and end dates sets a new end date", () => {
//         expect.assertions(6);

//         let _beginDate = new Date();
//         let _endDate = new Date();
//         _beginDate.setDate(2);
//         _endDate.setDate(4);
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);
//         // TODO: passing initial endDate rather than firing event to select it recognizes afterValue as selected and the end of the hover range, but the not the end of the selected range
//         // TODO: also not passing beginDate messes this up as well
//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '1') {
//                 beforeValue = cell;
//             } else if (cell.textContent === '2') {
//                 beginValue = cell;
//                 // fireEvent.click(beginValue);
//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;

//             } else if (cell.textContent === '4') {
//                 endValue = cell;
//                 fireEvent.click(endValue);
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(endValue).toHaveClass("endRange");
//             } else if (cell.textContent === '5') {
//                 afterValue = cell;
//                 fireEvent.click(cell);

//                 expect(beginValue).toHaveClass("beginRange");
//                 expect(endValue).toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("endRange");
//             }
//         });
//     });
// });
// describe("Selected begin but no end date", () => {
//     test("Selecting before the selected beginDate switches the two", () => {
//         expect.assertions(4);

//         let _beginDate = new Date();
//         _beginDate.setDate(4);

//         // TODO: passing beginDate into ContextProvider instead of clicking in the iteration fails this test
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '4') {
//                 afterValue = cell;
//                 fireEvent.click(afterValue);
//                 expect(afterValue).toHaveClass("beginRange");
//             }
//         });

//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//                 fireEvent.click(beforeValue);
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 expect(beforeValue).toHaveClass("beginRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("endRange");
//             }
//         });
//     });
//     test("Selecting a date after a begin date selects the end date", () => {
//         expect.assertions(4);

//         let _beginDate = new Date();
//         _beginDate.setDate(2);

//         // TODO: passing beginDate into ContextProvider instead of clicking in the iteration fails this test
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//                 // fireEvent.click(beforeValue);
//                 expect(beforeValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 fireEvent.click(afterValue);

//                 expect(beforeValue).toHaveClass("beginRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("endRange");

//                 // don't need because can expect these assertions to fire
//             }
//         });
//     });
// });
// describe("Selected end but no begin date", () => {
//     test("Selecting a date before the end date sets a begin date", () => {
//         expect.assertions(4);

//         let _endDate = new Date();
//         _endDate.setDate(4);

//         // TODO: passing beginDate into ContextProvider instead of clicking in the iteration fails this test
//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, endDate: _endDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 expect(afterValue).toHaveClass("endRange");

//                 fireEvent.click(beforeValue);

//                 expect(beforeValue).toHaveClass("beginRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("endRange");
//             }
//         });
//     });

test("Selecting a date after the end date sets a new end date and sets the previous end date to the begin date", () => {
    expect.assertions(4);

    let _endDate = new Date();
    _endDate.setDate(2);

    let fired = false;

    // function onFinalDateSelection(d: DateData) {
    //     console.log("fired final date selection");
    //     console.log("beginDate: " + d.beginDate?.getDate());
    //     console.log("endDate: " + d.endDate?.getDate());
    //     fired = true;
    // }

    // TODO: passing beginDate into ContextProvider instead of clicking in the iteration fails this test
    ReactDOM.render(
        <DatepickerContextProvider props={{ rangeMode: true, endDate: _endDate, beginDate: null }}>
            < Calendar></Calendar >
        </DatepickerContextProvider >, container);

    let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement, afterAfterValue: HTMLElement;
    let cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '2') {
            beforeValue = cell;
            expect(beforeValue).toHaveClass("endRange");

            // console.log("iterating through cells ===============================================");

        } else if (cell.textContent === '3') {
            withinValue = cell;
        } else if (cell.textContent === '4') {
            afterValue = cell;
            // console.log("about to click 4");
            fireEvent.click(afterValue);
            // console.log("returned from click");
            // expect(beforeValue).toHaveClass("beginRange");
            // expect(withinValue).toHaveClass("withinRange");
            // expect(afterValue).toHaveClass("endRange");
            // afterAfterValue = cell;

            // fireEvent.click(afterAfterValue);

            // expect(beforeValue).toHaveClass("beginRange");
            // expect(withinValue).toHaveClass("withinRange");
            // expect(afterAfterValue).toHaveClass("endRange");
            // console.log("expecting beginDate to be 2 and endDate to be 4");
            expect(beforeValue).toHaveClass("beginRange");

            expect(afterValue).toHaveClass("endRange");
            expect(withinValue).toHaveClass("withinRange");
        }
    });
    // if (fired) {
    //     cells = getAllByRole(container, "gridcell");
    //     cells.forEach(cell => {
    //         if (cell.textContent === '5') {

    //             // console.log("clicking 5");
    //             // afterAfterValue = cell;
    //             // fireEvent.click(afterAfterValue);

    //             // console.log("returned from clicking 5");

    //         }
    //     });
    // }
});
// });

// // expect(function()).toEqual(output);


test("Selecting the selected begin date resets range selection", () => {
    expect.assertions(6);

    let _beginDate = new Date();
    _beginDate.setDate(2);
    let _endDate = new Date();
    _endDate.setDate(4);

    ReactDOM.render(
        <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
            < Calendar></Calendar >
        </DatepickerContextProvider >, container);

    let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement, afterAfterValue: HTMLElement;
    let cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '2') {
            beforeValue = cell;
            expect(beforeValue).toHaveClass("beginRange");

        } else if (cell.textContent === '3') {
            withinValue = cell;
            expect(withinValue).toHaveClass("withinRange");
        } else if (cell.textContent === '4') {
            afterValue = cell;
            expect(afterValue).toHaveClass("endRange");

            fireEvent.click(beforeValue);

            expect(beforeValue).toHaveClass("beginRange");
            expect(withinValue).not.toHaveClass("withinRange");
            expect(afterValue).not.toHaveClass("endRange");
        }
    });
});
test("Selecting the selected end date resets range selection", () => {
    expect.assertions(6);

    let _beginDate = new Date();
    _beginDate.setDate(2);
    let _endDate = new Date();
    _endDate.setDate(4);

    ReactDOM.render(
        <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
            < Calendar></Calendar >
        </DatepickerContextProvider >, container);

    let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
    let cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '2') {
            beforeValue = cell;
            expect(beforeValue).toHaveClass("beginRange");

        } else if (cell.textContent === '3') {
            withinValue = cell;
            expect(withinValue).toHaveClass("withinRange");
        } else if (cell.textContent === '4') {
            afterValue = cell;
            expect(afterValue).toHaveClass("endRange");

            fireEvent.click(afterValue);

            expect(beforeValue).not.toHaveClass("beginRange");
            expect(withinValue).not.toHaveClass("withinRange");
            expect(afterValue).toHaveClass("beginRange");
        }
    });
});

// describe("Disable Month View", () => {
//     test("It should open up in Year View", () => {

//     });
//     test("It is impossible to navigate to Month View by pressing the Period Button", () => {

//     });
// });