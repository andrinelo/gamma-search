import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import StartNodeInputField from './components/StartNodeInputField.js'

import RelationButton from "./components/RelationButton"
/*
<GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
      <OutputAccordion>
      </OutputAccordion>
      <CloudButton></CloudButton>
*/
function App() {
  return (

    <div>
      <h1>Start of the app :)</h1>
      <RelationButton edgeId = {1}></RelationButton>
      <RelationButton edgeId = {2}></RelationButton>


      
    </div>

  );
}




export default App;
