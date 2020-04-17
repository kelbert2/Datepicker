import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, screen, getByTestId, getByText, queryByText, getByRole, getAllByRole, getAllByLabelText, getByLabelText } from '@testing-library/react';
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
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
})
// TODO: add test: can open calendar

const printOutDom = () => getByLabelText(container, /AHHHHHH/i);
// describe("Selected begin and end dates", () => {
test("can select begin and end dates", () => {
    expect.assertions(5);

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const beginDateString = month + " / 2 / " + year;
    const endDateString = month + " / 4 / " + year;

    // function onFinalDateSelection(data: DateData) {
    //     console.log("final date selection fired, endDate: " + data.endDate?.getDate());
    // }
    ReactDOM.render(
        <DatepickerInput rangeMode={true}></DatepickerInput >,
        container);

    let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;

    let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
    let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;
    fireEvent.click(beginInput);

    let cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '2') {
            beginValue = cell;
            fireEvent.click(beginValue);
            expect(beginValue).toHaveClass("beginRange");
        } else if (cell.textContent === '3') {
            // afterValue = cell;
            // fireEvent.click(cell);
        } else if (cell.textContent === '4') {
            endValue = cell;
            // fireEvent.click(beginValue);
            fireEvent.click(endValue);

            fireEvent.click(beginInput); //open calendar again

            // console.log("beginInput: " + beginInput.textContent);
            // console.log("end input: " + endInput.textContent);

            // expect(beginValue).toHaveClass("beginRange");
            // expect(cell).toHaveClass("endRange");

            // expect(beginInput).toHaveTextContent(today.getMonth() + "/2/" + today.getFullYear());
            // expect(endInput).toHaveTextContent(today.getMonth() + "/4/" + today.getFullYear());
        }
    });
    // inputs not displaying text - are finding them with labels however
    // console.log("beginInput: " + beginInput.textContent);
    // console.log("end input: " + endInput.textContent);
    cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '4') {
            endValue = cell; // TODO: for some reason need to reset endValue but not beginValue
            // expect(beginValue).toHaveClass("beginRange");
            // expect(endValue).toHaveClass("endRange");

            expect(beginValue).toHaveClass("beginRange");
            expect(cell).toHaveClass("endRange");

            expect(beginInput.value).toBe(beginDateString);
            expect(endInput.value).toBe(endDateString);
        }
    });
});

test("can input begin and end dates", () => {
    expect.assertions(4);

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const beginDateString = month + " / 2 / " + year;
    const endDateString = month + " / 4 / " + year;

    ReactDOM.render(
        <DatepickerInput rangeMode={true}></DatepickerInput >,
        container);

    let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
    let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;
    let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;

    fireEvent.change(beginInput, { target: { value: beginDateString } });
    fireEvent.keyDown(beginInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response
    fireEvent.change(endInput, { target: { value: endDateString } });
    fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response
    // trigger on blur to update internal values
    fireEvent.click(beginInput); // open calendar

    // printOutDom();

    let cells = getAllByRole(container, "gridcell");
    cells.forEach(cell => {
        if (cell.textContent === '2') {
            beginValue = cell;
        } else if (cell.textContent === '4') {
            expect(beginInput.value).toBe(beginDateString);
            expect(endInput.value).toBe(endDateString);

            expect(beginValue).toHaveClass("beginRange");
            expect(cell).toHaveClass("endRange");
        }
    });
});

test("can pass begin and end dates", () => {
    expect.assertions(6);

    let _beginDate = new Date();
    let _endDate = new Date();
    _beginDate.setDate(2);
    _endDate.setDate(4);

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const beginDateString = month + " / 2 / " + year;
    const endDateString = month + " / 4 / " + year;

    ReactDOM.render(
        <DatepickerInput beginDate={_beginDate} endDate={_endDate} rangeMode={true}></DatepickerInput >,
        container);

    let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
    let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

    fireEvent.click(beginInput); // open the calendar


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

            expect(beginInput.value).toBe(beginDateString);
            expect(endInput.value).toBe(endDateString);
        }
    });
});

