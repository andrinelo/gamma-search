import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { DataGrid } from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { setPropertyTableWindowActive, setPropertyTableIsFetching, setPropertyTableFetchID } from '../actions/PropertyTableWindowActions.js';
import { resetSelectedDataset } from '../actions/SelectedDatasetActions.js';
import { fetchQueryItems, resetQueryItems } from '../actions/QueryManagerActions.js';

import { DATASET_PROPERTIES_AFTER_DATASET_FILTERS, PROPERTY_TABLE_VALUES } from './../actions/QueryKeys.js'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '60%',
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
    margin: 'auto', 
  },
}));

// Modal transition animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


function PropertyTableWindow() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [selectedProperties, setSelectedProperties] = useState([])
  let [tableGremlinQuery, setTableGremlinQuery] = useState("")
  let [currentTablePage, setCurrentTablePage] = useState(1)
  //let [currentSortModel, setCurrentSortModel] = useState([])
 
  const tableIsLoading = useSelector(store => store.propertyTableIsFetching)
  const selectedDataset = useSelector(store => store.selectedDataset)
  const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  const open = useSelector(state => state.propertyTableWindowActive)
  const possibleProperties = useSelector(state => state.allQueryResults[DATASET_PROPERTIES_AFTER_DATASET_FILTERS])
  const tableRowsRaw = useSelector(state => state.allQueryResults[PROPERTY_TABLE_VALUES])
  const [tableColumns, setTableColums] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  // If the "Node ID" property has not already been added to the list, we add it
  if(!possibleProperties.includes("Node ID") && possibleProperties.length > 0){
    possibleProperties.unshift("Node ID")
  }

  // If the "Label / Type" property has not already been added to the list, we add it
  if(!possibleProperties.includes("Label / Type") && possibleProperties.length > 0){
    possibleProperties.unshift("Label / Type")
  }
  
  // Whenever the raw tablerows-data updates, we process it into something more usable by the table
  useEffect(() => {
    const newTableRows = []

    for(let i = 0; i < tableRowsRaw.length; i++) {
      const row = tableRowsRaw[i]
      const rowKeys = Object.keys(row)
      const modifiedRow = {id: i}
  
      for(let j = 0; j < rowKeys.length; j++){
        
        // Most fields are lists with only one value; we only want the value, not the list (lists are not sortable)
        if(typeof row[rowKeys[j]] === 'object' && row[rowKeys[j]].length > 0){
          modifiedRow[rowKeys[j]] = row[rowKeys[j]][0]
        }
  
        // Field is an empty list, and we therefore set the value to null instead
        else if(typeof row[rowKeys[j]] === 'object' && row[rowKeys[j]].length === 0){
          modifiedRow[rowKeys[j]] = null
        }
  
        // Field is already a non-list value (string or number)
        else{
          modifiedRow[rowKeys[j]] = row[rowKeys[j]]
        }
      }
  
      newTableRows.push(modifiedRow)
    }

    setTableRows([...newTableRows])
  
  }, [tableRowsRaw])


  // Whenever the values for the rows updates, we also update the columns
  useEffect(() => {
    const newTableColumns = []

    newTableColumns.push({ field: 'id', hide: true })

    if(tableRowsRaw.length > 0){
      const columnNames = Object.keys(tableRowsRaw[0])
      
      for(let i = 0; i < columnNames.length; i++){
        newTableColumns.push({ field: columnNames[i], headerName: columnNames[i], width: 150 })
      }
    }

    setTableColums([...newTableColumns])

  }, [tableRowsRaw])
  

  // Handle modal window closes
  const handleClose = () => {
    setSelectedProperties([])
    setCurrentTablePage(1)
    dispatch(setPropertyTableWindowActive(false));
    dispatch(resetSelectedDataset());
    dispatch(setPropertyTableFetchID(""))
    dispatch(setPropertyTableIsFetching(false))
    dispatch(resetQueryItems(PROPERTY_TABLE_VALUES))
  };


  const handlePropertiesSelectedChanged = (newSelectedProperties) => {
    const latestFetchID = JSON.stringify(newSelectedProperties)

    setSelectedProperties(newSelectedProperties)

    // This ID is used to identify the latest fetch (...to abort/discard out-of-date fetches)
    dispatch(setPropertyTableFetchID(latestFetchID))

    if(newSelectedProperties.length > 0){

      // Builds the gremlin query 

      let gremlinQuery = datasetAfterFiltersGremlinQuery

      gremlinQuery += ".dedup().project("

      for(let i = 0; i < newSelectedProperties.length; i++){

        // Properties in the database follow different type of naming standards;
        // some use camelcase, some use '-', and some use '_'. This line converts
        // all standards to space-seperated uppercase strings. 
        const propertyName = newSelectedProperties[i].replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1").replace(/-/g, " ").replace(/_/g, " ").replace(/  +/g, " ").trim().toUpperCase()
        gremlinQuery += "'" + propertyName + "', "
      }

      gremlinQuery = gremlinQuery.slice(0, -2)
      gremlinQuery += ")"

      for(let i = 0; i < newSelectedProperties.length; i++){

        // Properties in the database follow different type of naming standards;
        // some use camelcase, some use '-', and some use '_'. This line converts
        // all standards to space-seperated uppercase strings. 
        const propertyName = newSelectedProperties[i]

        if(propertyName === "Label / Type"){
          gremlinQuery += ".by(label)"
        }

        else if(propertyName === "Node ID"){
          gremlinQuery += ".by(id)"
        }

        else{
          gremlinQuery += ".by(values('" + propertyName + "').fold())"
        }
      }

      // Sets the gremlin query in state, and fetches the new table values
      setTableGremlinQuery(gremlinQuery)
      dispatch(fetchQueryItems(gremlinQuery, PROPERTY_TABLE_VALUES, 0, latestFetchID))
    }

    // If no property is selected we empty the table values
    else{
      dispatch(setPropertyTableIsFetching(false))
      dispatch(resetQueryItems(PROPERTY_TABLE_VALUES))
    }

  }


  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="property-table-dialog-slide-title"
        //aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
      >
        <div style={{ width: '73vw'}}>
          <DialogTitle id="property-table-dialog-slide-title" style={{textAlign: 'center'}}>{"Create property table from this dataset"}<img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose} alt="Close window"/></DialogTitle>
        </div>

        <div style={{ maxHeight: '97%', overflow: 'auto' }}>

          <div style={{width: '73vw', margin: 'auto', marginBottom: '2vh', marginTop: '1vh'}}>

            <div className={classes.root}>
              <Autocomplete
                multiple
                id="property-table-autocomplete"
                fullWidth
                value={selectedProperties}
                limitTags={3}
                options={possibleProperties}
                //disableCloseOnSelect
                getOptionLabel={(option) => option}
                groupBy={(option) => option !== "Label / Type" && option !== "Node ID" ? option.charAt(0).toUpperCase() : ""}
                            
                
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Select properties" placeholder="Properties" />
                )}

                renderOption={(option, { inputValue, selected }) => {
                  const matches = match(option, inputValue);
                  const parts = parse(option, matches);
          
                  return (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                          {part.text}
                        </span>
                      ))}
                    </React.Fragment>
                  );
                }}

                onChange={(event, newSelectedProperties) => handlePropertiesSelectedChanged(newSelectedProperties)}

              />
            </div>
          </div>

          {/* Some bug causes the site to crash if closing the modal window 
          when the table contains more elements than its width can fit.
          Quick fix is making the table dependant on the window being open.
          Replaces the table with an empty div to prevent the height of the
          dialog to suddenly change. */}
          {open ? 
            <div style={{width: '68vw', height: '380px', margin: 'auto', marginBottom: '0vw'}}>
              <DataGrid rows={tableRows} columns={tableColumns} loading={tableIsLoading} pageSize={5} disableSelectionOnClick={true} rowsPerPageOptions={[]} page={currentTablePage} onPageChange={(params) => setCurrentTablePage(params.page)} onSortModelChange={() => setCurrentTablePage(1)} />
            </div>

            : <div style={{width: '68vw', height: '380px', margin: 'auto', marginBottom: '0vw'}} />
          }

          {tableRows.length > 0 ?
            <div style={{maxWidth: '55vw', margin: 'auto'}}>
              <p style={{wordBreak: 'break-all', textAlign: 'center', fontSize: 'small'}}><b>Table generated from gremlin query</b><br/><i>{tableGremlinQuery}</i></p>
            </div>

            : <div style={{height: '2vh'}}/>
          }

        </div>
        
      </Dialog>
    </div>
  )
}

export default PropertyTableWindow;
