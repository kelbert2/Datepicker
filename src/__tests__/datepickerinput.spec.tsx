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
import { YEARS_PER_PAGE, euclideanModulo, formatDateDisplay } from '../CalendarUtils';

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
describe("Selected begin and end dates", () => {
    test("can select begin and end dates", () => {
        expect.assertions(5);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const endDateString = month + " / 4 / " + year;

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
            } else if (cell.textContent === '4') {
                endValue = cell;
                fireEvent.click(endValue);

                fireEvent.click(beginInput); //open calendar again
            }
        });
        cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '4') {
                endValue = cell; // TODO: for some reason need to reset endValue but not beginValue

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
        fireEvent.keyDown(beginInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values
        fireEvent.change(endInput, { target: { value: endDateString } });
        fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values
        fireEvent.click(beginInput); // open calendar

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

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);

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

    test("Inputting a date that is before the selected begin and end dates sets a new begin date", () => {
        expect.assertions(5);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);

        let beginValue: HTMLElement, withinValue: HTMLElement, endValue: HTMLElement, beforeValue: HTMLElement;

        ReactDOM.render(
            <DatepickerInput rangeMode={true}></DatepickerInput >,
            container);

        let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
        let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

        fireEvent.change(beginInput, { target: { value: endDateString } });
        fireEvent.keyDown(beginInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values
        expect(beginInput.value).toBe(endDateString);

        fireEvent.change(endInput, { target: { value: beginDateString } });
        fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values
        fireEvent.click(beginInput); // open calendar

        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
            } else if (cell.textContent === '4') {
                endValue = cell;

                expect(beginValue).toHaveClass("beginRange");
                expect(endValue).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);
            }
        });
    });

    test("Inputting a date after the begin and end dates sets a new end date", () => {
        expect.assertions(6);

        let _beginDate = new Date();
        let _endDate = new Date();
        let _afterDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);
        _afterDate.setDate(5);

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);
        const afterDateString = formatDateDisplay(_afterDate);

        let beginValue: HTMLElement, endValue: HTMLElement, afterValue: HTMLElement;

        ReactDOM.render(
            <DatepickerInput beginDate={_beginDate} endDate={_endDate} rangeMode={true}></DatepickerInput >,
            container);

        let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
        let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

        expect(beginInput.value).toBe(beginDateString);
        expect(endInput.value).toBe(endDateString);

        fireEvent.change(endInput, { target: { value: afterDateString } });
        fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values

        fireEvent.click(beginInput); // open calendar

        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
            } else if (cell.textContent === '5') {
                afterValue = cell;

                expect(beginValue).toHaveClass("beginRange");
                expect(afterValue).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(afterDateString);
            }
        });
    });
});
describe("Selected begin but no end date", () => {
    test("Selecting before the selected beginDate switches the two", () => {
        expect.assertions(5);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);

        let beginValue: HTMLElement, endValue: HTMLElement;

        ReactDOM.render(
            <DatepickerInput beginDate={_endDate} rangeMode={true}></DatepickerInput >,
            container);

        let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
        let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

        expect(beginInput.value).toBe(endDateString);
        expect(endInput.value).toBe("");

        fireEvent.click(beginInput); // open calendar

        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '4') {
                expect(cell).toHaveClass("beginRange");
            }
        });

        fireEvent.change(endInput, { target: { value: beginDateString } });
        fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values

        fireEvent.click(beginInput); // open calendar

        cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
            } else if (cell.textContent === '4') {
                endValue = cell;
                expect(beginValue).toHaveClass("beginRange");
                expect(endValue).toHaveClass("endRange");
            }
        });
    });
    test("Selecting a date after a begin date selects the end date", () => {
        expect.assertions(7);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);

        let beginValue: HTMLElement, endValue: HTMLElement;

        ReactDOM.render(
            <DatepickerInput beginDate={_beginDate} rangeMode={true}></DatepickerInput >,
            container);


        let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
        let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

        expect(beginInput.value).toBe(beginDateString);
        expect(endInput.value).toBe("");

        fireEvent.click(beginInput); // open calendar

        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            }
        });

        fireEvent.change(endInput, { target: { value: endDateString } });
        fireEvent.keyDown(endInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values

        fireEvent.click(beginInput); // open calendar

        cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
                expect(beginValue).toHaveClass("beginRange");
            } else if (cell.textContent === '4') {
                endValue = cell;
                expect(beginValue).toHaveClass("beginRange");
                expect(endValue).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString)
            }
        });
    });
});
describe("Selected end but no begin date", () => {
    test("Inputting a date before the end date sets a begin date", () => {
        expect.assertions(7);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);

        const beginDateString = formatDateDisplay(_beginDate);
        const endDateString = formatDateDisplay(_endDate);

        let beginValue: HTMLElement, endValue: HTMLElement;

        ReactDOM.render(
            <DatepickerInput endDate={_endDate} rangeMode={true}></DatepickerInput >,
            container);

        let beginInput = getAllByLabelText(container, /Choose a start date/i)[0] as HTMLInputElement;
        let endInput = getAllByLabelText(container, /end date/i)[0] as HTMLInputElement;

        expect(beginInput.value).toBe("");
        expect(endInput.value).toBe(endDateString);

        fireEvent.click(beginInput); // open calendar

        let cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '4') {
                expect(cell).toHaveClass("endRange");

                fireEvent.change(beginInput, { target: { value: beginDateString } });
                fireEvent.keyDown(beginInput, { key: 'Enter', code: 'Enter', keyCode: 13 }); // trigger on blur response to update internal values        

                fireEvent.click(beginInput); // open calendar
            }
        });

        cells = getAllByRole(container, "gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                beginValue = cell;
            } else if (cell.textContent === '4') {
                expect(beginValue).toHaveClass("beginRange");
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);
            }
        });
    });

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
});
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