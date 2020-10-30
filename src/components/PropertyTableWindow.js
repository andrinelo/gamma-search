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
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { setHelpWindowActive } from '../actions/HelpWindowActions.js';
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

// Component used to create a property table
function PropertyTableWindow() {
  const classes = useStyles();
  const dispatch = useDispatch()

  // The properties that the user has selected to get in their table
  const [selectedProperties, setSelectedProperties] = useState([])

  // The gremlin query used for retrieving the data to put in the table
  let [tableGremlinQuery, setTableGremlinQuery] = useState("")

  // The current page of the table
  let [currentTablePage, setCurrentTablePage] = useState(1)
 
  // Whether or not the table should be loading
  const tableIsLoading = useSelector(store => store.propertyTableIsFetching)
  
  // The dataset we're creating a property table of
  const selectedDataset = useSelector(store => store.selectedDataset)
  
  // The gremlin query corresponding to the dataset including the dataset's filter
  const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  
  // Whether or not this modal is open
  const open = useSelector(state => state.propertyTableWindowActive)
  
  // All the possible properties in the dataset which can be included in a property table
  const possibleProperties = useSelector(state => state.allQueryResults[DATASET_PROPERTIES_AFTER_DATASET_FILTERS])
  
  // The raw format of the table row data
  const tableRowsRaw = useSelector(state => state.allQueryResults[PROPERTY_TABLE_VALUES])
  
  // The table-friendly data of the table columns and table rows
  const [tableColumns, setTableColums] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  // Components and styles used in the property multi-select field
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  // If the "Node ID" property has not already been added to the list, we add it
  if(!possibleProperties.includes("Node ID") && possibleProperties.length > 0){
    possibleProperties.unshift("Node ID")
  }

  // If the "Component Type" property has not already been added to the list, we add it
  if(!possibleProperties.includes("Component Type") && possibleProperties.length > 0){
    possibleProperties.unshift("Component Type")
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

  // Fired whenever the selected properties changes; builds the gremlin query
  const handlePropertiesSelectedChanged = (newSelectedProperties) => {
    const latestFetchID = JSON.stringify(newSelectedProperties)

    setSelectedProperties(newSelectedProperties)

    // This ID is used to identify the latest fetch (...to abort/discard unfinished out-of-date fetches)
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

        const propertyName = newSelectedProperties[i]

        if(propertyName === "Component Type"){
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
        maxWidth={false}
      >
        <div style={{ width: '73vw'}}>
          <DialogTitle id="property-table-dialog-slide-title" style={{textAlign: 'center'}}>
            {"Create property table from this dataset"}
            <HelpOutlineOutlinedIcon style={{marginBottom: '-5px', marginLeft: '5px', cursor: 'pointer'}} onClick={() => dispatch(setHelpWindowActive(true))}/>
            <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose} alt="Close window"/></DialogTitle>
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
                getOptionLabel={(option) => option}
                groupBy={(option) => option !== "Component Type" && option !== "Node ID" ? option.charAt(0).toUpperCase() : "Frequently Used"}
                            
                
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
