import React from 'react';
import './App.css';
import Display from './Display';
import InputTest from './InputTest';

function App() {
    return (
        <div role="main">
            {/* <Display></Display> */}
            <InputTest></InputTest>
        </div>
    );
}
// TODO: Currently dealing with sending calendar values when handling click off of calendar and close
// need to send double click of beginDate or endDate results when setCalendar changed, but seems like it's taking the input values instead
// will not update input until DateChange event, which triggers a close
export default App;
