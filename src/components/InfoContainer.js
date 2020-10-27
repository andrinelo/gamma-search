import React, { useState } from "react";
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import VizSensor from 'react-visibility-sensor';

function InfoContainer() {

  const [checked, setChecked] = useState(false)

  return (

    <div style={{display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto'}}>
      <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
        
        <VizSensor
          onChange={(isVisible) => {
              setChecked(isVisible);
          }}
        >
          <Fade 
            in={checked} timeout={1000}
            style={{ transformOrigin: '0 0 0' }}
            {...(checked ? { timeout: 1000 } : {})}
          >
            <div style={{ width: '50%' }}>
              <img style={{width: '100%'}} src={'/NetworkIllustration2.jpg'} alt={'Network / Graph database'}></img>
            </div>
          </Fade>
        
        </VizSensor>

        <VizSensor
          onChange={(isVisible) => {
              setChecked(isVisible);
          }}
        >
          <Fade 
            in={checked} timeout={1000}
            style={{ transformOrigin: '0 0 0' }}
            {...(checked ? { timeout: 1000 } : {})}
          >
            <div style={{width: '50%', textAlign: 'center'}}>
              <Typography variant="h5" style={{marginBottom: '5px', marginTop: '15px'}}>
                The graph database defined
              </Typography>
              <Typography variant="body1">
                Graph databases are purpose-built to store and navigate relationships. Relationships are first-class citizens in graph databases, and most of the value of graph databases is derived from these relationships. Graph databases use nodes to store data entities, and edges to store relationships between entities. An edge always has a start node, end node, type, and direction, and an edge can describe parent-child relationships, actions, ownership, and the like. There is no limit to the number and kind of relationships a node can have.
              </Typography>
            </div>
          </Fade>
        
        </VizSensor>

      </div>
    </div>
  )
}

export default InfoContainer;
