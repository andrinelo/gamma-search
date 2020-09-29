import React from 'react';
import Graph from "react-graph-vis";

//import "./network.css";

function GraphView() {

  const graph = {
    nodes: [
      { id: 1, label: "Persons", x: 100, y : 100, group: "clouds" },
      { id: 2, label: "Result", shape: "diamond", x: 100, y : 250},
    ],
    edges: [
      { from: 1, to: 2 },
    ]
  };

  const options = {
    //layout: {
      //hierarchical: true
    //},
    edges: {
      color: "#000000"
    },
    height: "500px",

    physics:{
      enabled: false,
    },
    groups: {
      clouds: {
        shape: "image",
        image: require("../assets/cloud.png")
      },
    },
    nodes: {
      widthConstraint: 150,
    }

  };

  /*
  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };
  */

  return (
    <Graph
      graph={graph}
      options={options}
      //events={events}
    />
  );
}


export default GraphView;
