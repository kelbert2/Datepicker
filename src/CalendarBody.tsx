import React, { useState, useContext, useLayoutEffect } from 'react';
import DatepickerContext, { DateData } from './DatepickerContext';
import { sameDate, dateToMonthCellIndex, getDayDifference, getFirstDateOfMonthByDate, compareDates } from './CalendarUtils';

export interface ICalendarCell {
    cellIndex: number,
    value: Date,
    displayValue: string,
    ariaLabel: string,
    enabled: boolean,
}

/** Displays Calendar data in a table
         *  @param rows: Cells to display
         *  @param labelText: Label for the table ("JAN 2020")
         *  @param labelMinRequiredCells: Minimum number of cells the label spans
         *  @param selectedValueChange: Emits cell's value when a new cell is selected, 
         *  @param compare: Function to use to compare two dates (returns 0 if equal, negative if the first value is less than the second, positive if greater than)
         *  @param dateSelected: emits updated date, beginDate, and endDate depending on which cell has been selected
         *  @param createDateFromSelectedCell: Function to create a date for emission when a cell is selected
         *  @param beginDateSelected: If the user has already selected the start of the dates interval
         *  @param isBeforeSelected: If the current month is before the date already selected
         *  @param isCurrentMonthBeforeSelected: True when the current month is before the date already selected
         *  @param isRangeFull: Whether to mark all dates as within the selected range
         *  @param activeCell: Cell number in the table
         *  @param numCols: Number of columns in the table
         *  @param cellAspectRatio: The height/ width ratio to use for the cells
         */
