import React from 'react';
import './App.css';
import { DatepickerContextProvider } from './DatepickerContext';
import TestDisplay from './TestDisplay';
import Datepicker from './Datepicker';

function App() {
    return (
        <DatepickerContextProvider>
            <Datepicker></Datepicker>
            <TestDisplay></TestDisplay>
        </DatepickerContextProvider>

    );
}

export default App;
