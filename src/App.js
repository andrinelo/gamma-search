
import React, { useState, useEffect } from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'
import { autocompleteDebug } from './actions/AutocompleteTextfieldActions'
import StartNodeInputField from './components/StartNodeInputField.js'
import GraphView from "./components/GraphView.js"
import RelationButton from "./components/RelationButton"

import FilterMenu from "./components/FilterMenu"
import InspectedDatasetWindow from "./components/InspectedDatasetWindow"
import GraphQueryVisualizer from "./components/GraphQueryVisualizer"


import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET } from './actions/QueryKeys.js'


function App() {
  
  // The node the user chose to inspect
  let selectedDataset = useSelector(state => state.selectedDataset)

  // Boolean value mapping to whether the inspected node window is active/open
  const inspectWindowOpen = useSelector(state => state.inspectDatasetWindowActive)

  // Full current gremlin query
  let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))

  // Gremlin query corresponding to the current inspected dataset
  let inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, selectedDataset + 1).join(""))

  const dispatch = useDispatch()

  useEffect(() => {
    console.log("FETCHING")
    
    // The full current gremlin query results
    if(fullGremlinQuery !== ""){
      fullGremlinQuery += ".dedup()"
      dispatch(fetchQueryItems(fullGremlinQuery, FULL_RESULT_ITEMS))
    }

    // The gremlin query results corresponding to the inspected node
    if(inspectWindowOpen && inspectedGremlinQuery !== "" && selectedDataset >= 0){
      inspectedGremlinQuery += ".dedup()"
      
      dispatch(fetchQueryItems(inspectedGremlinQuery, INSPECTED_NODES_IN_DATASET))
      dispatch(fetchQueryItems(inspectedGremlinQuery + ".union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INSPECTED_EDGES_IN_DATASET))
    }
  })
  
  
  return (
    <div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <StartNodeInputField></StartNodeInputField>
        <InspectedDatasetWindow></InspectedDatasetWindow>
        <FilterMenu></FilterMenu>

        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
        <CloudButton cloudId={0}></CloudButton>
        
        <RelationButton edgeId = {1}></RelationButton>
        <RelationButton edgeId = {2}></RelationButton>
        <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} ></AutocompleteTextField> {/*It is
         possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
        {/* <GraphView graph={graphData}></GraphView> */}
        
    </div>
  );
}

export default App;
