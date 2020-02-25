import React, { useState, useEffect, useContext } from 'react';
import DatepickerContext from './DatepickerContext';
import { getDayDifference, getFirstDateOfMonthByDate, dateToNumber, dateToMonthCellIndex, sameDate } from './CalendarUtils';

export interface ICalendarCell {
    cellIndex: number,
    value: Date,
    displayValue: string,
    ariaLabel: string,
    enabled: boolean,
}

export interface CalendarBodyProps {
    rows: ICalendarCell[][],
    isCurrentMonthBeforeSelectedDate: boolean,
    isRangeFull: boolean,
}

/** Displays Calendar data in a table
         *  @param rows: Cells to display
         *  @param labelText: Label for the table ("JAN 2020")
         *  @param labelMinRequiredCells: Minimum number of cells the label spans
         *  @param selectedValueChange: Emits when a new value is selected
         *  @param beginDateSelected: If the user has already selected the start of the dates interval
         *  @param isBeforeSelected: If the current month is before the date already selected
         *  @param isCurrentMonthBeforeSelected: True when the current month is before the date already selected
         *  @param isRangeFull: Whether to mark all dates as within the selected range
         *  @param activeCell: Cell number in the table
         *  @param numCols: Number of columns in the table
         *  @param cellAspectRatio: The width/ height ratio to use for the cells
         */
