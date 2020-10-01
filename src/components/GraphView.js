import React from 'react';
import Graph from "react-graph-vis";
import { v4 as uuidv4 } from "uuid";

//import "./network.css";

function GraphView({graph}) {

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

  return (
    <Graph key={uuidv4} graph={graph} options={options}></Graph>
  )


 
  /*
  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };
  */

}


export default GraphView;