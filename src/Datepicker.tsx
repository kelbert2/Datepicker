import React, { useContext, useState, ChangeEvent, useEffect } from 'react';
import DatepickerContext, { DateData } from './DatepickerContext';
import Calendar from './Calendar';

type OPEN_STATES = 'popup' | 'large' | 'inline' | 'close';

function Datepicker() {
    const {
        selectedDate,
        todayDate,
        activeDate,

        onDateChange,
        onDateInput,
        onYearSelected,
        onMonthSelected,
        onDaySelected,

        startAt,
        startView,

        minDate,
        maxDate,
        dateFilter,

        rangeMode,
        beginDate,
        endDate,

        disableMonth,
        disableYear,
        disableMultiyear,

        disable,
        disablePopup,
        disableInput,
        popupLarge,
        closeAfterSelection,

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,

        dispatch
    } = useContext(DatepickerContext);

    const [_open, _setOpen] = useState('close' as OPEN_STATES);

    const [_beginInput, _setBeginInput] = useState(undefined as string | undefined);
    const [_endInput, _setEndInput] = useState(undefined as string | undefined);

    /** Update Calendar open status if allowances change. */
    useEffect(() => {
        if (disable) {
            _setOpen('close');
        } else if (disablePopup) {
            _setOpen('inline');
        }
        if (_open !== 'close' && !disablePopup) {
            _setOpen(popupLarge ? 'large' : 'popup');
        }
    }, [disable, disablePopup, popupLarge, _open]);

    const _handleClick = () => {
        if (_open === 'close') {
            if (!disable) {
                _setOpen(disablePopup ? 'inline' : popupLarge ? 'large' : 'popup');
            }
        } else {
            _setOpen('close');
        }
    }
    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setBeginInput((event.target.value.length > 0) ? event.target.value : undefined);
    }
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        _setEndInput((event.target.value.length > 0) ? event.target.value : undefined);
    }

    const _formatBeginInput = () => {
        _setBeginInput(_beginInput ? displayDateAsString(parseStringToDate(_beginInput)) : undefined);
    }
    const _formatEndInput = () => {
        _setEndInput(_endInput ? displayDateAsString(parseStringToDate(_endInput)) : undefined);
    }

    const _handleDateSelectionFromCalendar = (data: DateData) => {
        if (closeAfterSelection) {
            _setOpen('close');
        }
    }

    const _setInputClass = (filled: boolean) => {
        return filled ? 'filled' : '';
    }

    const _renderEndInput = () => {
        return (
            <div className="field">
                <input type="text"
                    disabled={disable || disableInput}
                    onChange={(e) => _handleEndInputChange(e)}
                    onBlur={() => _formatEndInput()}
                    value={_endInput}
                    className={_setInputClass(_endInput != null)}
                />
                <label>
                    {endInputLabel}
                </label>
            </div>
        );
    }

    return (
        <div>
            <div
                onClick={() => _handleClick()}
                className="fields"
            >
                <div className="field">
                    <input type="text"
                        disabled={disable || disableInput}
                        onChange={(e) => _handleBeginInputChange(e)}
                        onBlur={() => _formatBeginInput()}
                        value={_beginInput}
                        className={_setInputClass(_beginInput != null)}
                    />
                    <label>
                        {rangeMode ? beginInputLabel : singleInputLabel}
                    </label>
                </div>
                {rangeMode ? <span> - </span> : ''}
                {!rangeMode ? '' : _renderEndInput()}
                <button>Open</button>
            </div>
            {_open !== 'close' ?
                <Calendar
                    onFinalDateSelection={_handleDateSelectionFromCalendar}
                ></Calendar>
                : ''}
        </div>
    );
}

export default Datepicker;