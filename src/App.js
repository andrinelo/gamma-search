
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
import { FULL_RESULT_ITEMS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, ALL_PROPERTIES_OF_DATASET } from './actions/QueryKeys.js'

import {appendToGremlinQuery, removeGremlinQueryStepsAfterIndex} from './actions/GremlinQueryActions.js'

function App() {
  
  // The node the user chose to inspect
  let selectedDataset = useSelector(store => store.selectedDataset)

  // Boolean value mapping to whether modals windows are active/open
  const inspectWindowOpen = useSelector(store => store.inspectDatasetWindowActive)
  const filterWindowOpen = useSelector(store => store.filterDatasetWindowActive)

  // Full current gremlin query
  let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))

  // Gremlin query corresponding to the current inspected dataset
  let inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  
  // Gremlin query corresponding to the properties in the selected dataset, ignoring any filters on this particular dataset
  let propertiesBeforeFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, 1 + selectedDataset * 2).join(""))

  const dispatch = useDispatch()

  useEffect(() => {
    
    // The full current gremlin query results
    if(fullGremlinQuery !== ""){
      fullGremlinQuery += ".dedup()"
      dispatch(fetchQueryItems(fullGremlinQuery, FULL_RESULT_ITEMS))
    }

    // The gremlin query results corresponding to the nodes and edges for the inspected dataset
    if(inspectWindowOpen && inspectedGremlinQuery !== "" && selectedDataset >= 0){
      inspectedGremlinQuery += ".dedup()"
      
      dispatch(fetchQueryItems(inspectedGremlinQuery, INSPECTED_NODES_IN_DATASET))
      dispatch(fetchQueryItems(inspectedGremlinQuery + ".union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INSPECTED_EDGES_IN_DATASET))
    }

    // The gremlin query results corresponding to all the properties in the selected dataset
    if(filterWindowOpen && propertiesBeforeFiltersGremlinQuery !== "" && selectedDataset >= 0){
      propertiesBeforeFiltersGremlinQuery += ".dedup().properties().key().dedup()"
      
      dispatch(fetchQueryItems(propertiesBeforeFiltersGremlinQuery, ALL_PROPERTIES_OF_DATASET, 0))
    }


  })
  
  
  return (
    <div>
        <div style={{height: '40px'}}></div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <div style={{height: '60px'}}></div>
        <StartNodeInputField></StartNodeInputField>
        <InspectedDatasetWindow></InspectedDatasetWindow>
        <FilterMenu></FilterMenu>

        {/* Test-button to test node-adding */}
        <button onClick={() => 
          {
            dispatch(fetchQueryItems("g.V().properties('name').value().dedup()", "test", 0))

            if(fullGremlinQuery === ""){
              dispatch(appendToGremlinQuery("g.V()"))
              dispatch(appendToGremlinQuery(""))
            }
            else{
              dispatch(appendToGremlinQuery(".out()"))
              dispatch(appendToGremlinQuery(""))
            }
          }
        }>ADD DATASET (TEST-BUTTON)</button>

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
