
import React, { useState, useEffect } from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import AutocompleteTextField from './components/AutocompleteTextField'
import { autocompleteDebug } from './actions/AutocompleteTextfieldActions'
import StartNodeInputField from './components/StartNodeInputField.js'
import GraphView from "./components/GraphView.js"

import InspectedNodeWindow from "./components/InspectedNodeWindow"
import GraphQueryVisualizer from "./components/GraphQueryVisualizer"
import RelationButton from "./components/RelationButton"
import AggregateMenu from './components/AggregateMenu.js';

import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS, INTERNAL_EDGES_IN_INSPECTED_NODES, INSPECTED_NODES } from './actions/QueryKeys.js'


import Graph from "react-graph-vis";

let inspectDataModelOpen = false;

function App() {
  
  // The node the user chose to inspect
  let selectedNode = useSelector(state => state.selectedNode)

  // Boolean value mapping to whether the inspected node window is active/open
  const inspectWindowOpen = useSelector(state => state.inspectNodeWindowActive)

  // Full current gremlin query
  let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join("") + ".dedup()")

  // Gremlin query corresponding to the current inspected dataset
  let inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, selectedNode + 1).join(""))

  const dispatch = useDispatch()

  useEffect(() => {
    
    // The full current gremlin query results
    if(fullGremlinQuery !== ""){
      dispatch(fetchQueryItems(fullGremlinQuery, FULL_RESULT_ITEMS))
    }

    // The gremlin query results corresponding to the inspected node
    if(inspectWindowOpen && inspectedGremlinQuery !== ""){
      inspectedGremlinQuery += ".dedup()"
      dispatch(fetchQueryItems(inspectedGremlinQuery, INSPECTED_NODES))
      dispatch(fetchQueryItems(inspectedGremlinQuery + ".dedup().union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INTERNAL_EDGES_IN_INSPECTED_NODES))
    }
  })
  
  
  return (
    <div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <StartNodeInputField></StartNodeInputField>
        <InspectedNodeWindow></InspectedNodeWindow>

        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
        <CloudButton></CloudButton>
        <StartNodeInputField></StartNodeInputField>
        <AggregateMenu/>
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
