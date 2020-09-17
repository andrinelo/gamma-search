import React from 'react';
import './App.css';
import OutputAccordion from './components/OutputAccordion'

let testList = []
for(let i0=0; i0 < 100000; i0++) {
  testList.push(i0 + "Teksten sier: Ibsens ripsbærbusker og alskens buskevekster, jeg sa, Ibsens ripsbærbusker og alskens buskevekster!");
}


function App() {
  return (
        <OutputAccordion textList={testList}>
        </OutputAccordion>
  );
}

export default App;
