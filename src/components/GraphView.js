import React from 'react';
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

import cloud from "./cloud.png"

//import "./network.css";

function GraphView() {

  const graph = {
    nodes: [
      { id: 1, label: "Persons", x: 100, y : 100, shape: "image", image: "./cloud.png" },
      { id: 2, label: "Result", shape: "diamond", x: 100, y : 200},
    ],
    edges: [
      { from: 1, to: 2 },
    ]
  };

  const options = {
    layout: {
      //hierarchical: true
    },
    edges: {
      color: "#000000"
    },
    height: "500px",

    physics:{
      enabled: false,
    },
    groups: {
      users: {
        shape: "image",
        image: "./cloud.png"
      },
    }

  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

  

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
}


export default GraphView;
