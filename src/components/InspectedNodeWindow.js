import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { setInspectWindowActive } from './../actions/InspectNodeActions.js';
import { resetSelectedNode } from './../actions/SelectedNodeActions.js';

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

export default function InspectedNodeWindow(props) {
  const dispatch = useDispatch();
  const open = useSelector(state => state.inspectNodeWindowActive)
  const inspectedNodes = useSelector(state => state.allQueryResults.inspectedNodes)
  const inspectedEdges = useSelector(state => state.allQueryResults.internalEdgesInInspectedNodes)
  const inspectedNodesIDs = inspectedNodes.map(node => node['id'])
  const graphInspectContainer = useRef(null)

  const selectedNode = useSelector(state => state.selectedNode)

  // Gremlin query corresponding to the current inspected dataset
  const inspectedGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, selectedNode + 1).join("")) + ".dedup()"

  const handleClose = () => {
    dispatch(setInspectWindowActive(false));
    dispatch(resetSelectedNode());
    
  };
  const handleClickOpen = () => {
    dispatch(setInspectWindowActive(true));
  };



  useEffect(() => {

    if(graphInspectContainer.current !== null){

      // Nodes and edges
      let elements = []

      // Adds all the nodes
      for (var i=0; i<inspectedNodes.length; i++) {
        try{
          var node = inspectedNodes[i]
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
                fullJSON: JSON.stringify(node)
                }
              },
          )
        }
        catch(err){
          console.log(err)
        }
      };

      // Adds all the edges
      for (var i=0; i<inspectedEdges.length; i++) {
        try{
          var edge = inspectedEdges[i]

          // Checks that our edge is between nodes in our graph
          if(inspectedNodesIDs.includes(edge['inV']) && inspectedNodesIDs.includes(edge['outV'])){
            elements.push({
              data: {
                id: edge['id'], 
                source: edge['outV'], 
                target: edge['inV'],
                fullJSON: JSON.stringify(edge),
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
          } 

        ],
      
        layout: {
          name: 'grid',
        } 
      })

      cy.minZoom(0.06)
      cy.maxZoom(3)

      

    }
  })


  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'flex-start', // if you want to fill rows left to right
    height: '100%'
  }

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
        <DialogTitle id="alert-dialog-slide-title">{"Nodes in the dataset returned from " + inspectedGremlinQuery}<img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/></DialogTitle>
        <DialogContent style={{ width: '80vw', height: '80vh' }}>
          
          <div style={containerStyle}>
            <div style={{ height: "80vh", width: '70%' }} ref={graphInspectContainer}></div>
            <div style={{ width: '30%', maxHeight: '75vh', overflow: 'auto' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum tortor interdum quam accumsan, at posuere enim imperdiet. Duis sagittis nibh in nunc imperdiet lobortis. Integer fermentum mauris quis libero blandit viverra. Praesent a aliquam massa, nec fermentum velit. Vestibulum at erat at ante pretium rhoncus sit amet ac leo. In iaculis interdum finibus. Cras efficitur nec ligula faucibus bibendum. Vivamus consectetur viverra convallis.

            Integer at nulla eget turpis pellentesque tincidunt id in est. Etiam imperdiet ornare nulla, in aliquet ligula tincidunt et. In hac habitasse platea dictumst. In ligula dui, sagittis eu mollis ac, placerat sit amet libero. Aliquam enim massa, vehicula sit amet sem eget, tempus finibus nisi. Morbi aliquet purus pharetra, maximus eros hendrerit, aliquet lacus. Pellentesque molestie pellentesque mi in sodales. In elementum lorem quis nisi volutpat rhoncus. Phasellus id mi vel augue congue eleifend ut non tellus. Maecenas faucibus mauris sit amet semper euismod. Duis nec ex placerat, lobortis sapien sit amet, iaculis elit. Integer cursus tempor orci, quis pharetra nunc dictum lacinia. Maecenas venenatis quam blandit erat rutrum sagittis. Quisque semper nisl at finibus dignissim. Donec nec justo tortor. Curabitur nisl mi, venenatis eget libero egestas, pharetra pulvinar sapien.

            Nulla a erat eget metus accumsan sodales ac in ex. Duis vulputate porta ligula, sed sollicitudin nibh. Nunc mattis enim mauris, eu pellentesque quam bibendum in. Praesent gravida mi metus, id dignissim odio venenatis ac. Nulla feugiat nunc nec purus convallis vulputate. Curabitur volutpat dapibus erat, sed imperdiet libero scelerisque id. Quisque eu sapien lacus.

            Aenean facilisis diam arcu, at vestibulum erat semper in. Suspendisse potenti. Aliquam sit amet dictum ipsum. Maecenas imperdiet luctus enim vel pellentesque. Pellentesque facilisis, tellus et tristique porttitor, ante metus blandit neque, vitae aliquam risus ipsum vitae ligula. Aenean ac massa non dui maximus feugiat. Nunc lobortis varius massa non posuere. Nulla varius, ipsum a tempus blandit, turpis ante fermentum turpis, id pulvinar sapien diam mattis sem.

            Sed tellus eros, posuere eu euismod sed, efficitur a metus. Nulla ut dapibus eros. Maecenas imperdiet venenatis finibus. Vivamus viverra eleifend sapien, sed cursus nibh tempor in. Donec fermentum urna vitae sapien consequat fermentum. Morbi ut hendrerit nulla, sed imperdiet diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam sed nisl urna.
            </div>
          </div>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}
