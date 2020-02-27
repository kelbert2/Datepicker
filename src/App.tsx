import React from 'react';
import './App.css';
import { DatepickerContextProvider } from './DatepickerContext';
import TestDisplay from './TestDisplay';
import Calendar from './Calendar';

function App() {
    return (
        <DatepickerContextProvider>
            <Calendar></Calendar>
            <TestDisplay></TestDisplay>
        </DatepickerContextProvider>

    );
}

export default App;
