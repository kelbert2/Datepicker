import React from 'react';
import './App.css';
import { DatepickerContextProvider } from './DatepickerContext';
import TestDisplay from './TestDisplay';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';
import Month from './Month';

function App() {
    return (
        <DatepickerContextProvider>
            <CalendarHeader
                currentView={'multiyear'}
                setCurrentView={() => { }}
            ></CalendarHeader>
            <Multiyear></Multiyear>
            <Year></Year>
            <Month></Month>
            <TestDisplay></TestDisplay>
        </DatepickerContextProvider>

    );
}

export default App;
