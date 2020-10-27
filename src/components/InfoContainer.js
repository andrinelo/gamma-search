import React, { useState } from "react";
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import VizSensor from 'react-visibility-sensor';

function InfoContainer() {

  // Content for the first information row
  const titleRow1 = "The graph database defined"
  const textContentRow1 = "Graph databases are purpose-built to store and navigate relationships. Relationships are first-class citizens in graph databases, and most of the value of graph databases is derived from these relationships. Graph databases use nodes to store data entities, and edges to store relationships between entities. An edge always has a start node, end node, type, and direction, and an edge can describe parent-child relationships, actions, ownership, and the like. There is no limit to the number and kind of relationships a node can have."
  const imageURLRow1 = '/NetworkIllustration2.jpg'

  // Content for the second information row
  const titleRow2 = "The features of the query builder"
  const textContentRow2 = "The first sight that meets you in this query builder is a dataset containing all the nodes in the database. This query builder lets you define filters on the dataset, make aggregations on the dataset, inspect the nodes and edges in the dataset by presenting them in a beautiful graph view, create tables consisting of the node properties you're interested in, and create brand new datasets by exploring a dataset's relations."
  const imageURLRow2 = '/QueryBuilderContextMenuTutorial.gif'

  // Content for the third information row
  const titleRow3 = "Applying filters on a dataset"
  const textContentRow3 = "To reduce the amount of nodes in a dataset, you can try applying one or more filters. The field for selecting a property will automatically show you all the available properties to filter on, and the field for inputting a filtering-value will give you suggestions based on the existing property values for the nodes in the dataset. In addition to this, you can select what operator you want to use, you can apply as many filters as you want, and you can even logically 'and' and 'or' your filters!"
  const imageURLRow3 = '/FilterMenuExample.png'

  // Content for the fourth information row
  const titleRow4 = "Aggregating nodes in a dataset"
  const textContentRow4 = "Aggregation is an essential tool for gaining further knowledge about the nodes in a dataset. In the aggregation menu, you can select what property in the dataset to aggregate on. The aggregation functions that are supported are 'count', 'sum', 'mean', 'minimum' and 'maximum'. Be aware that if your selected property does not support numbers, you can only use 'count'."
  const imageURLRow4 = '/AggregateMenuExample.png'

  // Content for the fifth information row
  const titleRow5 = "Inspecting a dataset"
  const textContentRow5 = "The best way to get a clear understanding of your data is getting it visualized on some way. This is where inspecting a dataset is helpful. This feature allows you to examine all the nodes and interconnected edges in a dataset. By clicking on a node or an edge, you can view all its associated data in wonderful JSON-format. You can even multi-select by holding down the 'shift'-button!"
  const imageURLRow5 = '/InspectDatasetMenuExample.png'

  // Content for the sixth information row
  const titleRow6 = "Creating a property table"
  const textContentRow6 = "If you want to present your data in a structured way, the 'property table' is for you. Here you can select any of the properties in the dataset, and get the nodes' values for the selected properties displayed in an elegant and easy-to-read table. You can even sort the results by clicking on your preferred property in the column header!"
  const imageURLRow6 = '/PropertyTableMenuExample.png'


  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '77%', margin: 'auto', marginBottom: "40px"}}>
      <InfoRow imageURL={imageURLRow1} title={titleRow1} textContent={textContentRow1} imageLeftAligned={true}/>
      <InfoRow imageURL={imageURLRow2} title={titleRow2} textContent={textContentRow2} imageLeftAligned={false}/>
      <InfoRow imageURL={imageURLRow3} title={titleRow3} textContent={textContentRow3} imageLeftAligned={true}/>
      <InfoRow imageURL={imageURLRow4} title={titleRow4} textContent={textContentRow4} imageLeftAligned={false}/>
      <InfoRow imageURL={imageURLRow5} title={titleRow5} textContent={textContentRow5} imageLeftAligned={true}/>
      <InfoRow imageURL={imageURLRow6} title={titleRow6} textContent={textContentRow6} imageLeftAligned={false}/>

    </div>
  )
  
}


function InfoRow(props){

  const [checked, setChecked] = useState(false)

  return (

    <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginBottom: "20px"}}>
      
      {props.imageLeftAligned &&
        <VizSensor
          partialVisibility={'bottom'}
          onChange={(isVisible) => {
              setChecked(isVisible);
          }}
        >
          <Fade 
            in={checked} timeout={1000}
          >
            <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
              <img style={{width: '100%'}} src={props.imageURL} alt={props.imageURL}></img>
            </div>
          </Fade>
        
        </VizSensor>
      }

      <VizSensor
        partialVisibility={'bottom'}
        onChange={(isVisible) => {
            setChecked(isVisible);
        }}
      >
        <Fade 
          in={checked} timeout={1000}
        >
          <div style={{width: '50%', textAlign: "center", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
            <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
              {props.title}
            </Typography>
            <Typography variant="body1">
              {props.textContent}
            </Typography>
          </div>
        </Fade>
      
      </VizSensor>


      {!props.imageLeftAligned &&
        <VizSensor
          partialVisibility={'bottom'}
          onChange={(isVisible) => {
              setChecked(isVisible);
          }}
        >
          <Fade 
            in={checked} timeout={1000}
          >
            <div style={{ width: '50%', display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
              <img style={{width: '100%'}} src={props.imageURL} alt={props.imageURL}></img>
            </div>
          </Fade>
        
        </VizSensor>
      }

    </div>
  )
}


export default InfoContainer;
