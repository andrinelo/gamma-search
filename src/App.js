import React from 'react';
import './App.css';
import GremlinQueryDisplayAccordion from './components/GremlinQueryDisplayAccordion';
import OutputAccordion from './components/OutputAccordion'
import CloudButton from './components/CloudButton'

function App() {
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
