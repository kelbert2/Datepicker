import React, { useState, useContext, useLayoutEffect, useCallback, useEffect } from 'react';
import DatepickerContext, { DateData } from './DatepickerContext';
import { sameDate, dateToMonthCellIndex, compareDates, getDay, formatDateDisplay } from './CalendarUtils';

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
         *  @param handleUserKeyPress: How to handle key presses over entire body
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
        dateToCellIndex = (date: Date) => { return dateToMonthCellIndex(date) },
        beginDateSelected = false,
        isBeforeSelected = false,
        isCurrentMonthBeforeSelected = false,
        isRangeFull = false,
        handleUserKeyPress = (event: KeyboardEvent) => { },
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
        dateToCellIndex: (date: Date) => number,
        beginDateSelected: boolean,
        isBeforeSelected: boolean,
        isCurrentMonthBeforeSelected: boolean,
        isRangeFull: boolean,
        handleUserKeyPress: (event: KeyboardEvent) => {} | void,
        activeCell: number,
        numCols: number,
        cellAspectRatio: number
    }) {

    const {
        selectedDate,
        todayDate,

        rangeMode,
        beginDate,
        endDate,

        dispatch
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
        console.log("Active cell changed: " + activeCell);
        _setCellHovered(activeCell);
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

            if (date) {
                // dispatch({
                //     type: 'set-active-date', payload: date
                // });
                selectedValueChange(date);
            }
        }
        return undefined;
    }

    /** Determines if given row and column is the location of the current activeCell. */
    // const _isActiveCell = (rowIndex: number, colIndex: number) => {
    //     let cellNumber = rowIndex * numCols + colIndex;
    //     if (rowIndex) {
    //         // first row may not be full
    //         cellNumber -= _firstRowOffset;
    //     }
    //     return cellNumber === activeCell;
    // }
    const _isActiveCell = (cell: ICalendarCell) => {
        return dateToCellIndex(cell.value) === activeCell;
    }

    /** Whether to mark as between begin and end dates in the selected range, exclusive. */
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

    /** Returns true if date is within the range (hovered, baseDate), inclusive, where hovered is before baseDate. */
    const _isBetweenHoveredAndDate = (date: Date, baseDate: Date | null, cellIndex?: number, baseCellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToCellIndex(date);
        const baseNumber = baseCellIndex ? baseCellIndex : dateToCellIndex(date);

        if (!_cellHovered || !rangeMode || !baseDate) {
            return false;
        } else {
            return (_cellHovered < baseNumber)
                ? compare(date, baseDate) <= 0 && cellNumber >= _cellHovered
                : false;
        }
    }
    /** Returns true if date is within the range (baseDate, hovered), inclusive, where baseDate is before hovered. */
    const _isBetweenDateAndHovered = (date: Date, baseDate: Date | null, cellIndex?: number, baseCellIndex?: number) => {
        const cellNumber = cellIndex ? cellIndex : dateToCellIndex(date);
        const baseNumber = baseCellIndex ? baseCellIndex : dateToCellIndex(date);

        if (!_cellHovered || !rangeMode || !baseDate) {
            return false;
        } else {
            return (_cellHovered > baseNumber)
                ? compare(date, baseDate) >= 0 && cellNumber <= _cellHovered
                : false;
        }
    }

    /** When mouse enters hover zone for a cell */
    const _onHover = (cell: ICalendarCell) => {
        if (cell.enabled) {
            // console.log("on Hovered cell index: " + cell.cellIndex);
            // console.log("calculated cell index: " + dateToCellIndex(cell.value));
            // these are correct here - is it not updated quickly enough?
            _setCellHovered(cell.cellIndex);
        }
        return undefined;
    }
    /** When mouse exists hover zone for a cell */
    const _offHover = (cell: ICalendarCell) => {
        if (_cellHovered === cell.cellIndex) {
            _setCellHovered(null);
        }
        return undefined;
    }
    /** Handle when a cell is focused, such as through tabbing. */
    const _handleCellFocus = (cell: ICalendarCell) => {
        if (cell.enabled) {
            activeCell = cell.cellIndex;

            dispatch({
                type: 'set-active-date',
                payload: cell.value
            });
        }
    }

    /** Deal with keypress events on a focused cell. */
    const _handleCellKeypress = (event: React.KeyboardEvent<HTMLTableDataCellElement>, cell: ICalendarCell) => {
        const { charCode } = event;
        switch (charCode) {
            case 13: {// Enter
                _cellClicked(cell);
            }
        }
    }
    /** Handle all keypresses across the entire Calendar. */
    const _handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        handleUserKeyPress(event);
    }, [handleUserKeyPress]);

    /** Listen for keypress events across the entire calendar body. */
    useEffect(() => {
        window.addEventListener('keydown', _handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', _handleUserKeyPress);
        };
    }, [_handleUserKeyPress]);

    /* DISPLAY ----------------------------------------------------------------------------------------- */

    /** Sets styling classes for each cell */
    const _setCellClass = (cell: ICalendarCell) => {
        const selectedClass = "selected";
        const todayClass = "today";

        const disabledClass = "disabled";
        const activeClass = "active";

        const beginRangeClass = "beginRange";
        const endRangeClass = "endRange";
        const withinRangeClass = "withinRange";

        const hoveredClass = "hovered";
        const beginHoveredRangeClass = "beginHoveredRange";
        const endHoveredRangeClass = "endHoveredRange";
        const withinHoveredRangeClass = "withinHoveredRange";

        let styles = [] as string[];

        if ((selectedDate && compare(selectedDate, cell.value) === 0)) {
            styles.push(selectedClass);
        }
        if (todayDate ? compare(todayDate, cell.value) === 0 : compare(new Date(), cell.value) === 0) {
            styles.push(todayClass);
        }
        if (!cell.enabled) {
            styles.push(disabledClass);
        }
        // if (_isActiveCell(rowIndex, colIndex)) {
        if (_isActiveCell(cell)) {
            styles.push(activeClass);
        }
        if (rangeMode) {
            if (beginDate && compare(beginDate, cell.value) === 0) {
                // if is the beginDate
                styles.push(beginRangeClass);

                if (!endDate) {
                    if (_cellHovered && _cellHovered < cell.cellIndex) {
                        // if hovered is before begin
                        styles.push(endHoveredRangeClass);
                    } else if (_cellHovered && _cellHovered > cell.cellIndex) {
                        // if hovered is after begin
                        styles.push(beginHoveredRangeClass);
                    }
                }
            }
            if (endDate && compare(endDate, cell.value) === 0) {
                // if is the endDate
                styles.push(endRangeClass);

                if (!beginDate) {
                    if (_cellHovered && _cellHovered > cell.cellIndex) {
                        // if hovered is after end
                        styles.push(beginHoveredRangeClass);
                    } else if (!beginDate && _cellHovered && _cellHovered < cell.cellIndex) {
                        // if hovered is before end
                        styles.push(endHoveredRangeClass);
                    }
                }
            }
            if (_isWithinRange(cell.value)) {
                // is between beginDate and endDate
                styles.push(withinRangeClass);
            }
            if ((!beginDate && endDate && _isBetweenHoveredAndDate(cell.value, endDate)) || (beginDate && _isBetweenHoveredAndDate(cell.value, beginDate))) {
                // if hovered is before beginDate and cell is between hovered and beginDate, or there is no beginDate, and it is between hovered and the endDate
                styles.push(withinHoveredRangeClass);

                if (dateToCellIndex(cell.value) === _cellHovered) {
                    // cell is currently hovered and therefore the beginning of this hovered range
                    styles.push(hoveredClass);
                    styles.push(beginHoveredRangeClass);
                }
            }
            // else
            if ((!endDate && beginDate && _isBetweenDateAndHovered(cell.value, beginDate)) || (endDate && _isBetweenDateAndHovered(cell.value, endDate))) {
                // if hovered is after endDate and cell is between hovered and endDate, or there is no endDate, and it is between hovered and beginDate
                styles.push(withinHoveredRangeClass);

                if (dateToCellIndex(cell.value) === _cellHovered) {
                    // cell is currently hovered and therefore the end of this hovered range
                    styles.push(hoveredClass);
                    styles.push(endHoveredRangeClass);
                }
            }

            // if (_cellHovered) {
            //     console.log("cell date: " + formatDateDisplay(cell.value));
            //     console.log(cell);
            //     console.log("calculated cell index: " + dateToCellIndex(cell.value));
            //     console.log("hovered: " + _cellHovered);
            // }
        }
        return styles.join(' ');
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
        return '';
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
                        <td
                            role="gridcell"
                            // tabIndex={_isActiveCell(rowIndex, colIndex) ? 0 : -1}
                            tabIndex={item.enabled ? 0 : -1}
                            className={_setCellClass(item)}
                            onClick={() => _cellClicked(item)}
                            onKeyPress={(e) => _handleCellKeypress(e, item)}
                            onFocus={() => _handleCellFocus(item)}
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