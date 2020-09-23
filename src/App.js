import React from 'react';
import logo from './logo.svg';
import './App.css';

import RelationMenu from "./components/RelationMenu"
import RelationButton from "./components/RelationButton"

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
