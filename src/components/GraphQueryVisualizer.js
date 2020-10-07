import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import { setInspectWindowActive } from './../actions/InspectNodeActions.js';
import { setFilterWindowActive } from './../actions/FilterNodeActions.js';
import { setSelectedNode } from './../actions/SelectedNodeActions'



cytoscape.use( cxtmenu ); // register extension

export default function GraphQueryVisualizer() {
  const dispatch = useDispatch();
  const graphContainer = useRef(null)
  
  const stateRelations = useSelector((state) => state.relations);
  const stateRelationsArray = Object.entries(stateRelations);


  const NodesArray = [{     //Initiate with initial node
    data: { id: "0", nodeNum: 0, label: "Startnode"},
  }]

  stateRelationsArray.map((relation) => {   //Add nodes from relations
    NodesArray.push(
      { //node
        data: { id: relation[0], nodeNum: parseInt(relation[0])},
      },
      { // edge ab
        data: { id: NodesArray[parseInt(relation[0])-1].data.id +"-" + relation[0], source: NodesArray[parseInt(relation[0])-1].data.id, target: relation[0], label: relation[1].relations[0].text },
        selectable: false,
      }
    );
  })

  console.log("NODESARRAY: ", NodesArray)
  

  useEffect(() => {
    var cy = cytoscape({
      container: graphContainer.current, // container to render in

      elements: NodesArray,
      
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {

            // Uses https://cors-anywhere.herokuapp.com as proxy for the image
            'background-image': "url(/PlaceholderNodeImage.png)",
            'background-repeat': 'no-repeat',
            "background-fit": "cover cover",
            //'background-size': 'contain',
            'background-color': '#666',
            'label': 'data(label)',
            //'background-opacity': '0',
            'background-clip': 'none'
          }
          
        },
    
        /* {

          selector: 'node:active',
            style: {
          }
        }, */

        {
          selector: 'edge',
          style: {
            'width': 3,
            'label': 'data(label)',
            "color": "#fff",
            "text-outline-color": "#7d7878",
            "text-outline-width": 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle' // there are far more options for this property here: http://js.cytoscape.org/#style/edge-arrow
          },
        }
      ],
    
      layout: {
        name: 'grid',
        rows: 1
      }
    });


    // the default values of each option are outlined below:
  let defaults = {
    menuRadius: function(ele){ return 100; }, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. 
    selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
    commands: [ // an array of commands to list in the menu or a function that returns the array

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Filter this dataset', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function(ele){ // a function to execute when the command is selected
          console.log( ele.data()['nodeNum'] ) // `ele` holds the reference to the active element
          dispatch(setSelectedNode(ele.data()['nodeNum']))
          dispatch(setFilterWindowActive(true))
        },
        enabled: true // whether the command is selectable
      },

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Aggregate dataset', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function(ele){ // a function to execute when the command is selected
          console.log( ele.data()['nodeNum'] ) // `ele` holds the reference to the active element
        },
        enabled: true // whether the command is selectable
      },

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Inspect this dataset', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function(ele){ // a function to execute when the command is selected
          console.log( ele.data()['nodeNum'] ) // `ele` holds the reference to the active element
          dispatch(setSelectedNode(ele.data()['nodeNum']))
          dispatch(setInspectWindowActive(true))

        },
        enabled: true // whether the command is selectable
      },

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: "Explore dataset's relations", // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function(ele){ // a function to execute when the command is selected
          console.log( ele.data()['nodeNum'] ) // `ele` holds the reference to the active element
        },
        enabled: true // whether the command is selectable
      },

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: "Lorem Ipsum", // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function(ele){ // a function to execute when the command is selected
          console.log( ele.data()['nodeNum'] ) // `ele` holds the reference to the active element
        },
        enabled: true // whether the command is selectable
      }

    ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
    fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
    activePadding: 20, // additional size in pixels for the active command
    indicatorSize: 24, // the size in pixels of the pointer to the active command
    separatorWidth: 3, // the empty spacing in pixels between successive commands
    spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
    maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
    openMenuEvents: 'tapstart', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    itemColor: 'white', // the colour of text in the command's content
    itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
    zIndex: 9999, // the z-index of the ui div
    atMouse: false // draw menu at mouse position
    };

    let menu = cy.cxtmenu( defaults );

    cy.panningEnabled(false)
    cy.autoungrabify(true)


    cy.on('tap', 'edge', function(){
      var edge = this;
      console.log("TAPPING EDGE ", edge._private.data) //data has properties {id, source, target}
    }); // on tap


  }, [stateRelations])

  return (
    <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center' }}>
      <div style={{ width: '80%', height: "250px", }} ref={graphContainer}>
      </div>
    </div>
  );
}
