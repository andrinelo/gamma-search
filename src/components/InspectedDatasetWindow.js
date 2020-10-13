import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { setInspectWindowActive } from '../actions/InspectDatasetWindowActions.js';
import { resetSelectedDataset } from '../actions/SelectedDatasetActions.js';
import FullWidthTabs from "./GeneralizedTabView"
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {INSPECTED_NODES_IN_DATASET, INSPECTED_EDGES_IN_DATASET} from '../actions/QueryKeys.js'

import cytoscape from 'cytoscape';
// import cxtmenu from 'cytoscape-cxtmenu';
// cytoscape.use( cxtmenu ); // register extension

// Cytoscape layouts
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
cytoscape.use(cola);
cytoscape.use(fcose);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export default function InspectedDatasetWindow(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const open = useSelector(state => state.inspectDatasetWindowActive)
  const inspectedNodes = useSelector(state => state.allQueryResults[INSPECTED_NODES_IN_DATASET])
  const inspectedEdges = useSelector(state => state.allQueryResults[INSPECTED_EDGES_IN_DATASET])
  const [nodePage, setNodePage] = React.useState(1);
  const [edgePage, setEdgePage] = React.useState(1);
  const selectedDataset = useSelector(state => state.selectedDataset)
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [reviewItemID, setReviewItemID] = useState(null)
  const [reviewItemHTML, setReviewItemHTML] = useState( activeTab === 0 ? "No nodes have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges." : "No edges have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")
  const [cyRef, setCyRef] = useState(null)

  // Gremlin query corresponding to the current inspected dataset
  const inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join("")) + ".dedup()"


  const updateReviewedItemID = ({tabNum = activeTab, nodes = selectedNodes, edges = selectedEdges, nodePageNum = nodePage, edgePageNum = edgePage}) => {
    let id = null;
    
    // User has chosen to view selected nodes, and has selected at least one node
    if(tabNum === 0 && nodes.length > 0){

      // The new node
      id = nodes[nodePageNum-1]['data']['id']

      // Applies styling change to new node, if more than one node was selected
      if(id !== null && cyRef.current !== null && nodes.length > 1){
        cyRef.current.$("#" + id).classes("previewedNode")
      }
    }
    
    // User has chosen to view selected edges, and has selected at least one edge
    else if(tabNum === 1 && edges.length > 0){
      
      // The new edge
      id = edges[edgePageNum-1]['data']['id']

      // Applies styling to the new edge, if more than one edge was selected
      if(id !== null && cyRef.current !== null && edges.length > 1){
        cyRef.current.$("#" + id).classes("previewedEdge")
      }
    }

    // Reverts styling-change done to previous node
    if(reviewItemID !== null && reviewItemID !== id && cyRef.current !== null){
      cyRef.current.$("#" + reviewItemID).classes("")
    }

    setReviewItemID(id)

    // User has selected at least one node or edge
    if(id !== null && id !== undefined && cyRef.current !== null){
      setReviewItemHTML(
        <pre style={{width: '100%'}}>
          {cyRef.current.$('#' + id).json()['data']['fullJSON']}
        </pre>
      )
    }

    // User has not selected either a node or an edge
    else {

      // Message for no nodes selected
      if(tabNum === 0){
        setReviewItemHTML("No nodes have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")
      }

      // Message for no edges selected
      else if(tabNum === 1){
        setReviewItemHTML("No edges have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")  
      }
    }

  }

  const handleActiveTabChange = (tabNum) => {
    setActiveTab(tabNum)
    
    updateReviewedItemID({tabNum: tabNum})
  }

  const handleSelectedNodesAndEdgesChange = (nodes, edges) => {
    setNodePage(1)
    setEdgePage(1)
    
    setSelectedNodes(nodes);
    setSelectedEdges(edges)


    updateReviewedItemID({nodes: nodes, edges: edges, nodePageNum: 1, edgePageNum: 1})
  };

  // Passes a ref to the function instead of the function itself to the graph component, to stop re-rendering
  const handleSelectedNodesAndEdgesChangeRef = useRef()
  handleSelectedNodesAndEdgesChangeRef.current = handleSelectedNodesAndEdgesChange


  const handleNodePageChange = (event, value) => {
    setNodePage(value);

    updateReviewedItemID({nodePageNum: value})
  };


  const handleEdgePageChange = (event, value) => {
    setEdgePage(value);

    updateReviewedItemID({edgePageNum: value})
  };

  // Handle modal window closes
  const handleClose = () => {
    setNodePage(1)
    setEdgePage(1)
    setReviewItemID(null)
    setSelectedEdges([])
    setSelectedNodes([])

    // Message for no nodes selected
    if(activeTab === 0){
      setReviewItemHTML("No nodes have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")
    }

    // Message for no edges selected
    else if(activeTab === 1){
      setReviewItemHTML("No edges have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")  
    }
    
    dispatch(setInspectWindowActive(false));
    dispatch(resetSelectedDataset());
  };

  const handleClickOpen = () => {
    dispatch(setInspectWindowActive(true));
  };
  

  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'flex-start', // if you want to fill rows left to right
    height: '99%'
  }

  const tabValues = []

  tabValues.push(
    <div style={{maxHeight: '62vh'}}>
      <div style={{ height: '60vh', overflow: 'auto' }}>
        {reviewItemHTML}
      </div>
      <div className={classes.root}>
        <Pagination style={{display: 'flex', justifyContent: 'center', userSelect: 'none'}} count={selectedNodes.length} page={nodePage} siblingCount={0} onChange={handleNodePageChange} />
      </div>
    </div>
  )

  tabValues.push(
    <div style={{maxHeight: '62vh'}}>
      <div style={{ height: '60vh', overflow: 'auto' }}>
        {reviewItemHTML}
      </div>
      <div className={classes.root}>
        <Pagination style={{display: 'flex', justifyContent: 'center', userSelect: 'none'}} count={selectedEdges.length} page={edgePage} siblingCount={0} onChange={handleEdgePageChange} />
      </div>
    </div>
  )

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
      >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign: 'center'}}>{"Dataset returned from " + inspectedGremlinQuery}<img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose} alt="Close modal"/></DialogTitle>
        <div style={{ width: '80vw', height: '80vh' }}>
          <div style={containerStyle}>
            <MemoInspectedDatasetGraph setCyRef={setCyRef} handleSelectedNodesAndEdgesChange={handleSelectedNodesAndEdgesChangeRef} inspectedNodes={inspectedNodes} inspectedEdges={inspectedEdges} open={open}></MemoInspectedDatasetGraph>
            <div style={{ width: '34%', maxHeight: '99%' }}>

              <FullWidthTabs setActiveTab={handleActiveTabChange} tabNames={["Selected Nodes", "Selected Edges"]} tabValues={[tabValues[0], tabValues[1]]} tabWidth={'100%'}></FullWidthTabs>

            </div>
          </div>
        </div>
        
      </Dialog>
    </div>
  );
}