export function CalendarBody(
    {
        rows = [],
        labelText = '',
        labelMinRequiredCells = 3,
        selectedValueChange = (cellValue: Date) => { },
        compare = compareDates,
        dateSelected = (d: DateData) => { },
        createDateFromSelectedCell = (date: Date) => { return date },
        beginDateSelected = false,
        isBeforeSelected = false,
        isCurrentMonthBeforeSelected = false,
        isRangeFull = false,
        activeCell = 0,
        numCols = 7,
        cellAspectRatio = 1
    }: {
        rows: ICalendarCell[][],
        labelText: string,
        labelMinRequiredCells: number,
        selectedValueChange: (cellValue: Date) => {} | void,
        compare: (date1: Date, date2: Date) => number,
        dateSelected: (d: DateData) => {} | void,
        createDateFromSelectedCell: (date: Date) => Date,
        beginDateSelected: boolean,
        isBeforeSelected: boolean,
        isCurrentMonthBeforeSelected: boolean,
        isRangeFull: boolean,
        activeCell: number,
        numCols: number,
        cellAspectRatio: number
    }) {

    const {
        selectedDate,
        todayDate,

        rangeMode,
        beginDate,
        endDate
    } = useContext(DatepickerContext);

    /** Blank cell offset for weekdays before the first day of the month. */
    const [_firstRowOffset, _setFirstRowOffset] = useState(0);
    /** Padding  for tds. */
    const [_cellPadding, _setCellPadding] = useState('0');
    /** Table cell widths. */
    const [_cellWidth, _setCellWidth] = useState(null as string | null);
    /** Flat index of the current hovered cell. */
    const [_cellHovered, _setCellHovered] = useState(null as number | null);

    /** On numCols or rows change, recalculate the first row offset. */
    useLayoutEffect(() => {
        _setFirstRowOffset((rows && rows.length && rows[0].length) ? numCols - rows[0].length : 0)
    }, [numCols, rows]);

    /** On activeCell change, update which cell is hovered. */
    useLayoutEffect(() => {
        _setCellHovered(activeCell + 1);
    }, [activeCell]);

    /** On cellAspectRatio or numCols change, update the cell padding. */
    useLayoutEffect(() => {
        _setCellPadding(`${50 * cellAspectRatio / numCols}%`);
    }, [cellAspectRatio, numCols]);

    /** On numCols change, update the cell width. */
    useLayoutEffect(() => {
        _setCellWidth(`${100 / numCols}%`);
    }, [numCols]);

    /** Emits event on cell selection. */
    const _cellClicked = (cell: ICalendarCell) => {
        if (cell.enabled) {
            const date = createDateFromSelectedCell(cell.value);

            // if (date) {
            //     console.log("setting active date from Calendar Body " + date);
            //     dispatch({
            //         type: 'set-active-date', payload: date
            //     });
            // }

            selectedValueChange(date);
        }
        return undefined;
    }

    /** Focuses the active cell after the microtask queue is empty. */
    // const _focusActiveCell = () => {
    //     // this._ngZone.runOutsideAngular(() => {
    //     //     this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    //     // const activeCell: HTMLElement | null =
    //     //     this._elementRef.nativeElement.querySelector('.active');

    //     // if (activeCell) {
    //     //     activeCell.focus();
    //     // }
    //     // });
    //     // });
    // }

    /** Determines if given row and column is the location of the current activeCell. */
    const _isActiveCell = (rowIndex: number, colIndex: number) => {
        let cellNumber = rowIndex * numCols + colIndex;
        if (rowIndex) {
            // first row may not be full
            cellNumber -= _firstRowOffset;
        }
        return cellNumber === activeCell;
    }

    /** Whether to mark as between begin and end dates in the selected range. */
    const _isWithinRange = (date: Date) => {
        if (!rangeMode) {
            return false;
        }
        if (isRangeFull) {
            return true;
        }
        if (beginDate && endDate && (compare(date, beginDate) === 0 || compare(date, endDate) === 0)) {
            return false;
        }
        return beginDate && endDate && compare(date, beginDate) > 0 && compare(date, endDate) < 0;
    }

    /** Whether to mark a date as within a range before the end has been selected, (hovered, begin]. */
    const _isBetweenHoveredAndBegin = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);

        if (!_cellHovered || !rangeMode || !beginDate) {
            return false;
        }

        if (beginDate) {
            const beginNumber = dateToMonthCellIndex(beginDate);
            if (_cellHovered < beginNumber) {
                // if hovered is before begin, needs to be after cell hovered
                return compare(date, beginDate) < 0 && cellNumber >= _cellHovered;
            }
            // if (_cellHovered > beginNumber) {
            //     // if hovered is after begin, needs to be before cell hovered
            //     return compare(date, beginDate) > 0 && cellNumber <= _cellHovered;
            // }
        }

        return false;
    }

    const _isBetweenHoveredAndEnd = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);

        if (!_cellHovered || !rangeMode || beginDateSelected) {
            return false;
        }
        if (endDate) {
            const endNumber = dateToMonthCellIndex(endDate);
            if (_cellHovered < endNumber) {
                // if hovered is before end, needs to be after cell hovered
                return compare(date, endDate) < 0 && cellNumber >= _cellHovered;
            }
            // if (_cellHovered > endNumber) {
            //     // if hovered is after end, needs to be before cell hovered
            //     return compare(date, endDate) > 0 && cellNumber <= _cellHovered;
            // }
        }
        // if (!endDate) {
        //     return cellNumber > _cellHovered;
        // }
        // if (endDate && _cellHovered > dateToMonthCellIndex(endDate)) {
        //     return date > endDate && cellNumber > _cellHovered;
        // }
        return false;
    }

    const _isAfterBegin = (date: Date) => {

        if (rangeMode && beginDate) {
            return date > beginDate;
        }
        return false;
    }
    const _isAfterEnd = (date: Date) => {

        if (rangeMode && endDate) {
            return date > endDate;
        }
        return false;
    }

    const _isBeforeSelected = (date: Date) => {
        if (rangeMode && selectedDate) {
            return date > selectedDate;
        }
        return false;
    }

    const _isAfterSelected = (date: Date) => {
        if (rangeMode && selectedDate) {
            return date > selectedDate;
        }
        return false;
    }

    // /** Whether to mark the cell as the beginning of the range. */
    // const _isBeginningOfRange = (date: Date, cellIndex?: number) => {
    //     // const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);
    //     // const beginNumber = beginDate ? dateToMonthCellIndex(beginDate) : 0;

    //     // if (rangeMode && beginDateSelected && _cellHovered) {
    //     //     if (isBeforeSelected && !beginDate) {
    //     //         return _cellHovered === cellNumber;
    //     //     } else {
    //     //         return (beginDate === date && !(_cellHovered < beginNumber)) ||
    //     //             (_cellHovered === cellNumber && _cellHovered < beginNumber);
    //     //     }
    //     // }
    //     // return beginDate === date;

    //     if (rangeMode && beginDateSelected && beginDate) {
    //         return compare(beginDate, date) === 0;
    //     }
    //     return false;
    // }

    // /** Whether to mark the cell as the end of the range. */
    // const _isEndOfRange = (date: Date, cellIndex?: number) => {
    //     const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);
    //     const beginNumber = beginDate ? dateToMonthCellIndex(beginDate) : 0;

    //     if (rangeMode && beginDateSelected && _cellHovered && endDate) {
    //         if (isBeforeSelected && !beginDate) {
    //             return false;
    //         } else {
    //             return (compare(date, endDate) === 0 && !(_cellHovered > beginNumber)) ||
    //                 (_cellHovered === cellNumber && _cellHovered > beginNumber)
    //         }
    //     }
    //     return endDate === date;
    // }

    /** Whether to highlight the target cell when selecting the second date while in range mode */
    const _previewCellOver = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : getDayDifference(date, getFirstDateOfMonthByDate(date));
        return _cellHovered === cellNumber && rangeMode && beginDateSelected;
    }

    /* DISPLAY ----------------------------------------------------------------------------------------- */

    /** Sets styling classes for each cell */
    const _setCellClass = (cell: ICalendarCell, rowIndex: number, colIndex: number) => {
        const disabledClass = "disabled";
        const activeClass = "active";
        const beginRangeClass = "beginRange";
        const endRangeClass = "endRange";
        const withinRangeClass = "withinRange";
        const hoveredClass = "hovered";
        const hoveredBeforeClass = "hoveredBefore";
        const hoveredAfterClass = "hoveredAfter";
        const withinHover = "hoveredWithin";
        const selectedClass = "selected";
        const todayClass = "today";
        const hoveredAfterSelectionClass = "hoveredAfterSelect";
        const hoveredBeforeSelectionClass = "hoveredBeforeSelect";

        let classes = [] as string[];

        if (!cell.enabled) {
            classes.push(disabledClass);
        }
        if (_isActiveCell(rowIndex, colIndex)) {
            classes.push(activeClass);
        }
        if (rangeMode) {
            // if (_isBeginningOfRange(cell.value, cell.cellIndex)) {
            if (beginDate && compare(beginDate, cell.value) === 0) {
                classes.push(beginRangeClass);

                if (_cellHovered && _cellHovered < cell.cellIndex) {
                    // if hovered is before begin
                    classes.push(hoveredBeforeClass);
                }
            }
            // if (_isEndOfRange(cell.value, cell.cellIndex)) {
            if (endDate && compare(endDate, cell.value) === 0) {
                classes.push(endRangeClass);

                if (_cellHovered && _cellHovered > cell.cellIndex) {
                    // if hovered is after end
                    classes.push(hoveredAfterClass);
                }
            }
            if (_isWithinRange(cell.value)) {
                classes.push(withinRangeClass);
                // } else if (_isBetweenHoveredAndBegin(cell.value, cell.cellIndex)) {
            } else if (_isBetweenHoveredAndBegin(cell.value, cell.cellIndex)) {
                classes.push(withinHover);
                if (cell.cellIndex === _cellHovered) {
                    classes.push(hoveredBeforeClass);
                }
                // } else if (_isBetweenHoveredAndEnd(cell.value, cell.cellIndex)) {
            } else if (_isBetweenHoveredAndEnd(cell.value, cell.cellIndex)) {
                classes.push(withinHover);
                if (cell.cellIndex === _cellHovered) {
                    classes.push(hoveredAfterClass);
                }
            }
        }

        if (_previewCellOver(cell.value, cell.cellIndex)) {
            classes.push(hoveredClass);
        }
        if ((selectedDate && compare(selectedDate, cell.value) === 0) || (beginDate && compare(beginDate, cell.value) === 0) || (endDate && compare(endDate, cell.value) === 0)) {
            classes.push(selectedClass);
        }
        if (todayDate ? compare(todayDate, cell.value) === 0 : compare(new Date(), cell.value) === 0) {
            classes.push(todayClass);
        }

        return classes.join(' ');
    }

    /** When mouse enters hover zone for a cell */
    const _onHover = (cell: ICalendarCell) => {
        _setCellHovered(cell.cellIndex);
        return undefined;
    }
    /** When mouse exists hover zone for a cell */
    const _offHover = (cell: ICalendarCell) => {
        if (_cellHovered === cell.cellIndex) {
            _setCellHovered(null);
        }
        return undefined;
    }

    /** Renders first row of Calendar Body with special spacer cell. */
    const _renderTextRow = () => {
        /* If there's not enough space in the first row, create a separate label row. Row is marked as 
   aria-hidden so it won't be read out as one of the weeks in the month. */
        if (_firstRowOffset < labelMinRequiredCells) {
            const paddingStyle = {
                padding: `0 ${_cellPadding}`
            }
            return (
                <tr aria-hidden="true">
                    <td colSpan={numCols}
                        style={paddingStyle}
                        className="labelText">
                        {labelText}
                    </td>
                </tr>
            );
        }
    }

    /** Renders all rows of the table. */
    const _renderRows = () => {
        let renderedRows = [] as JSX.Element[];

        const paddingStyle = {
            padding: `0 ${_cellPadding}`
        }
        const tdStyle = {
            width: `${_cellWidth}`,
            // padding: `0 ${_cellPadding}`
        }

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let renderedCells = [] as JSX.Element[];

            if (rowIndex === 0 && _firstRowOffset) {
                renderedCells.push(
                    <td
                        aria-hidden="true"
                        colSpan={_firstRowOffset}
                        style={paddingStyle}
                        className="labelText"
                    >
                        {_firstRowOffset >= labelMinRequiredCells ? labelText : ''}
                    </td>
                );
            }
            for (let colIndex = 0; colIndex < numCols; colIndex++) {
                const item = rows[rowIndex][colIndex];
                if (item != null) {
                    renderedCells.push(
                        <td role="gridcell"
                            tabIndex={_isActiveCell(rowIndex, colIndex) ? 0 : -1}
                            className={_setCellClass(item, rowIndex, colIndex)}
                            onClick={() => { _cellClicked(item) }}
                            // use arrow function on click else fires on page load
                            onMouseEnter={() => _onHover(item)}
                            onMouseLeave={() => _offHover(item)}
                            style={tdStyle}
                            aria-label={item.ariaLabel}
                            aria-disabled={!item.enabled || undefined}
                            aria-selected={sameDate(selectedDate, item.value)}
                        >
                            <div aria-label={item.ariaLabel}>{item.displayValue}</div>
                        </td>
                    );

                }
            }
            renderedRows.push(
                <tr role="row">
                    {renderedCells}
                </tr>
            );
        }
        return renderedRows;
    }

    return (
        <tbody>
            {_renderTextRow()}
            {_renderRows()}
        </tbody >
    );
}

export default CalendarBody;