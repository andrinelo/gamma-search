import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import { } from '../actions/QueryKeys.js'
import { setHelpWindowActive } from '../actions/HelpWindowActions.js';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


export default function HelpWindow() {
  const dispatch = useDispatch();
  
  const open = useSelector(state => state.helpWindowActive);

  const filterMenuOpen = useSelector(state => state.filterDatasetWindowActive)
  const relationMenuOpen = useSelector(state => state.relationWindowActive)
  const aggregateMenuOpen = useSelector(state => state.aggregateDatasetWindowActive)
  const propertyTableMenuOpen = useSelector(state => state.propertyTableWindowActive)
  const inspectMenuOpen = useSelector(state => state.inspectDatasetWindowActive)
  
  const [infoDisplay, setInfoDisplay] = useState("")

  const closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};
  
  useEffect(() => {

    if(filterMenuOpen){
      setInfoDisplay(
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: "-40px"}}>
          <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
            <img style={{width: '100%'}} src={imageURL1} alt={imageURL1}></img>
          </div>
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {title1}
            </Typography>
            <Typography variant="body1">
              {textContent1}
            </Typography>
          </div>
        </div>
      )
    }

    else if(aggregateMenuOpen){
      setInfoDisplay(
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: "-40px"}}>
          <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
            <img style={{width: '100%'}} src={imageURL2} alt={imageURL2}></img>
          </div>
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {title2}
            </Typography>
            <Typography variant="body1">
              {textContent2}
            </Typography>
          </div>
        </div>
      )
    }

    else if(inspectMenuOpen){
      setInfoDisplay(
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: "-40px"}}>
          <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
            <img style={{width: '100%'}} src={imageURL3} alt={imageURL3}></img>
          </div>
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {title3}
            </Typography>
            <Typography variant="body1">
              {textContent3}
            </Typography>
          </div>
        </div>
      )
    }

    else if(propertyTableMenuOpen){
      setInfoDisplay(
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: "-20px"}}>
          <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
            <img style={{width: '100%'}} src={imageURL4} alt={imageURL4}></img>
          </div>
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {title4}
            </Typography>
            <Typography variant="body1">
              {textContent4}
            </Typography>
          </div>
        </div>
      )
    }

    else if(relationMenuOpen){
      setInfoDisplay(
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: "-40px"}}>
          <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
            <img style={{width: '100%'}} src={imageURL5} alt={imageURL5}></img>
          </div>
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {title5}
            </Typography>
            <Typography variant="body1">
              {textContent5}
            </Typography>
          </div>
        </div>
      )
    }

  //eslint-disable-next-line
  }, [open])
  

  // Closes the aggregate menu when pressing x, removes unsaved local changes
  const closeHelpMenu = () => {
    dispatch(setHelpWindowActive(false));
  };

  return (
    <Dialog 
      open={open} 
      maxWidth={false}
      TransitionComponent={Transition}
      onClose={closeHelpMenu}
    >
      
      <DialogTitle id="aggregate-dialog-slide-title" style={{textAlign: 'center'}}>{""}<img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={closeHelpMenu} alt="Close window"/></DialogTitle>
      
      <div style={{width: '50vw', margin: 'auto', marginBottom: '2vh', marginTop: '1vh', maxHeight: '95%', overflow: 'auto'}}>
        <DialogContent>
          {infoDisplay}
        </DialogContent>
      </div>

    </Dialog>
  );
}


// Content for the filter help
const title1 = "Applying filters on a dataset"
const textContent1 = "To reduce the amount of nodes in a dataset, you can try applying one or more filters. The field for selecting a property will automatically show you all the available properties to filter on, and the field for inputting a filtering-value will give you suggestions based on the existing property values for the nodes in the dataset. In addition to this, you can select what operator you want to use, you can apply as many filters as you want, and you can even logically 'and' and 'or' your filters!"
const imageURL1 = '/FilterMenuExample.png'

// Content for the aggregating help
const title2 = "Aggregating nodes in a dataset"
const textContent2 = "Aggregation is an essential tool for gaining further knowledge about the nodes in a dataset. In the aggregation menu, you can select what property in the dataset to aggregate on. The aggregation functions that are supported are 'count', 'sum', 'average', 'minimum' and 'maximum'. Be aware that if your selected property does not support numbers, you can only use 'count'."
const imageURL2 = '/AggregateMenuExample.png'

// Content for the inspect help
const title3 = "Inspecting a dataset"
const textContent3 = "The best way to get a clear understanding of your data is getting it visualized on some way. This is where inspecting a dataset is helpful. This feature allows you to examine all the nodes and interconnected edges in a dataset. By clicking on a node or an edge, you can view all its associated data in wonderful JSON-format. You can even multi-select by holding down the 'shift'-button!"
const imageURL3 = '/InspectDatasetMenuExample.png'

// Content for the property table help
const title4 = "Creating a property table"
const textContent4 = "If you want to present your data in a structured way, the 'property table' is for you. Here you can select any of the properties in the dataset, and get the nodes' values for the selected properties displayed in an elegant and easy-to-read table. You can even sort the results by clicking on your preferred property in the column header!"
const imageURL4 = '/PropertyTableMenuExample.png'

// Content for the relations helpl
const title5 = "Exploring relations"
const textContent5 = "One of the most powerful aspects of a graph database are the relations between nodes, often called 'edges'. By using the 'explore dataset's relations'-feature, you can traverse both the interconnected relations in your dataset and the relations between the nodes in your dataset and other nodes in the database. This feature will let you define both the directions and the types of relation to traverse. You can traverse multiple relations at once, and you can even logically 'and' and 'or' your traversal parameters. When the traversal is done, a brand new dataset with the resulting nodes is created and ready to be traversed again!"
const imageURL5 = '/RelationMenuExample.png'

