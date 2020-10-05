
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


import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS, INTERNAL_EDGES_IN_INSPECTED_NODES, INSPECTED_NODES } from './actions/QueryKeys.js'


import Graph from "react-graph-vis";

let inspectDataModelOpen = false;

function App() {
  
  // The node the user chose to inspect
  let nodeToInspect = useSelector(state => state.nodeToInspect)

  // Full current gremlin query
  let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join("") + ".dedup()")
  
  // Gremlin query corresponding to the current inspected dataset
  let inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, nodeToInspect + 1).join("") + ".dedup()")

  const dispatch = useDispatch()

  useEffect(() => {
    // The full current gremlin query results
    if(fullGremlinQuery !== ""){
      dispatch(fetchQueryItems(fullGremlinQuery, FULL_RESULT_ITEMS))
    }

    // The gremlin query results corresponding to the inspected node
    if(inspectedGremlinQuery !== ""){
      dispatch(fetchQueryItems(inspectedGremlinQuery, INSPECTED_NODES))
      dispatch(fetchQueryItems(inspectedGremlinQuery + ".dedup().union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INTERNAL_EDGES_IN_INSPECTED_NODES))
    }
  })
  

  const graph = {
    nodes: [
      { id: 1, label: "Persons", x: 100, y : 100, group: "clouds" },
      { id: 2, label: "Result", shape: "diamond", x: 100, y : 250},
    ],
    edges: [
      { from: 1, to: 2 },
    ]
  };


  const [graphData, setGraphData] = useState(graph);

  return (
    <div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <StartNodeInputField></StartNodeInputField>
        <InspectedNodeWindow></InspectedNodeWindow>

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
