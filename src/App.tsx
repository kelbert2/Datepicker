import React from 'react';
import './App.css';
import { ICalendarCell } from './CalendarBody';
import SimpleMultiyear from './SimpleMultiyear';
import DatepickerContext, { DatepickerContextProvider } from './DatepickerContext';

function App() {
    return (
        <DatepickerContextProvider>
            <SimpleMultiyear></SimpleMultiyear>
        </DatepickerContextProvider>

    );
}

export default App;