//   test("Selecting a date that is before the selected begin and end dates sets a new begin date", () => {
//         expect.assertions(5);

//         let _beginDate = new Date();
//         let _endDate = new Date();
//         _beginDate.setDate(2);
//         _endDate.setDate(4);

//         let firedEvent = false;
//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement;

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, endDate: _endDate }}>
//                 < Calendar></Calendar >
//             </DatepickerContextProvider >, container);

//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '1') {
//                 beforeValue = cell;
//             } else if (cell.textContent === '2') {
//                 beginValue = cell;
//                 fireEvent.click(beginValue);
//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 endValue = cell;

//                 firedEvent = true;
//                 fireEvent.click(beforeValue);

//                 expect(endValue).toHaveClass("endRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(beginValue).toHaveClass("withinRange");
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
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '1') {
//                 beforeValue = cell;
//             } else if (cell.textContent === '2') {
//                 beginValue = cell;

//                 expect(beginValue).toHaveClass("beginRange");
//             } else if (cell.textContent === '3') {
//                 withinValue = cell;

//             } else if (cell.textContent === '4') {
//                 endValue = cell;

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

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate }}>
//                 < Calendar ></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '4') {
//                 afterValue = cell;
//                 // fireEvent.click(afterValue);
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

//     test("Selecting a date after the end date sets a new end date and sets the previous end date to the begin date", () => {
//         expect.assertions(4);

//         let _endDate = new Date();
//         _endDate.setDate(2);

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, endDate: _endDate, beginDate: null }}>
//                 < Calendar></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement, afterAfterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//                 expect(beforeValue).toHaveClass("endRange");

//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 fireEvent.click(afterValue);

//                 expect(beforeValue).toHaveClass("beginRange");
//                 expect(withinValue).toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("endRange");
//             }
//         });
//     });
// });
// describe("resetting", () => {
//     test("Selecting the selected begin date resets range selection", () => {
//         expect.assertions(6);

//         let _beginDate = new Date();
//         _beginDate.setDate(2);
//         let _endDate = new Date();
//         _endDate.setDate(4);

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
//                 < Calendar></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement, afterAfterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//                 expect(beforeValue).toHaveClass("beginRange");

//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//                 expect(withinValue).toHaveClass("withinRange");
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 expect(afterValue).toHaveClass("endRange");

//                 fireEvent.click(beforeValue);

//                 expect(beforeValue).toHaveClass("beginRange");
//                 expect(withinValue).not.toHaveClass("withinRange");
//                 expect(afterValue).not.toHaveClass("endRange");
//             }
//         });
//     });
//     test("Selecting the selected end date resets range selection", () => {
//         expect.assertions(6);

//         let _beginDate = new Date();
//         _beginDate.setDate(2);
//         let _endDate = new Date();
//         _endDate.setDate(4);

//         ReactDOM.render(
//             <DatepickerContextProvider props={{ rangeMode: true, beginDate: _beginDate, endDate: _endDate }}>
//                 < Calendar></Calendar >
//             </DatepickerContextProvider >, container);

//         let withinValue: HTMLElement, beforeValue: HTMLElement, afterValue: HTMLElement;
//         let cells = getAllByRole(container, "gridcell");
//         cells.forEach(cell => {
//             if (cell.textContent === '2') {
//                 beforeValue = cell;
//                 expect(beforeValue).toHaveClass("beginRange");

//             } else if (cell.textContent === '3') {
//                 withinValue = cell;
//                 expect(withinValue).toHaveClass("withinRange");
//             } else if (cell.textContent === '4') {
//                 afterValue = cell;
//                 expect(afterValue).toHaveClass("endRange");

//                 fireEvent.click(afterValue);

//                 expect(beforeValue).not.toHaveClass("beginRange");
//                 expect(withinValue).not.toHaveClass("withinRange");
//                 expect(afterValue).toHaveClass("beginRange");
//             }
//         });
//     });
// });

// // describe("Disable Month View", () => {
// //     test("It should open up in Year View", () => {

// //     });
// //     test("It is impossible to navigate to Month View by pressing the Period Button", () => {

// //     });
// // });