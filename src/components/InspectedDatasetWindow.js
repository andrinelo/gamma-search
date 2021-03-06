import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import FullWidthTabs from "./GeneralizedTabView"

import { setHelpWindowActive } from '../actions/HelpWindowActions.js';
import { setInspectWindowActive } from '../actions/InspectDatasetWindowActions.js';
import { resetSelectedDataset } from '../actions/SelectedDatasetActions.js';
import { resetQueryItems } from '../actions/QueryManagerActions.js';
import { INSPECTED_NODES_IN_DATASET, INSPECTED_EDGES_IN_DATASET, DATASET_NODE_COUNT} from '../actions/QueryKeys.js'
import cytoscape from 'cytoscape';

// Cytoscape layouts
import cola from 'cytoscape-cola';

// Binds the 'cola' layout with cytoscape
cytoscape.use(cola);

// Modal slide transition animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// Component (modal) used for inspecting a dataset
export default function InspectedDatasetWindow(props) {
  // Style of the X-button in the corner
  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};
  
  const dispatch = useDispatch();
  const classes = useStyles();
  
  // Whether or not this modal is open
  const open = useSelector(state => state.inspectDatasetWindowActive)
  
  // The nodes in the selected dataset
  const inspectedNodes = useSelector(state => state.allQueryResults[INSPECTED_NODES_IN_DATASET])
  
  // The interconnected edges in the selected dataset (edges where both source and target node is in the dataset)
  const inspectedEdges = useSelector(state => state.allQueryResults[INSPECTED_EDGES_IN_DATASET])
  
  // Current page of the node-tab
  const [nodePage, setNodePage] = React.useState(1);
  
  // Current page of the edge-tab
  const [edgePage, setEdgePage] = React.useState(1);
  
  // The dataset we're inspecting
  const selectedDataset = useSelector(state => state.selectedDataset)
  
  // The amount of nodes in the inspected dataset
  const numberOfNodesInDataset = useSelector(state => state.allQueryResults[DATASET_NODE_COUNT + selectedDataset])
  
  // Nodes and edges that were selected by the user via the visualization
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  // The active tab (selected nodes or selected edges)
  const [activeTab, setActiveTab] = useState(0)

  // The ID and HTML / JSON of the reviewed node or edge
  const [reviewItemID, setReviewItemID] = useState(null)
  const [reviewItemHTML, setReviewItemHTML] = useState("Loading graph..." )
  
  // A reference to the cytoscape instance; used to update node and edge styling
  const [cyRef, setCyRef] = useState(null)

  // Possible tabvalues
  const [tabValues, setTabValues] = useState([])
  
  // Passes a ref of the function instead of the function itself to the graph component, to stop re-rendering
  const handleSelectedNodesAndEdgesChangeRef = useRef()

  // Sets a loading message
  useEffect(() => {
    
    if(open === true && numberOfNodesInDataset !== undefined && numberOfNodesInDataset[0] !== 0){
      setReviewItemHTML("Loading graph...")
    }
    else if(open === true){
      setReviewItemHTML("The dataset is empty. Try changing your filters or explored relations.")
    }
  //eslint-disable-next-line
  }, [open])
  
  
  // Whenever the contents of the dataset changes (for example when the async fetch is done),
  // we set the review HTML to either an 'error' message for when the dataset is empty, or
  // an informal message for when the dataset is not empty
  useEffect(() => {
    if(inspectedNodes.length === 0){
      setReviewItemHTML("The dataset is empty. Try changing your filters or explored relations.")
    }
    else {
      setReviewItemHTML(activeTab === 0 ? "No nodes have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges." : "No edges have been selected. View information about nodes and edges by selecting them in the graph. Hold down the 'Shift'-button on your keyboard to select multiple nodes and edges.")
    }
  //eslint-disable-next-line
  }, [inspectedNodes.length])


  // Sets the HTML for the two different tabs
  useEffect(() => {
    const newTabValues = []
    
    newTabValues.push(
      <div style={{maxHeight: '62vh'}}>
        <div style={{ height: '60vh', overflow: 'auto' }}>
          {reviewItemHTML}
        </div>
        <div className={classes.root}>
          <Pagination style={{display: 'flex', justifyContent: 'center', userSelect: 'none'}} count={selectedNodes.length} page={nodePage} siblingCount={0} onChange={handleNodePageChange} />
        </div>
      </div>
    )
    
    newTabValues.push(
      <div style={{maxHeight: '62vh'}}>
        <div style={{ height: '60vh', overflow: 'auto' }}>
          {reviewItemHTML}
        </div>
        <div className={classes.root}>
          <Pagination style={{display: 'flex', justifyContent: 'center', userSelect: 'none'}} count={selectedEdges.length} page={edgePage} siblingCount={0} onChange={handleEdgePageChange} />
        </div>
      </div>
    )

    setTabValues([...newTabValues])
  //eslint-disable-next-line
  }, [reviewItemHTML, selectedNodes])

  
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
  
  // Fired whenever the active tab changes
  const handleActiveTabChange = (tabNum) => {
    setActiveTab(tabNum)
    
    if(inspectedNodes.length === 0){
      setReviewItemHTML("The dataset is empty. Try changing your filters or explored relations.")
      return
    }
    
    updateReviewedItemID({tabNum: tabNum})
  }
  
  // Fired whenever the selected nodes or edges changes
  const handleSelectedNodesAndEdgesChange = (nodes, edges) => {
    setNodePage(1)
    setEdgePage(1)
    
    setSelectedNodes(nodes);
    setSelectedEdges(edges)
    
    
    updateReviewedItemID({nodes: nodes, edges: edges, nodePageNum: 1, edgePageNum: 1})
  };
  
  handleSelectedNodesAndEdgesChangeRef.current = handleSelectedNodesAndEdgesChange
  
  // Fired whenever the page in the node-tab changes
  const handleNodePageChange = (event, value) => {
    setNodePage(value);

    updateReviewedItemID({nodePageNum: value})
  };


  // Fired whenever the page in the edge-tab changes
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
    dispatch(resetQueryItems(INSPECTED_NODES_IN_DATASET))
    dispatch(resetQueryItems(INSPECTED_EDGES_IN_DATASET))
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'flex-start', // if you want to fill rows left to right
    height: '99%'
  }


  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="inspected-dataset-dialog-slide-title"
        maxWidth={false}
      >
        <div style={{ width: '80vw'}}>
          <DialogTitle id="inspected-dataset-dialog-slide-title" style={{textAlign: 'center'}}>
            {"Inspecting dataset " + (selectedDataset + 1)}
            <HelpOutlineOutlinedIcon style={{marginBottom: '-5px', marginLeft: '5px', cursor: 'pointer'}} onClick={() => dispatch(setHelpWindowActive(true))}/>
            <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose} alt="Close window"/></DialogTitle>
        </div>
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
  const classes = useStyles();
  const [graphLayout, setGraphLayout] = useState('grid')
    
  // Gremlin query corresponding to the current inspected dataset
  const selectedDataset = useSelector(state => state.selectedDataset)
  const inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join("")) + ".dedup()"
  

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

            // If in production we use our proxy set on the nginx server
            imageURL = process.env.NODE_ENV === 'production' ? "/ardoq" : ""
            imageURL += node['properties']['image'][0]['value']
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
              'background-color': '#add8e6',
              'label': 'data(name)',
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
          name: graphLayout,       
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
  //eslint-disable-next-line
  }, [props, graphLayout])

  return (
    <div style={{ height: "99%", width: '65%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      <div style={{ height: "9%", margin: '5px', marginTop: '-4%' }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Graph layout</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={graphLayout}
            onChange={(event) => setGraphLayout(event.target.value)}
          >
            <MenuItem value={'grid'}>GRID</MenuItem>
            <MenuItem value={'circle'}>CIRCLE</MenuItem>
            <MenuItem value={'concentric'}>CONCENTRIC</MenuItem>
            <MenuItem value={'cola'}>COLA</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ height: "82%", width: '99%' }} ref={graphInspectContainer}></div>
      <div style={{ height: '14%', maxWidth: '90%', margin: 'auto', overflow: 'auto'}}>
        <p style={{wordBreak: 'break-all', textAlign: 'center', fontSize: 'small'}}><b>Dataset generated from gremlin query</b><br/><i>{inspectedGremlinQuery}</i></p>
      </div>
    </div>
  )
}

const MemoInspectedDatasetGraph = React.memo(InspectedDatasetGraph);