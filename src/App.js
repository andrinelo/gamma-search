import React, { useEffect } from 'react';
import './App.css';
import GremlinQueryDisplay from './components/GremlinQueryDisplay';
import OutputAccordion from './components/OutputAccordion'
import InfoContainer from "./components/InfoContainer.js"
import AggregateMenu from "./components/AggregateMenu";
import RelationMenu from "./components/RelationMenu"
import FilterMenu from "./components/FilterMenu"
import InspectedDatasetWindow from "./components/InspectedDatasetWindow"
import PropertyTableWindow from "./components/PropertyTableWindow"
import GraphQueryVisualizer from "./components/GraphQueryVisualizer"

import { useSelector, useDispatch } from "react-redux";
import { fetchQueryItems } from './actions/QueryManagerActions.js';
import {  INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, DATASET_NODE_COUNT, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS } from './actions/QueryKeys.js'


function App() {
  
  // Boolean value mapping to whether modals windows are active/open
  const inspectWindowOpen = useSelector(store => store.inspectDatasetWindowActive)
  const filterWindowOpen = useSelector(store => store.filterDatasetWindowActive)
  const propertyTableWindowOpen = useSelector(store => store.propertyTableWindowActive)
  const aggregateWindowOpen = useSelector(store => store.aggregateDatasetWindowActive)
  const relationWindowOpen = useSelector(store => store.relationWindowActive)
  
  const dispatch = useDispatch()

  // The amount of different datasets
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)

  // The node the user chose to inspect
  const selectedDataset = useSelector(store => store.selectedDataset)

  // Full current gremlin query
  const fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))

  // Gremlin query corresponding to the current inspected dataset
  const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  
  // Gremlin query corresponding to the selected dataset, ignoring any filters on this particular dataset
  const datasetBeforeFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, 1 + selectedDataset * 2).join(""))


  // Fetches the node count whenever the current gremlin query changes
  useEffect(() => {
    if(fullGremlinQuery !== ""){
      
      // Fetches the node count of the latest dataset
      const gremlinQueryNodesCount = fullGremlinQuery + ".dedup().count()"
      dispatch(fetchQueryItems(gremlinQueryNodesCount, DATASET_NODE_COUNT + (numberOfDatasets-1)))
    }
  //eslint-disable-next-line
  }, [fullGremlinQuery])


  // Whenever the inspectWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to the nodes and edges for the inspected dataset
  useEffect(() => {
    if(inspectWindowOpen && datasetAfterFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = datasetAfterFiltersGremlinQuery + ".dedup()"
      
      dispatch(fetchQueryItems(gremlinQuery, INSPECTED_NODES_IN_DATASET))
      dispatch(fetchQueryItems(gremlinQuery + ".union(outE(), inE()).groupCount().unfold().where(select(values).is(gt(1))).select(keys)", INSPECTED_EDGES_IN_DATASET))
    }
  //eslint-disable-next-line
  }, [inspectWindowOpen])


  // Whenever the filterWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to all the properties in the selected dataset without the dataset's filters
  useEffect(() => {
    if(filterWindowOpen && datasetBeforeFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = datasetBeforeFiltersGremlinQuery + ".dedup().properties().key().dedup()"

      dispatch(fetchQueryItems(gremlinQuery, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, 0))
    }
  //eslint-disable-next-line
  }, [filterWindowOpen])


  // Whenever the propertyTableWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to all the properties in the selected dataset with the dataset's filters
  useEffect(() => {
    if(propertyTableWindowOpen && datasetAfterFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = datasetAfterFiltersGremlinQuery + ".dedup().properties().key().dedup()"

      dispatch(fetchQueryItems(gremlinQuery, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, 0))
    }
  //eslint-disable-next-line
  }, [propertyTableWindowOpen])


  // Whenever the relationWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to all the ingoing and outgoing relations in the selected dataset (with the dataset's filters)
  useEffect(() => {
    if(relationWindowOpen && datasetAfterFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQueryIngoingRelations = datasetAfterFiltersGremlinQuery + ".inE().label().dedup()"
      const gremlinQueryOutgoingRelations = datasetAfterFiltersGremlinQuery + ".outE().label().dedup()"
      
      dispatch(fetchQueryItems(gremlinQueryIngoingRelations, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, 0))
      dispatch(fetchQueryItems(gremlinQueryOutgoingRelations, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS, 0))
    }
  //eslint-disable-next-line
  }, [relationWindowOpen])


  // Whenever the aggregateWindowOpen changes (to true), we fetch the gremlin query results 
  // corresponding to all the properties in the selected dataset with the dataset's filters
  useEffect(() => {
    if(aggregateWindowOpen && datasetAfterFiltersGremlinQuery !== "" && selectedDataset >= 0){
      const gremlinQuery = datasetAfterFiltersGremlinQuery + ".dedup().properties().key().dedup()"

      dispatch(fetchQueryItems(gremlinQuery, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, 0))
    }
  //eslint-disable-next-line
  }, [aggregateWindowOpen])
  
  
  return (
    <div style={{width: '70vw', margin: 'auto', backgroundColor: 'white', marginBottom: '50px', marginTop: '20px', padding: '10px'}}>
        <div style={{height: '40px'}}></div>
        <GraphQueryVisualizer></GraphQueryVisualizer>
        <div style={{height: '60px'}}></div>
        <InspectedDatasetWindow></InspectedDatasetWindow>
        <PropertyTableWindow></PropertyTableWindow>
        <FilterMenu></FilterMenu>
        <AggregateMenu/>
        <RelationMenu></RelationMenu>
        <GremlinQueryDisplay/>
        <OutputAccordion/>

        <hr style={{width: "50vw", marginTop: "40px"}}/>
        <InfoContainer></InfoContainer>
    </div>
  );
}

export default App;
