import React from 'react';
import './App.css';
import TestDisplay from './TestDisplay';
import InputTest from './InputTest';
import Display from './Display';

function App() {
    return (
        <div role="main">
            {/* <TestDisplay></TestDisplay>
            <InputTest></InputTest> */}
            <Display></Display>
        </div>
    );
}
// Currently dealing with sending calendar values when handling click off of calendar and close
// need to send double click of beginDate or endDate results when setCalendar changed, but seems like it's taking the input values instead
// will not update input until DateChange event, which triggers a close
export default App;
