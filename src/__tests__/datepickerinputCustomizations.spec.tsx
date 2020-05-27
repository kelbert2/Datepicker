import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, getAllByRole, getAllByLabelText, getByLabelText, render } from '@testing-library/react';
import DatepickerInput from "../DatepickerInput";
import { formatDateDisplay } from '../CalendarUtils';

let container: HTMLDivElement;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
});

const printOutDom = () => getByLabelText(container, /AHHHHHH/i);

// Date filters
// Selecting a minimum makes dates before that unselectable
// Clearing a selected minimum makes all dates selectable
describe("Changing date filters", () => {
    test("Inputting a minimum makes dates before that unselectable and resets the beginDate", () => {
        expect.assertions(9);

        let _beginDate = new Date();
        let _minDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _minDate.setDate(1);
        _endDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const minDateString = month + " / 4 / " + year;
        const endDateString = month + " / 6 / " + year;

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} minDate={_minDate}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                let dummyDate = new Date();
                dummyDate.setDate(4);
                _minDate = dummyDate;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} minDate={_minDate}></DatepickerInput>)
            }
        });
        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("disabled");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(minDateString);
                expect(endInput.value).toBe(endDateString);
            }
        });
    });
    test("Clearing a minimum makes all dates selectable", () => {
        expect.assertions(10);

        let _minDate = new Date() as Date | null;
        let _beginDate = new Date();
        let _endDate = new Date();
        _minDate?.setDate(2);
        _beginDate.setDate(4);
        _endDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 4 / " + year;
        const endDateString = month + " / 6 / " + year;

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} minDate={_minDate}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '1') {
                expect(cell).toHaveClass("disabled");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                _minDate = null;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} minDate={_minDate}></DatepickerInput >
                );
            }
        });

        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '1') {
                expect(cell).not.toHaveClass("disabled");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);
            }
        });
    });

    test("Inputting a maximum makes dates before that unselectable and resets the endDate", () => {
        expect.assertions(9);

        let _beginDate = new Date();
        let _maxDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _maxDate.setDate(7);
        _endDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const maxDateString = month + " / 4 / " + year;
        const endDateString = month + " / 6 / " + year;

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} maxDate={_maxDate}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                let dummyDate = new Date();
                dummyDate.setDate(4);
                _maxDate = dummyDate;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} maxDate={_maxDate}></DatepickerInput>)
            }
        });
        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("endRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("disabled");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(maxDateString);
            }
        });
    });
    test("Clearing a maximum makes all dates selectable", () => {
        expect.assertions(10);

        let _maxDate = new Date() as Date | null;
        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(4);
        _maxDate?.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const endDateString = month + " / 4 / " + year;

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} maxDate={_maxDate}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("endRange");
            } else if (cell.textContent === '7') {
                expect(cell).toHaveClass("disabled");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                _maxDate = null;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate} maxDate={_maxDate}></DatepickerInput >
                );
            }
        });

        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '4') {
                expect(cell).toHaveClass("endRange");
            } else if (cell.textContent === '7') {
                expect(cell).not.toHaveClass("disabled");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);
            }
        });
    });
    test("Inputting a date filter makes an unacceptable selectedDate unselectable and resets the dates that do not pass it", () => {
        expect.assertions(5);

        let _selectedDate = new Date();
        _selectedDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const selectedDateString = month + " / 6 / " + year;

        let _dateFilter = (date: Date | null) => { return true; }
        const _dateFilterTestInputs = [_selectedDate];

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={false} selectedDate={_selectedDate}
                dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
        );

        let selectedInput = getByLabelText(/Choose a date/i) as HTMLInputElement;
        fireEvent.click(selectedInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '6') {
                expect(cell).toHaveClass("selected");
                expect(selectedInput.value).toBe(selectedDateString);

                let dummyFilter = (date: Date | null) => {
                    return date != null && !(date.getDate() === 6);
                }
                _dateFilter = dummyFilter;

                rerender(<DatepickerInput rangeMode={false} selectedDate={_selectedDate}
                    dateFilter={_dateFilter} dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
                );
            }
        });
        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '6') {
                expect(cell).not.toHaveClass("selected");
                expect(cell).toHaveClass("disabled");
                expect(selectedInput.value).toBe("");
            }
        });
    });
    test("Inputting a date filter makes an unacceptable endDate unselectable and resets the dates that do not pass it", () => {
        expect.assertions(9);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const endDateString = month + " / 6 / " + year;

        let _dateFilter = (date: Date | null) => { return true; }
        const _dateFilterTestInputs = [_endDate];

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate}
                dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");
                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                let dummyFilter = (date: Date | null) => {
                    return date != null && !(date.getDate() === 6);
                }
                _dateFilter = dummyFilter;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate}
                    dateFilter={_dateFilter} dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
                );
            }
        });
        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).not.toHaveClass("endRange");
                expect(cell).toHaveClass("disabled");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe("");
            }
        });
    });
    test("Inputting a date filter makes an unacceptable beginDate unselectable and resets the dates that do not pass it", () => {
        expect.assertions(9);

        let _beginDate = new Date();
        let _endDate = new Date();
        _beginDate.setDate(2);
        _endDate.setDate(6);

        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const beginDateString = month + " / 2 / " + year;
        const endDateString = month + " / 6 / " + year;

        let _dateFilter = (date: Date | null) => { return true; }
        const _dateFilterTestInputs = [_beginDate];

        const { getAllByRole, getByLabelText, rerender } = render(
            <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate}
                dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
        );

        let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
        let endInput = getByLabelText(/end date/i) as HTMLInputElement;
        fireEvent.click(beginInput);

        let cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).toHaveClass("beginRange");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe(beginDateString);
                expect(endInput.value).toBe(endDateString);

                let dummyFilter = (date: Date | null) => {
                    return date != null && !(date.getDate() === 2);
                }
                _dateFilter = dummyFilter;

                rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_endDate}
                    dateFilter={_dateFilter} dateFilterTestInputs={_dateFilterTestInputs}></DatepickerInput >
                );
            }
        });
        cells = getAllByRole("gridcell");
        cells.forEach(cell => {
            if (cell.textContent === '2') {
                expect(cell).not.toHaveClass("beginRange");
                expect(cell).toHaveClass("disabled");
            } else if (cell.textContent === '6') {
                expect(cell).toHaveClass("endRange");

                expect(beginInput.value).toBe("");
                expect(endInput.value).toBe(endDateString)
            }
        });
    });
    // test("Clearing a date filter makes all dates selectable", () => {
    //     expect.assertions(10);

    //     let _filterDate = new Date() as Date;
    //     let _beginDate = new Date();
    //     let _endDate = new Date();
    //     _beginDate.setDate(2);
    //     _endDate.setDate(4);
    //     _filterDate.setDate(6);

    //     const today = new Date();
    //     const month = today.getMonth() + 1;
    //     const year = today.getFullYear();

    //     const beginDateString = month + " / 2 / " + year;
    //     const endDateString = month + " / 4 / " + year;
    //     const filterDateString = month + " / 6 / " + year;

    //     let _dateFilter = (date: Date | null) => { return !(date?.getDate() === 6); }

    //     const { getAllByRole, getByLabelText, rerender } = render(
    //         <DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_filterDate}
    //             dateFilter={_dateFilter} dateFilterTestInputs={[_filterDate]}></DatepickerInput >
    //     );

    //     let beginInput = getByLabelText(/Choose a start date/i) as HTMLInputElement;
    //     let endInput = getByLabelText(/end date/i) as HTMLInputElement;
    //     fireEvent.click(beginInput);

    //     let cells = getAllByRole("gridcell");
    //     cells.forEach(cell => {
    //         if (cell.textContent === '2') {
    //             expect(cell).toHaveClass("beginRange");
    //         } else if (cell.textContent === '4') {
    //             expect(cell).toHaveClass("endRange");
    //         } else if (cell.textContent === '6') {
    //             expect(cell).toHaveClass("disabled");

    //             expect(beginInput.value).toBe(beginDateString);
    //             expect(endInput.value).toBe(endDateString);

    //             const dummyFilter = (date: Date | null) => true;
    //             _dateFilter = dummyFilter;

    //             rerender(<DatepickerInput rangeMode={true} beginDate={_beginDate} endDate={_filterDate}
    //                 dateFilter={_dateFilter} dateFilterTestInputs={[_filterDate]}></DatepickerInput >
    //             );
    //         }
    //     });

    //     cells = getAllByRole("gridcell");
    //     cells.forEach(cell => {
    //         if (cell.textContent === '2') {
    //             expect(cell).toHaveClass("beginRange");
    //         } else if (cell.textContent === '6') {
    //             expect(cell).toHaveClass("endRange");
    //             expect(cell).not.toHaveClass("disabled");
    //             expect(beginInput.value).toBe(beginDateString);
    //             expect(endInput.value).toBe(filterDateString);
    //         }
    //     });
    // });
});

// Views
// Can change first day of the week
// Can change start view
// Can disable views
// Can disable input
// Can disable Calendar
// Can disable both

// Text and Labels
// Can change input labels