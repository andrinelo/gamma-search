
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
import AggregateMenu from "./components/AggregateMenu";
import FilterMenu from "./components/FilterMenu"
import InspectedDatasetWindow from "./components/InspectedDatasetWindow"
import PropertyTableWindow from "./components/PropertyTableWindow"
import GraphQueryVisualizer from "./components/GraphQueryVisualizer"

import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import { FULL_RESULT_ITEMS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, PROPERTY_TABLE_VALUES } from './actions/QueryKeys.js'

import {appendToGremlinQuery, removeGremlinQueryStepsAfterIndex} from './actions/GremlinQueryActions.js'


function App() {
  
  // The node the user chose to inspect
  let selectedDataset = useSelector(store => store.selectedDataset)

  // Boolean value mapping to whether modals windows are active/open
  const inspectWindowOpen = useSelector(store => store.inspectDatasetWindowActive)
  const filterWindowOpen = useSelector(store => store.filterDatasetWindowActive)
  const propertyTableWindowOpen = useSelector(store => store.propertyTableWindowActive)


  // Full current gremlin query
  let fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))

  // Gremlin query corresponding to the current inspected dataset
  let inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  
  // Gremlin query corresponding to the properties in the selected dataset, ignoring any filters on this particular dataset
  let propertiesBeforeFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, 1 + selectedDataset * 2).join(""))

  const dispatch = useDispatch()

  // Fetches the full results whenever the current gremlin query changes
  useEffect(() => {
    if(fullGremlinQuery !== ""){
      const gremlinQuery = fullGremlinQuery + ".dedup()"
      dispatch(fetchQueryItems(gremlinQuery, FULL_RESULT_ITEMS))
    }
  }, [fullGremlinQuery])


  // Whenever the inspectWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to the nodes and edges for the inspected dataset
  useEffect(() => {
    if(inspectWindowOpen && inspectedGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = inspectedGremlinQuery + ".dedup()"
      
      dispatch(fetchQueryItems(gremlinQuery, INSPECTED_NODES_IN_DATASET))
      dispatch(fetchQueryItems(gremlinQuery + ".union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INSPECTED_EDGES_IN_DATASET))
    }
  }, [inspectWindowOpen])


  // Whenever the filterWindowOpen changes (to true), we fetch thee gremlin query results 
  // corresponding to all the properties in the selected dataset without the dataset's filters
  useEffect(() => {
    if(filterWindowOpen && propertiesBeforeFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = propertiesBeforeFiltersGremlinQuery + ".dedup().properties().key().dedup()"

      dispatch(fetchQueryItems(gremlinQuery, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, 0))
    }
  }, [filterWindowOpen])


  useEffect(() => {
    dispatch(fetchQueryItems("g.V().hasLabel('Person').project('id', 'label', 'name').by(id).by(label).by(values('name').fold())", PROPERTY_TABLE_VALUES))
    
  }, [propertyTableWindowOpen])
  
  
  return (
    <div>
        <div style={{height: '40px'}}></div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <div style={{height: '60px'}}></div>
        <StartNodeInputField></StartNodeInputField>
        <InspectedDatasetWindow></InspectedDatasetWindow>
        <PropertyTableWindow></PropertyTableWindow>
        <FilterMenu></FilterMenu>
        {/*<AggregateMenu cloudId={0}/>*/}


        {/* Test-button to test node-adding */}
        <button onClick={() => 
          {
            // dispatch(fetchQueryItems("g.V().properties('name').value().dedup()", "test", 0))

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

        <GremlinQueryDisplayAccordion/>
        <OutputAccordion/>
        {/*<AutocompleteTextField id="testData1" displayText="HEY HEY CLICK ME" onChange={(debugText) => autocompleteDebug(debugText)} /> */}{/*It is
         possible to pass a function to autocomplete text field which is dispatched with the value of the text field on change. */}
        
    </div>
  );
}

export default App;
