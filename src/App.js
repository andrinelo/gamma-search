import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'
import StartNodeInputField from './components/StartNodeInputField.js'

function App() {
  return (
        <div>
          <GremlinQueryDisplayAccordion></GremlinQueryDisplayAccordion>
          <OutputAccordion>
          </OutputAccordion>
          <CloudButton></CloudButton>
          <StartNodeInputField></StartNodeInputField>
        </div>
  );
}




export default App;
