import React, { useContext, CSSProperties } from 'react';
import { ICalendarCell } from './CalendarBody';
import { sameDate } from './CalendarUtils';
import { DatepickerContext } from './DatepickerContext';

function CalendarCell(
    {
        item,
        handleClick,
        handleKeyPress,
        handleFocus,
        handleHoverOn,
        handleHoverOff,
        setCellClass,
        style
    }: {
        item: ICalendarCell,
        handleClick: (cell: ICalendarCell) => {} | void,
        handleKeyPress: (event: React.KeyboardEvent<HTMLTableDataCellElement>, cell: ICalendarCell) => {} | void,
        handleFocus: (cell: ICalendarCell) => {} | void,
        handleHoverOn: (cell: ICalendarCell) => {} | void,
        handleHoverOff: (cell: ICalendarCell) => {} | void,
        setCellClass: (cell: ICalendarCell) => string,
        style: CSSProperties
    }) {
    const {
        selectedDate,
    } = useContext(DatepickerContext);

    /** Emits event on cell selection. */
    const _cellClicked = () => {
        handleClick(item);
    }
    /** When mouse enters hover zone for a cell */
    const _onHover = () => {
        handleHoverOn(item)
    }
    /** When mouse exists hover zone for a cell */
    const _offHover = () => {
        handleHoverOff(item);
    }
    /** Handle when a cell is focused, such as through tabbing. */
    const _handleCellFocus = () => {
        handleFocus(item);
    }

    /** Deal with keypress events on a focused cell. */
    const _handleCellKeypress = (event: React.KeyboardEvent<HTMLTableDataCellElement>) => {
        handleKeyPress(event, item)
    }

    return (
        <td
            role="gridcell"
            // tabIndex={_isActiveCell(rowIndex, colIndex) ? 0 : -1}
            tabIndex={item.enabled ? 0 : -1}
            className={setCellClass(item)}
            onClick={_cellClicked}
            onKeyPress={_handleCellKeypress}
            onFocus={_handleCellFocus}
            onMouseEnter={_onHover}
            onMouseLeave={_offHover}
            style={style}
            aria-label={item.ariaLabel}
            aria-disabled={!item.enabled || undefined}
            aria-selected={sameDate(selectedDate, item.value)}
            key={'cal-cell-' + item.value}
        >
            <div aria-label={item.ariaLabel}>
                {item.displayValue}
            </div>
        </td>
    );
}

export default CalendarCell;