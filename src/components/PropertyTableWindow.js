import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { DataGrid } from '@material-ui/data-grid';

import { setPropertyTableWindowActive } from '../actions/PropertyTableWindowActions.js';
import { resetSelectedDataset } from '../actions/SelectedDatasetActions.js';

import { PROPERTY_TABLE_VALUES } from './../actions/QueryKeys.js'
import { CodeSharp } from "@material-ui/icons";
import { TableRow } from "@material-ui/core";


// Modal transition animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


function PropertyTableWindow() {
  const dispatch = useDispatch()
  const open = useSelector(state => state.propertyTableWindowActive)
  const tableRowsRaw = useSelector(state => state.allQueryResults[PROPERTY_TABLE_VALUES])
  const tableColumns = [];
  const tableRows = []
  
  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  tableRowsRaw.map(row => {
    const rowKeys = Object.keys(row)
    const modifiedRow = {}

    for(let i = 0; i < rowKeys.length; i++){
      modifiedRow[rowKeys[i]] = row[rowKeys[i]]
    }

    console.log(modifiedRow)
    tableRows.push(modifiedRow)
  })



  // Whenever the values for the rows updates
  useEffect(() => {
    if(tableRowsRaw.length > 0){

      // We update the columns
      const columnNames = Object.keys(tableRowsRaw[0])
      
      for(let i = 0; i < columnNames.length; i++){
        tableColumns.push({ field: columnNames[i], headerName: columnNames[i], width: 150 })
      }
      
    }
  }, [tableRowsRaw])

  
  
  const rows = [
    { 'id': 1, 'lastName': 'Snow', 'firstName': 'Jon', 'age': 35 },
    { 'id': 1, 'lastName': 'Snow', 'firstName': 'Jon', 'age': 35 }

  ];
  

  // Handle modal window closes
  const handleClose = () => {
    
    dispatch(setPropertyTableWindowActive(false));
    dispatch(resetSelectedDataset());
  };

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
        <div style={{ width: '60vw'}}>
          <DialogTitle id="alert-dialog-slide-title" style={{textAlign: 'center'}}>{"Create property table of this dataset"}<img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose} alt="Close window"/></DialogTitle>
        </div>

        <div style={{width: '55vw', height: '380px', margin: 'auto', marginBottom: '2vw'}}>
          <DataGrid rows={tableRows} columns={tableColumns} autoPageSize={true} disableSelectionOnClick={true} rowsPerPageOptions={[]} />
        </div>

        
      </Dialog>
    </div>
  )
}

export default PropertyTableWindow;