export function CalendarBody(
    {
        rows = [],
        labelText = '',
        labelMinRequiredCells = 3,
        selectedValueChange = (cell: number) => { },
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
        selectedValueChange: (cell: number) => {} | void,
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
        activeDate,

        dateChange,
        dateInput,
        yearSelected,
        monthSelected,
        daySelected,

        startAt,
        startView,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate
    } = useContext(DatepickerContext);

    const [_firstRowOffset, _setFirstRowOffset] = useState(0);
    const [_cellPadding, _setCellPadding] = useState('0');
    const [_cellWidth, _setCellWidth] = useState(null as string | null);
    const [_cellHovered, _setCellHovered] = useState(null as number | null);

    /** On numCols or rows change */
    useEffect(() => {
        _setFirstRowOffset((rows && rows.length && rows[0].length) ? numCols - rows[0].length : 0)
    }, [numCols, rows]);

    /** On activeCell change */
    useEffect(() => {
        _setCellHovered(activeCell + 1);
    }, [activeCell]);

    /** On cellAspectRatio or numCols change */
    useEffect(() => {
        // if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
        _setCellPadding(`${50 * cellAspectRatio / numCols}%`);
    }, [cellAspectRatio, numCols]);

    /** On numCols or cellWidth change */
    useEffect(() => {
        if (!_cellWidth) {
            _setCellWidth(`${100 / numCols}%`);
        }
    }, [numCols, _cellWidth]);

    /** Emit event on cell selection */
    const _cellClicked = (cell: ICalendarCell) => {
        if (cell.enabled) {
            selectedValueChange(dateToNumber(cell.value));
        }
        return undefined;
    }

    /** Focuses the active cell after the microtask queue is empty. */
    const _focusActiveCell = () => {
        // this._ngZone.runOutsideAngular(() => {
        //     this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        // const activeCell: HTMLElement | null =
        //     this._elementRef.nativeElement.querySelector('.active');

        // if (activeCell) {
        //     activeCell.focus();
        // }
        // });
        // });
    }

    /** Determines if given row and column is the location of the current activeCell */
    const _isActiveCell = (rowIndex: number, colIndex: number) => {
        let cellNumber = rowIndex * numCols + colIndex;
        if (rowIndex) {
            // first row may not be full
            cellNumber -= _firstRowOffset;
        }
        return cellNumber === activeCell;
    }

    /** Whether to mark as semi-selected - between begin and end dates in the selected range */
    const _isWithinRange = (date: Date) => {
        if (!rangeMode) {
            return false;
        }
        if (isRangeFull) {
            return true;
        }
        if (date === beginDate || date === endDate) {
            return false;
        }
        // amidst selection process: 
        if (beginDate && !endDate) {
            return date > beginDate;
        }
        if (endDate && !beginDate) {
            return date < endDate;
        }
        return beginDate && endDate && date > beginDate && date < endDate;
    }

    // TODO: allow to select begin after end, and hover before
    /** Whether to mark a date as within a range before the end has been selected */
    const _isBetweenHoveredAndBegin = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);

        if (!_cellHovered || !rangeMode || !beginDateSelected) {
            return false;
        }
        if (isBeforeSelected && !beginDate) {
            return cellNumber > _cellHovered;
        }
        if (beginDate && _cellHovered > dateToMonthCellIndex(beginDate)) {
            return date > beginDate && cellNumber > _cellHovered;
        }
        return false;
    }

    /** Whether to mark the cell as the beginning of the range. */
    const _isBeginningOfRange = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);
        const beginNumber = beginDate ? dateToMonthCellIndex(beginDate) : 0;

        if (rangeMode && beginDateSelected && _cellHovered) {
            if (isBeforeSelected && !beginDate) {
                return _cellHovered === cellNumber;
            } else {
                return (beginDate === date && !(_cellHovered < beginNumber)) ||
                    (_cellHovered === cellNumber && _cellHovered < beginNumber);
            }
        }
        return beginDate === date;
    }

    /** Whether to mark the cell as the end of the range. */
    const _isEndOfRange = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToMonthCellIndex(date);
        const beginNumber = beginDate ? dateToMonthCellIndex(beginDate) : 0;

        if (rangeMode && beginDateSelected && _cellHovered) {
            if (isBeforeSelected && !beginDate) {
                return false;
            } else {
                return (endDate === date && !(_cellHovered > beginNumber)) ||
                    (_cellHovered === cellNumber && _cellHovered > beginNumber)
            }
        }
        return endDate === date;
    }

    /** Whether to highlight the target cell when selecting the second date while in range mode */
    const _previewCellOver = (date: Date, cellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : getDayDifference(date, getFirstDateOfMonthByDate(date));
        return _cellHovered === cellNumber && rangeMode && beginDateSelected;
    }

    /* DISPLAY ----------------------------------------------------------------------------------------- */

    /** Renders first row of Calendar Body */
    const _renderTextRow = () => {
        /* Create the first row separately so we can include a special spacer cell. */

        /* If there's not enough space in the first row, create a separate label row. We mark this row as 
   aria-hidden because we don't want it to be read out as one of the weeks in the month.*/
        if (_firstRowOffset < labelMinRequiredCells) {
            const paddingStyle = {
                padding: `0 ${_cellPadding}`
            }
            return (
                <tr aria-hidden="true">
                    <td colSpan={numCols}
                        style={paddingStyle}>
                        {labelText}
                    </td>
                </tr>);
        }
    }

    // TODO: refactor this
    /** Sets styling classes for each cell */
    const _setRowClass = (cell: ICalendarCell, rowIndex: number, colIndex: number) => {
        const disabledClass = "disabled";
        const activeClass = "active";
        const beginRangeClass = "beginRange";
        const endRangeClass = "endRange";
        const withinRange = "withinRange";
        const hoveredClass = "hovered";
        const selectedClass = "selected";
        const todayClass = "today";

        let classes = [] as string[];
        if (!cell.enabled) {
            classes.push(disabledClass);
        }
        if (_isActiveCell(rowIndex, colIndex)) {
            classes.push(activeClass);
        }
        if (_isBeginningOfRange(cell.value, cell.cellIndex)) {
            classes.push(beginRangeClass);
        }
        if (_isEndOfRange(cell.value, cell.cellIndex)) {
            classes.push(endRangeClass);
        }
        if (_isWithinRange(cell.value) || _isBetweenHoveredAndBegin(cell.value, cell.cellIndex)) {
            classes.push(withinRange);
        }
        if (_previewCellOver(cell.value, cell.cellIndex)) {
            classes.push(hoveredClass);
        }
        if (sameDate(selectedDate, cell.value) || sameDate(beginDate, cell.value) || sameDate(endDate, cell.value)) {
            classes.push(selectedClass);
        }
        if (sameDate(todayDate, cell.value)) {
            classes.push(todayClass);
        }

        return classes.join(', ');
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

    /** Renders a single row of the table */
    const _renderRow = (rowIndex: number) => {
        const paddingStyle = {
            padding: `0 ${_cellPadding}`
        }
        const tdStyle = {
            width: `${_cellWidth}`,
            padding: `0 ${_cellPadding}`
        }

        let renderedRows = [];
        /* Mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.
The aspect ratio of the table cells is maintained by setting the top and bottom padding as a
percentage of the width (a variant of the trick described here:
    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp). */

        if (rowIndex === 0 && _firstRowOffset) {
            renderedRows.push(
                <td
                    aria-hidden="true"
                    colSpan={_firstRowOffset}
                    style={paddingStyle}
                >
                    {_firstRowOffset >= labelMinRequiredCells ? labelText : ''}
                </td>);
        }
        for (let colIndex = 0; colIndex < numCols; colIndex++) {
            const item = rows[rowIndex][colIndex];

            renderedRows.push(
                <td role="gridcell"
                    tabIndex={_isActiveCell(rowIndex, colIndex) ? 0 : -1}
                    className={_setRowClass(item, rowIndex, colIndex)}
                    onClick={_cellClicked(item)}
                    onMouseEnter={_onHover(item)}
                    onMouseLeave={_offHover(item)}
                    style={tdStyle}
                    aria-label={item.ariaLabel}
                    aria-disabled={!item.enabled || undefined}
                    aria-selected={sameDate(selectedDate, item.value)}
                >
                    {_renderCell(rows[rowIndex][colIndex])}
                </td>
            );
        }
        return (
            <tr role="row">
                {renderedRows}
            </tr>);
    }
    /** Renders an individual cell */
    const _renderCell = (cell: ICalendarCell) => {
        return (
            <div aria-label={cell.ariaLabel}>{cell.displayValue}</div>
        );
    }
    /** Renders all rows of the table */
    const _renderRows = () => {
        let renderedRows = [];
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            renderedRows.push(_renderRow(rowIndex));
        }
        return renderedRows;
    }

    return (
        <div>
            {_renderTextRow()}
            {_renderRows()}
        </div >
    );
}

export default CalendarBody;