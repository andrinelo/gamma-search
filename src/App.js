import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import StartNodeInputField from './components/StartNodeInputField.js'
import Graph from "./components/Graph.js"

function App() {
  return (
        <div>
          <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
          <OutputAccordion>
          </OutputAccordion>
          <CloudButton></CloudButton>
          <StartNodeInputField></StartNodeInputField>
          <Graph></Graph>
        </div>
  );
}




export default App;
