import React, { useContext, useState, ChangeEvent } from 'react';
import DatepickerContext from './DatepickerContext';
import Calendar from './Calendar';
import { formatDateDisplay } from './CalendarUtils';


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

        singleInputLabel,
        beginInputLabel,
        endInputLabel,

        parseStringToDate,
        displayDateAsString,

        dispatch
    } = useContext(DatepickerContext);

    const [_open, _setOpen] = useState(false);

    const [_beginInput, _setBeginInput] = useState(undefined as string | undefined);
    const [_endInput, _setEndInput] = useState(undefined as string | undefined);

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

    const _setInputClass = (filled: boolean) => {
        return filled ? 'filled' : '';
    }

    const _renderEndInput = () => {
        return (
            <div className="field">
                <span> - </span>
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
                onClick={() => { if (!(disable || disablePopup)) { _setOpen(c => !c) } }}
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
                {!rangeMode ? '' : _renderEndInput()}
                <button>Open</button>
            </div>
            <Calendar></Calendar>
        </div>
    );
}

export default Datepicker;