// Cytoscape-graph-component
function InspectedDatasetGraph(props){
  const graphInspectContainer = useRef(null)
  const inspectedNodesIDs = props.inspectedNodes.map(node => node['id'])
  const cyRef = useRef()

  useEffect(() => {

    if(graphInspectContainer !== null){
      // Nodes and edges
      let elements = []

      // Adds all the nodes
      for (var i=0; i < props.inspectedNodes.length; i++) {
        try{
          var node = props.inspectedNodes[i]
          var imageURL = ""

          // Tries to fetch an image URL, if the node does not have an image we use the placeholder image
          if('image' in node['properties']){
            imageURL = 'url(' + "https://cors-anywhere.herokuapp.com/https://app.ardoq.com" + node['properties']['image'][0]['value'] +")"
          }
          else{
            imageURL = "url(/PlaceholderNodeImage.png)"
          }
          
      
          elements.push(
              { data: {
                id: node['id'], 
                nodeNum: i, 
                name: node['properties']['name'][0]['value'],
                imageURL: imageURL,
                fullJSON: JSON.stringify(node, undefined, 2)
                }
              },
          )
        }
        catch(err){
          console.log(err)
        }
      };

      // Adds all the edges
      for (var j=0; j < props.inspectedEdges.length; j++) {
        try{
          var edge = props.inspectedEdges[j]

          // Checks that our edge is between nodes in our graph
          if(inspectedNodesIDs.includes(edge['inV']) && inspectedNodesIDs.includes(edge['outV'])){
            elements.push({
              data: {
                id: edge['id'], 
                source: edge['outV'], 
                target: edge['inV'],
                fullJSON: JSON.stringify(edge, undefined, 2),
              }
            })
          }
        }
        catch (err){
          console.log(err)
        }  
      }
    
      var cy = cytoscape({
        container: graphInspectContainer.current, // container to render in
        //headless: true,
        elements: elements,
        
        style: [ // the stylesheet for the graph
          {
            selector: 'node',
            style: {

              // Uses https://cors-anywhere.herokuapp.com as proxy for the image
              // 'background-image':  '/PlaceholderNodeImage.png',
              'background-image':  'data(imageURL)',
              'background-repeat': 'no-repeat',
              "background-fit": "cover cover",
              //'background-size': 'contain',
              'background-color': '#add8e6',
              'label': 'data(name)',
              //'background-opacity': '0',
              'background-clip': 'none',

            }
            
          },

          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle', // there are far more options for this property here: http://js.cytoscape.org/#style/edge-arrow
            },
          },
      
          {
            selector: 'node:selected',
              style: {
                'border-width': '3px',
                'border-style': 'dashed',
                'border-color': '#006400',
                'width': '45%',
                'height': '45%'
            }
          },

          {
            selector: 'edge:selected',
              style: {
                'width': '4px',
                'line-style': 'dashed',
                'line-color': '#006400',
                'target-arrow-color': '#006400',
            }
          },

          {
            selector: '.previewedNode',
              style: {
                'width': '70%',
                'height': '70%',
                'border-width': '8px',
                'border-style': 'double',
                'border-color': '#00008B',
              }
          },

          {
            selector: '.previewedEdge',
              style: {
                'width': '6px',
                'line-style': 'solid',
                'line-color': '#00008B',
                'target-arrow-color': '#00008B',
              }
          },

        ],
      
        layout: {
          name: 'grid',
        } 
      })

      cy.minZoom(0.06)
      cy.maxZoom(3)

      // Function to add the newly selected nodes and edges to the list
      function addSelectedNodesAndEdges(){
        props.handleSelectedNodesAndEdgesChange.current(cy.$('node:selected').jsons(), cy.$('edge:selected').jsons())
      }

      
      // When nodes/edges are selected/unselected the following function is called for every single selected/unselected
      // node and edge. Usually this would result in a lot of state changes with multi-selects, which severly impacts 
      // the performance. To solve this we've added a timer to wait 300ms before making a state change. During those 300ms,
      // if another event is fired, the timer restarts back to 300ms. This ensures only the last fired
      // event will actually change the state.

      cy.on('select unselect', function(event){
        clearTimeout(cy.nodesSelectionTimeout);
        cy.nodesSelectionTimeout = setTimeout(addSelectedNodesAndEdges, 300)
      })

      cyRef.current = cy;
      props.setCyRef(cyRef)

    }

  },)

  return <div style={{ height: "99%", width: '65%' }} ref={graphInspectContainer}></div>
}

const MemoInspectedDatasetGraph = React.memo(InspectedDatasetGraph);