import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFullResults } from "./actions/FetchResultsActions.js";

function App() {

  // Fetches gremlinquery from Redux store
  const gremlinQuery = useSelector(state => state.gremlinQuery)
  
  // Could also just define gremlinQuery manually like this:
  //const gremlinQuery = "g.V().hasLabel('Person')"

  // Dispatcher used to dispatch actions in Redux
  const dispatch = useDispatch()
  

  // Dispatches action to fetch results from Ardoq-API using the above gremlinquery
  dispatch(fetchFullResults(gremlinQuery))

  return (
    <div>
      <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
      <OutputAccordion>
      </OutputAccordion>
      <CloudButton></CloudButton>
    </div>
  );
}




export default App;
