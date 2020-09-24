import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'
import { autocompleteDebug } from './actions/AutocompleteTextfieldActions'
function App() {
  return (
        <div>
          <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
          <OutputAccordion>
          </OutputAccordion>
          <CloudButton></CloudButton>
          <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} ></AutocompleteTextField> {/*It is
           possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
        </div>

  );
}




export default App;
