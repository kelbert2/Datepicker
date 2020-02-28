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

    const [_beginInputFilled, _setBeginInputFilled] = useState(false);
    const [_endInputFilled, _setEndInputFilled] = useState(false);

    const _handleBeginInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseStringToDate(event.target.value);
        if (event.target.value.length > 0) {
            _setBeginInputFilled(true);
        } else {
            _setBeginInputFilled(false);
        }
        console.log(formatDateDisplay(inputValue));
    }
    const _handleEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = parseStringToDate(event.target.value);
        console.log(formatDateDisplay(inputValue));
    }

    const _formatDate = (date: Date) => {
        return formatDateDisplay(date);
    }

    const _setInputClass = (filled: boolean) => {
        return filled ? 'filled' : '';
    }
    const _renderEndInput = () => {
        return (
            <label>
                {endInputLabel}
                <input />
            </label>
        );
    }

    return (
        <div>
            <div
                onClick={() => { if (!(disable || disablePopup)) { _setOpen(c => !c) } }}
                className="field"
            >
                <input type="text"
                    disabled={disable || disableInput}
                    onChange={(e) => _handleBeginInputChange(e)}

                    value={(rangeMode && beginDate) ? displayDateAsString(beginDate) : selectedDate ? displayDateAsString(selectedDate) : undefined}
                    className={_setInputClass(_beginInputFilled)}
                />
                <label>
                    {rangeMode ? beginInputLabel : singleInputLabel}
                </label>
                {rangeMode ? ' - ' : ''}
                {!rangeMode ? '' : _renderEndInput()}
                <button>Open</button>
            </div>
            <Calendar></Calendar>
        </div>
    );
}

export default Datepicker;