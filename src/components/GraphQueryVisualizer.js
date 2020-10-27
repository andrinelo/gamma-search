import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import { setFilterWindowActive } from '../actions/FilterDatasetActions.js';
import { setInspectWindowActive } from './../actions/InspectDatasetWindowActions.js';
import { setPropertyTableWindowActive } from './../actions/PropertyTableWindowActions.js';
import { setSelectedDataset } from './../actions/SelectedDatasetActions';
import { setAggregateWindowActive } from '../actions/AggregateWindowActions.js';
import { DATASET_NODE_COUNT } from './../actions/QueryKeys';
import {setRelationWindowActive} from "./../actions/RelationWindowActions.js";

cytoscape.use( cxtmenu ); // register extension

export default function GraphQueryVisualizer() {
  const dispatch = useDispatch();
  const graphContainer = useRef(null)
  
  // The number of datasets in the graph is the same as the number of gremlin query parts divided by two (and floored)
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)

  // All results; contains (among others) the values for node count of each dataset
  const allResults = useSelector(state => state.allQueryResults)

  // Retrieve the size of the newest dataset; to be used to determine when to update the graph
  const newestDatasetSize = useSelector(state => state.allQueryResults[DATASET_NODE_COUNT + (numberOfDatasets-1)])
  
  useEffect(() => {

    let elements = []

    for(var i = 0; i < numberOfDatasets; i++){
      let nodeName = "Dataset " + (i+1)
      
      // Adds the node count
      if(allResults[(DATASET_NODE_COUNT + i)] !== undefined){
        nodeName += " [" + allResults[(DATASET_NODE_COUNT + i)][0]

        if(allResults[(DATASET_NODE_COUNT + i)][0] !== 1){
          nodeName += " nodes]"
        }
        else{
          nodeName += " node]"
        }
      }
      
      // Creates the nodes, the last / right-most node gets a different style
      elements.push(
        { data: {
          id: i, 
          nodeName: nodeName,
          borderWidth: i === (numberOfDatasets - 1) ? '3px' : '1px',
          borderStyle: i === (numberOfDatasets - 1) ? 'dashed' : 'solid',
          borderColor: i === (numberOfDatasets - 1) ? '#006400' : 'black',
          }
        },
      )

      // Creates the edges
      if(i>0){
        elements.push({
          data: {
            id: 'edge' + (i-1), 
            source: i-1, 
            target: i,
          },
          selectable: false,
        })
      }
    }

    var cy = cytoscape({
      container: graphContainer.current, // container to render in

      // Nodes and edges
      elements: elements,
      
      style: [ // the stylesheet for the graph
        {
          selector: 'core',
            style: {
              'active-bg-opacity': '0',
              'selection-box-opacity': '0',
          }
        }, 
      
        {
          selector: 'node',
          style: {
            
            'background-image': "url(/NodeImage1.png)",
            'background-repeat': 'no-repeat',
            "background-fit": "cover cover",
            'background-color': '#666',
            //'background-opacity': '0',
            'background-clip': 'none',
            'label': 'data(nodeName)',
            'width': '40%',
            'height': '40%',
            'border-width': 'data(borderWidth)',
            'border-style': 'data(borderStyle)',
            'border-color': 'data(borderColor)',
            /* 'overlay-color': 'red',
            'overlay-opacity': '0.35',
            'overlay-padding': '5', */
          }
          
        },

        {
          selector: 'node:active',
            style: {
              'overlay-opacity': '0',
          }
        }, 

        {
          selector: 'node.hover',
            style: {
              'border-width': '3px',
              'border-style': 'double',
              'border-color': 'blue',
          }
        }, 

        {
          selector: 'edge',
          style: {
            'width': '3px',
            // 'label': 'data(label)',
            "color": "#fff",
            "text-outline-color": "#7d7878",
            "text-outline-width": 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle' // there are far more options for this property here: http://js.cytoscape.org/#style/edge-arrow
          },
        },

        {
          selector: 'edge:active',
            style: {
              'overlay-opacity': '0',
          }
        }, 
      ],
    
      layout: {
        name: 'grid',
        rows: Math.floor(numberOfDatasets / 6) + 1
      }
    });


    // the default values of each option are outlined below
    let defaults = {
        menuRadius: function(ele){ return 100; }, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. 
        selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: [ // an array of commands to list in the menu or a function that returns the array

          { // Filter command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: 'Filter this dataset', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.data()['id'] ) // `ele` holds the reference to the active element
              dispatch(setSelectedDataset(ele.data()['id']))
              dispatch(setFilterWindowActive(true))
            },
            enabled: true // whether the command is selectable
          },

          { // Aggregate command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: 'Aggregate this dataset', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.data()['id'] ) // `ele` holds the reference to the active element
              dispatch(setSelectedDataset(ele.data()['id']))
              dispatch(setAggregateWindowActive(true));
            },
            enabled: true // whether the command is selectable
          },

          { // Inspect command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: 'Inspect this dataset', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.data()['id'] ) // `ele` holds the reference to the active element
              dispatch(setSelectedDataset(ele.data()['id']))
              dispatch(setInspectWindowActive(true))
            },

            enabled: true // whether the command is selectable
          },

          { // Command to open window where one can select properties and get the results as a table
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: 'Create property table', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.data()['id'] ) // `ele` holds the reference to the active element
              dispatch(setSelectedDataset(ele.data()['id']))
              dispatch(setPropertyTableWindowActive(true))
            },

            enabled: true // whether the command is selectable
          },

          { // Relation command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: "Explore dataset relations", // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.data()['id'] ) // `ele` holds the reference to the active element
              dispatch(setSelectedDataset(ele.data()['id']))
              dispatch(setRelationWindowActive(true))
            },
            enabled: true // whether the command is selectable
          },

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


      // Hovers over node
      cy.on('mouseover', 'node', function(e){
        var sel = e.target;
        sel.classes("hover")

        // Sets the cursor to pointer
        graphContainer.current.style.cursor = 'pointer'
      })

      // Hovers out from node
      cy.on('mouseout', 'node', function(e){
        var sel = e.target;
        sel.classes("")
        
        // Sets the cursor to default
        graphContainer.current.style.cursor = 'default'
    });
    
  }, [numberOfDatasets, newestDatasetSize])

  return (
    <div style={{ display: 'flex',  justifyContent:'center', alignItems:'center' }}>
      <div style={{ width: '95%', margin: 'auto', height: "200px", }} ref={graphContainer}>
      </div>
    </div>
  );
}
