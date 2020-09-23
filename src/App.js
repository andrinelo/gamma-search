import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'

function App() {
  return (
        <div>
          <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
          <OutputAccordion>
          </OutputAccordion>
          <CloudButton></CloudButton>
          <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" ></AutocompleteTextField>
        </div>

  );
}




export default App;
