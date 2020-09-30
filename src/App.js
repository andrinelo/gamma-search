import React, { useEffect } from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'
import { autocompleteDebug } from './actions/AutocompleteTextfieldActions'
import StartNodeInputField from './components/StartNodeInputField.js'
import GraphView from "./components/GraphView.js"

import RelationButton from "./components/RelationButton"

import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS } from './actions/QueryKeys.js'


function App() {
  let gremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))
  
  const dispatch = useDispatch()

  useEffect(() => {
    if(gremlinQuery !== ""){
      dispatch(fetchQueryItems(gremlinQuery, FULL_RESULT_ITEMS))
    }
  })
  

  //const queryData = useQuery("g.V().hasLabel('Person').limit(1)");
  //console.log(queryData.result)

  //const queryData2 = useQuery(gremlinQuery);
  //console.log(queryData2.result)


  

  return (

    <div>
        <StartNodeInputField></StartNodeInputField>

        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
        <CloudButton></CloudButton>
        
        <RelationButton edgeId = {1}></RelationButton>
        <RelationButton edgeId = {2}></RelationButton>
        <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} ></AutocompleteTextField> {/*It is
         possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
    
        {/* <GraphView></GraphView> */}
    </div>
  );
}




export default App;
