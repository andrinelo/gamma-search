import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'
import { autocompleteDebug } from './actions/AutocompleteTextfieldActions'
import StartNodeInputField from './components/StartNodeInputField.js'
import RelationButton from "./components/RelationButton"
import useQuery from './queryManager';

function App() {
  //const queryData = useQuery("g.V().hasLabel('Person').limit(10)");
  //console.log(queryData)


  return (

    <div>
        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
        <CloudButton></CloudButton>
        <StartNodeInputField></StartNodeInputField>

        <RelationButton edgeId = {1}></RelationButton>
        <RelationButton edgeId = {2}></RelationButton>
          <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} ></AutocompleteTextField> {/*It is
           possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
    </div>
  );
}




export default App;
