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

import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS } from './actions/QueryKeys.js'


import Graph from "react-graph-vis";
import { v4 as uuidv4 } from "uuid";

import CytoscapeComponent from 'react-cytoscapejs';





function App() {
  let gremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))
  const dispatch = useDispatch()

  useEffect(() => {
    if(gremlinQuery !== ""){
      dispatch(fetchQueryItems(gremlinQuery, FULL_RESULT_ITEMS))
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

  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
 ];


 const myStyle = [
  {
    selector: 'node',
    style: {
      width: 100,
      height: 100,
      shape: 'rectangle',
      backgroundOpacity: 0,
      backgroundImage: require("./assets/cloud.png"),
      backgroundFit: 'contain',
    }
  },
  {
    selector: 'edge',
    style: {
      width: 5
    }
  }
  ];




  return (

    <div>
        <StartNodeInputField></StartNodeInputField>
        <CytoscapeComponent elements={elements} style={ { width: '100%', height: '600px' } } pan={ { x: 650, y: 300 } } stylesheet={myStyle}/>
        <RelationButton edgeId = {1}></RelationButton>
        <CloudButton></CloudButton>

        <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
        <OutputAccordion>
        </OutputAccordion>
    </div>
  );
}




export default App;
