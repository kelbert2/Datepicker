import React from 'react';
import './App.css';
import { DatepickerContextProvider } from './DatepickerContext';
import TestDisplay from './TestDisplay';
import Multiyear from './Multiyear';
import CalendarHeader from './CalendarHeader';
import Year from './Year';

function App() {
    return (
        <DatepickerContextProvider>
            <CalendarHeader
                currentView={'multiyear'}
                setCurrentView={() => { }}
            ></CalendarHeader>
            <Multiyear></Multiyear>
            <Year></Year>
            <TestDisplay></TestDisplay>
        </DatepickerContextProvider>

    );
}

export default App;
