import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { DATASET_PROPERTIES_AFTER_DATASET_FILTERS, RESULT_FROM_AGGREGATION, AGGREGATE_PROPERTY_EXAMPLE_VALUE } from './../actions/QueryKeys.js'
import { setHelpWindowActive } from '../actions/HelpWindowActions.js';
import { setAggregateWindowActive } from '../actions/AggregateWindowActions.js';
import { fetchQueryItems, resetQueryItems } from '../actions/QueryManagerActions.js';


// Modal slide transition animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});


// This is the modal, along with all logic, used for aggregating a dataset
export default function AggregateMenu() {
  const dispatch = useDispatch();
  
  // Used to determine if the modal is open
  const open = useSelector(state => state.aggregateDatasetWindowActive);
  
  // The result of the aggregation
  const aggregateResult = useSelector(store => store.allQueryResults[RESULT_FROM_AGGREGATION]);
  
  // An example of the value of a property; used to determine property value datatype -> sum, min, max and avg only works on numbers
  const propertyValueExample = useSelector(store => store.allQueryResults[AGGREGATE_PROPERTY_EXAMPLE_VALUE])
  const propertyDatatypeIsNumber = propertyValueExample.length > 0 ? typeof propertyValueExample[0] === 'number' : false
  
  // Possible properties to aggregate on
  const properties = useSelector(state => state.allQueryResults[DATASET_PROPERTIES_AFTER_DATASET_FILTERS])
  
  // States with chosen aggregation function, property and results-HTML.
  const [localAggregateFunction, setLocalAggregateFunction] = React.useState('');
  const [localProptype, setLocalProptype] = React.useState(null);
  const [resultHTML, setResultHTML] = React.useState(null);
  
  // Possible aggregation functions
  const aggregateFunctions = ["count", "sum", "average", "max", "min"]
  
  // Styling for the X in the modal corner
  const closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  // Which dataset we're aggregating
  const selectedDataset = useSelector(store => store.selectedDataset)
  
  // Query before aggregation
  const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
  
  // Query after aggregation
  const [currentQuery, setCurrentQuery] = React.useState();


  // Updates the result HTML whenever the result changes
  useEffect(() => {
    setResultHTML(createResultString())
  //eslint-disable-next-line
  }, [aggregateResult])


  // Whenever the selected property has been changed and we've fetched an example of the new property value
  useEffect(() => {
    const selectedProperty = localProptype
    const aggregateFunction = localAggregateFunction.toLowerCase()

    // If both property and aggregate function is selected, and the example value of the property is fetched
    if(propertyValueExample.length > 0 && selectedProperty !== "" && selectedProperty !== null 
      && selectedProperty !== undefined && aggregateFunction !== "" 
      && aggregateFunction !== null && aggregateFunction !== undefined){
        
        // If the aggregate function still is 'count', we fetch the result (all properties supports count)
        if(aggregateFunction === 'count'){
          fetchAggregateResult()
        }

        // If the aggregate function is not count, the property value datatype must be a number for us to fetch the aggregate result
        else if(typeof propertyValueExample[0] === 'number'){
          fetchAggregateResult()
        }

        // If neither is true, we reset the selected aggregate function and result
        else{
          setLocalAggregateFunction('')
          dispatch(resetQueryItems(RESULT_FROM_AGGREGATION));
        }
      }
  //eslint-disable-next-line
  }, [propertyValueExample])

  
  // Closes the aggregate menu when pressing x, removes unsaved local changes
  const closeAggregateMenu = () => {
    setLocalAggregateFunction('');
    setLocalProptype('');
    setCurrentQuery('');
    dispatch(resetQueryItems(RESULT_FROM_AGGREGATION));
    dispatch(setAggregateWindowActive(false));
  };


  // When function changes we fetch the results
  const handleFunctionChange = e => {
    fetchAggregateResult(localProptype, e.target.value.toLowerCase())
    setLocalAggregateFunction(e.target.value)
  }


  // This updates local state when a user selects a property or aggregation type, and fetches a value for the property
  const handleProptypeChange = selectedProperty => {
    setLocalProptype(selectedProperty);

    // Fetches one value for the property, to be used to determine its datatype
    fetchValueForProperty(selectedProperty)
  };


  // Fetches the result of the aggregation
  const fetchAggregateResult = (property=localProptype, aggregateFunction=localAggregateFunction.toLowerCase()) => {
    let aggregateGremlinQuery = datasetAfterFiltersGremlinQuery + ".dedup()"
    
    // Average is just a more common way to describe 'mean'
    if (aggregateFunction === "average"){
      aggregateFunction = "mean"
    }

    // Labels and IDs aggregates a bit differently
    if(property === "Component Type"){
      aggregateGremlinQuery += ".label()." + aggregateFunction + "()"
    }
    else if(property === "Node ID"){
      aggregateGremlinQuery += ".id()." + aggregateFunction + "()"
    }
    
    else{
      aggregateGremlinQuery += property !== null && property !== '' && property !== undefined ? ".values('" + property + "')." + aggregateFunction + "()" : ""
    }

    setCurrentQuery(aggregateGremlinQuery)

    // Fetches the aggregation results
    if(aggregateGremlinQuery !== ""){
      dispatch(fetchQueryItems(aggregateGremlinQuery, RESULT_FROM_AGGREGATION))
    }
  }


  // Fetches one value in the dataset for the given property; to be used to determine the datatype of the property value
  const fetchValueForProperty = (selectedProperty) => {
    if(selectedProperty !== "" && selectedProperty !== null && selectedProperty !== undefined){
      let propertyValueGremlinQuery = "g.V()"

      if(selectedProperty === "Component Type"){
        propertyValueGremlinQuery += ".label()"
      }
      else if(selectedProperty === "Node ID"){
        propertyValueGremlinQuery += ".id()"
      }
      else{
        propertyValueGremlinQuery += ".properties('" + selectedProperty +"').value()"
      }

      // We only need one value
      propertyValueGremlinQuery += ".limit(1)"
      
      // We fetch every possible value in the dataset for the selected property 
      dispatch(fetchQueryItems(propertyValueGremlinQuery, AGGREGATE_PROPERTY_EXAMPLE_VALUE))
    }
  }


  // Creates the string in english that explains and gives the result of the aggregation
  const createResultString = () => {
    const aggregateFunction = localAggregateFunction.toLowerCase()

    // If the result is invalid we return null
    if(aggregateResult.length === 0){
      return null
    }

    let resultString = ""

    if(aggregateFunction !== 'count'){
      resultString += "The " + aggregateFunction
      
      if(aggregateFunction === 'max' || aggregateFunction === 'min'){
        resultString += "imum value of '" + localProptype + "'"
      }

      else{
        resultString += " of the '" + localProptype + "'-values"
      }

      resultString += " in this dataset is "
    }

    else {
      resultString += "The number of nodes with the property '" + localProptype + "' in this dataset is "
    }

    return <h4 style={{textAlign: "center"}}>{resultString}<u><i>{aggregateResult[0]}</i></u>.</h4>
  }

  return (
    <Dialog 
      open={open} 
      maxWidth={false}
      TransitionComponent={Transition}
      onClose={closeAggregateMenu}
    >
      
      <DialogTitle id="aggregate-dialog-slide-title" style={{textAlign: 'center'}}>
        {"Aggregate this dataset"}
        <HelpOutlineOutlinedIcon style={{marginBottom: '-5px', marginLeft: '5px', cursor: 'pointer'}} onClick={() => dispatch(setHelpWindowActive(true))}/>
        <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={closeAggregateMenu} alt="Close window"/></DialogTitle>
      
      <div style={{width: '40vw', margin: 'auto', marginBottom: '2vh', marginTop: '1vh', maxHeight: '95%', overflow: 'auto'}}>
        <DialogContent>
          
          <div style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "100%"}}>

            {/* The property selection field */}
            <Autocomplete
              width="40%"
              name="property"
              options={properties}
              value={localProptype !== "" && localProptype !== undefined ? localProptype : null }
              getOptionLabel={(option) => option}
              groupBy={(option) => option !== "Component Type" && option !== "Node ID" ? option.charAt(0).toUpperCase() : "Frequently Used"}
              style={{ width: '250px' }}
              onChange={(event, selectedProperty) => {
                handleProptypeChange(selectedProperty)
              }}
                      
              renderInput={(params) => <TextField {...params} label="Select property" variant="outlined" />}

              renderOption={(option, { inputValue }) => {
                const matches = match(option, inputValue);
                const parts = parse(option, matches);
        
                return (
                  <div>
                    {parts.map((part, index) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                  </div>
                );
              }}

            />

            <div style={{width: "1vw"}}/>
            
            {/* The aggregation function selection field */}
            <FormControl style={{width: "42%"}} variant="outlined">
              <InputLabel id="aggregate-function-select-label">Select aggregation</InputLabel>
              <Select
                labelId="aggregate-function-select-label"
                id="aggregateFunction"
                onChange={handleFunctionChange}
                label="Select aggregation"
                value={localAggregateFunction}
                disabled={localProptype === null || localProptype === '' || localProptype === undefined}
              >
                {aggregateFunctions.map((value,key) => (value === "count" || propertyDatatypeIsNumber) && <MenuItem key={key} value={value.toUpperCase()}>{value.toUpperCase()}</MenuItem>)}
              </Select>
            </FormControl>

          </div>

          {aggregateResult.length > 0 &&
            <div>
              <div>
                { resultHTML }
              </div>
              <div>
                <p style={{wordBreak: 'break-all', textAlign: 'center', fontSize: 'small'}}><b>Aggregation result generated from gremlin query</b><br/><i>{currentQuery}</i></p>
              </div>
            </div>
          }

        </DialogContent>
      </div>

    </Dialog>
  );
}