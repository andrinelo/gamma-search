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
import useQuery from './queryManager';

import { useSelector, useDispatch } from "react-redux";
import { fetchResultItems } from './actions/ResultItemActions.js';

import Graph from "react-graph-vis";


function App() {
  let gremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))
  
  const dispatch = useDispatch()

  dispatch(fetchResultItems(gremlinQuery))


  //const queryData = useQuery("g.V().hasLabel('Person').limit(1)");
  //console.log(queryData.result)

  //const queryData2 = useQuery(gremlinQuery);
  //console.log(queryData2.result)

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
        <StartNodeInputField></StartNodeInputField>

        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
        <CloudButton></CloudButton>
        
        <RelationButton edgeId = {1}></RelationButton>
        <RelationButton edgeId = {2}></RelationButton>
        <AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} ></AutocompleteTextField> {/*It is
         possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
        <GraphView graph={graphData}></GraphView>
        
    </div>
  );
}




export default App;
