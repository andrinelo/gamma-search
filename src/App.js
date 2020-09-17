import React from 'react';
import logo from './logo.svg';
import './App.css';
import OutputAccordion from './components/OutputAccordion'
import OutputListElement from './components/OutputListElement'
import { Container } from '@material-ui/core';

let testList = []
for(let i0=0; i0 < 100; i0++) {
  testList.push("Teksten sier: Ibsens ripsbærbusker og alskens buskevekster, jeg sa, Ibsens ripsbærbusker og alskens buskevekster!");
}

function App() {
  return (
    <Container>
      <OutputAccordion textList={testList}></OutputAccordion>
    </Container>
  );
}

export default App;
