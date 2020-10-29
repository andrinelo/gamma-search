import React, { useState, useEffect } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import {setFilter, removeLaterFilters} from "../actions/SetFilter.js";
import { ContactSupportOutlined, DeleteForever } from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import EmptyIcon from "./EmptyIcon.js";
import Select from "@material-ui/core/Select";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { setFilterWindowActive } from '../actions/FilterDatasetActions.js';
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { resetGremlinQuery, appendToGremlinQuery, removeGremlinQueryStepsAfterIndex, setGremlinQueryStep} from "../actions/GremlinQueryActions.js";
import EditWarning from './EditWarning.js'
import { DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS } from './../actions/QueryKeys.js'
import { fetchQueryItems, deleteQueryItemsByKeys } from './../actions/QueryManagerActions.js';
import {removeLaterRelaions} from "../actions/SetRelation.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const operators = {
  "==": "=",
  "!=": "≠",
  ">=": "≥",
  ">": ">",
  "<": "<",
  "=<": "≤",
};

function FilterMenu(props) {
  const allResults = useSelector(state => state.allQueryResults)
  const open = useSelector(state => state.filterDatasetWindowActive)
  const selectedDataset = useSelector(state => state.selectedDataset)  
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)
  const stateFilters = useSelector((state) => state.filters);
  const dispatch = useDispatch()
  const classes = useStyles();
  
  // The following two values are only used to force a component re-render when the autocomplete-values for the selected property are retrieved
  const [latestSelectedProperty, setLatestSelectedProperty] = useState("")
  const latestPropertyValues = useSelector(state => latestSelectedProperty !== "" ? state.allQueryResults[DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS + latestSelectedProperty] : [])
  
  // Gremlin query corresponding to the gremlin query for the selected dataset, ignoring any filters on this particular dataset
  let datasetBeforeFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, 1 + selectedDataset * 2).join(""))

  // Fetches all possible labels, to be used as auto-suggestions
  const allProperties = useSelector(state => state.allQueryResults[DATASET_PROPERTIES_BEFORE_DATASET_FILTERS])
  
  
  // Initializing menu
  const [localFilters, setLocalFilters] = useState([
    {
      property: "Label / Type",
      operator: "==",
      value: "",
    },
  ], [selectedDataset]);
  
  const [andOrs, setAndOrs] = useState([], [selectedDataset]);


  let [shouldSetFiltersFromStore, setshouldSetFiltersFromStore] = useState(true)

  // If the "Node ID" item has not already been added to the list, we add it
  if(!allProperties.includes("Node ID") && allProperties.length > 0){
    allProperties.unshift("Node ID")
  }

  // If the "Label / Type" item has not already been added to the list, we add it
  if(!allProperties.includes("Label / Type") && allProperties.length > 0){
    allProperties.unshift("Label / Type")
  }


  useEffect(() => {
    
    // If the filter window is open and we have set the 'set filters from store' flag, we set the filters from store
    if(shouldSetFiltersFromStore && open){
      let id = selectedDataset;
      if (stateFilters[id] && stateFilters[id].filters !== undefined && stateFilters[id].filters.length > 0) {
        let tmpFilters = stateFilters[id].filters;
        setLocalFilters([...tmpFilters]);

        let tmpAndOrs = stateFilters[id].andOrs
        setAndOrs([...tmpAndOrs]);
      
        // Fetches possible values for the properties that was stored in redux
        for(let i = 0; i < tmpFilters.length; i++){
          fetchValuesForProperty(tmpFilters[i].property)
        }
      }

      else{
        // Label is the default value of the first filter line
        setLocalFilters([
          {
            property: "Label / Type",
            operator: "==",
            value: "",
          },
        ]);
        setAndOrs([]);

        // Fetches autocomplete values for the labels
        fetchValuesForProperty("Label / Type")
        setLatestSelectedProperty("Label / Type")
      }

      setshouldSetFiltersFromStore(false)
    }
  }, [stateFilters, props, selectedDataset, allResults]);


  // Deletes (from Redux-store) the values that has been fetched for different properties
  const deleteFetchedPropertyValues = () => {
    let keys = Object.keys(allResults)
    keys = keys.filter(key => key.includes(DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS))

    dispatch(deleteQueryItemsByKeys(keys))    
  }

  const fetchValuesForProperty = (selectedProperty) => {
    if(selectedProperty !== "Node ID" && selectedProperty !== "" && selectedProperty !== null && selectedProperty !== undefined){
      let propertyValuesGremlinQuery = datasetBeforeFiltersGremlinQuery

      if(selectedProperty === "Label / Type"){
        propertyValuesGremlinQuery += ".dedup().label().dedup()"
      }
      else{
        propertyValuesGremlinQuery += ".dedup().properties('" + selectedProperty +"').value().dedup()"
      }
      
      // We fetch every possible value in the dataset for the selected property 
      dispatch(fetchQueryItems(propertyValuesGremlinQuery, DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS + selectedProperty, 0))
    }
  }

  const handlePropertyChange = (index, selectedProperty) => {
    if(selectedProperty === null || selectedProperty === undefined){
      selectedProperty = ""
    }

    fetchValuesForProperty(selectedProperty)
    
    localFilters[index]['property'] = selectedProperty;
    localFilters[index]['value'] = "";

    // If the chosen property is label or node id, and the chosen operator is neither "equals" nor "not equals", 
    // we reset the operator because label and node id only allow "equals" and "not equals"
    if((selectedProperty === "Label / Type" || selectedProperty === "Node ID") 
      && localFilters[index]['operator'] !== "==" && localFilters[index]['operator'] !== "!="){
      
        localFilters[index]['operator'] = "=="
    }

    setLatestSelectedProperty(selectedProperty)
    setLocalFilters([...localFilters]);
  };

  const handleOperatorChange = (index, event) => {
    localFilters[index]['operator'] = event.target.value;
    setLocalFilters([...localFilters]);
  };

  const handleAndOrChange = (index, event) => {
    andOrs[index] = event.target.value;
    setAndOrs([...andOrs]);
  }

  const handleValueChange = (index, selectedValue) => {
    if(selectedValue === null){
      selectedValue = ""
    }

    localFilters[index]['value'] = selectedValue;
    setLocalFilters([...localFilters]);
  };

  // Adds filter to component local storage
  const addFilter = () => {

    // If this is not the first filter line we have no default property, and we have default AND between the lines
    if(localFilters.length > 0){
      localFilters.push({
        property: "",
        operator: "==",
        value: "",
      });
      
      andOrs.push(
        "AND"
      )
      setAndOrs([...andOrs]);
    }

    // If this is the first filter line we set label / type by default
    else {
      localFilters.push({
        property: "Label / Type",
        operator: "==",
        value: "",
      });

      // Fetches autocomplete values for the labels
      fetchValuesForProperty("Label / Type")
      setLatestSelectedProperty("Label / Type")
    }

    setLocalFilters([...localFilters]);

  };

  const updateFilter = (filters, cloudId, andOrs) => {
    dispatch(setFilter({ filters }, {andOrs}, cloudId));
    dispatch(removeLaterFilters(cloudId))
    dispatch(removeLaterRelaions(cloudId-1))
    //dispatch(SetFilter({ filters }, cloudId));
  };

  // run when cross is pressed. Closes the menu without saving to redux
  const handleClose = () => {
    deleteFetchedPropertyValues()
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());
    setshouldSetFiltersFromStore(true)
  };

  const localFiltersToGremlinParser = () => {

    // If no filters have been set
    if(localFilters.length === 0){
      return ""
    }

    let gremlinFilterList = []

    for (let id in localFilters){
      let tmpQuery = ""

      let filterProperty = localFilters[id].property

      // Labels aren't defined as a property and requires a different kind of query
      if(filterProperty === "Label / Type"){
        if(localFilters[id].operator === "!="){
          tmpQuery = tmpQuery.concat("not(")  
          tmpQuery = tmpQuery.concat("hasLabel('")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("'))")
        }
        else {
          tmpQuery = tmpQuery.concat("hasLabel('")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("')")
        }
      }

      // ID's aren't defined as a property and requires a different kind of query
      else if (filterProperty === "Node ID"){
        if(localFilters[id].operator === "!="){
          tmpQuery = tmpQuery.concat("not(")  
          tmpQuery = tmpQuery.concat("hasId('")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("'))")
        }
        else {
          tmpQuery = tmpQuery.concat("hasId('")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("')")
        }
      }
      
      else{
        tmpQuery = tmpQuery.concat("has('")
        tmpQuery = tmpQuery.concat(filterProperty)
        tmpQuery = tmpQuery.concat("', ")

        switch(localFilters[id].operator){
          
          case "==":
            tmpQuery = tmpQuery.concat("eq")
            break;
          case "<":
            tmpQuery = tmpQuery.concat("lt")
            break;
          case ">":
            tmpQuery = tmpQuery.concat("gt")
            break
          case ">=": 
            tmpQuery = tmpQuery.concat("gte")
            break
          case "<=": 
            tmpQuery = tmpQuery.concat("lte")
            break
          case "!=": 
            tmpQuery = tmpQuery.concat("neq")
            break;
          default:
            break;
        }

        const existingPropertyValues = allResults[DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS + filterProperty]

        // Value is a number (because the property's first value is a number)
        if(existingPropertyValues !== undefined && existingPropertyValues.length > 0 && typeof existingPropertyValues[0] === 'number'){
          
          // Removes all whitespace from the string
          localFilters[id].value = localFilters[id].value.replace(/\s/g,'').replace(",", ".")

          tmpQuery = tmpQuery.concat("(")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("))")
        }

        // Value is a string
        else{
          tmpQuery = tmpQuery.concat("('")
          tmpQuery = tmpQuery.concat(localFilters[id].value)
          tmpQuery = tmpQuery.concat("'))")
        }
        
      }
      gremlinFilterList.push(tmpQuery);
    }


    //joins ands
    let index = 0
    for (let i = 0; i<andOrs.length; i++){
      let tmpAndGremlin = ""
      if (andOrs[i] === "AND"){
        let counter = 0
        for (let j = i; j<andOrs.length; j++){
          if (andOrs[j] === "AND"){
            counter += 1;
          }
          else{
            break
          }
        }
        tmpAndGremlin = tmpAndGremlin.concat("and(")
        tmpAndGremlin = tmpAndGremlin.concat(gremlinFilterList[index])
        tmpAndGremlin = tmpAndGremlin.concat(", ")
        for (let k = 0; k<counter; k++){
          tmpAndGremlin = tmpAndGremlin.concat(gremlinFilterList[index+k+1])
          if (k !== counter-1){
            tmpAndGremlin = tmpAndGremlin.concat(", ")
          }
        }
        tmpAndGremlin = tmpAndGremlin.concat(")")
        i += counter-1

        gremlinFilterList.splice(index, counter+1, tmpAndGremlin)
      }
      else{
        index += 1;
      }
    }

    let andOrGremlinQuery = ""

    //joins ors
    if (andOrs.includes("OR")){
      andOrGremlinQuery = andOrGremlinQuery.concat(".or(")
      for (let localIndex in gremlinFilterList){
        andOrGremlinQuery = andOrGremlinQuery.concat(gremlinFilterList[localIndex])
        if (localIndex != gremlinFilterList.length -1){
          andOrGremlinQuery = andOrGremlinQuery.concat(", ")
        }
      }
      andOrGremlinQuery = andOrGremlinQuery.concat(")")
    }
    else {
      andOrGremlinQuery = andOrGremlinQuery.concat(".")
      andOrGremlinQuery = andOrGremlinQuery.concat(gremlinFilterList[0])
    }

    // Updates the localfilters-state
    setLocalFilters([...localFilters]);

    return(andOrGremlinQuery)
  }

  // Runs when filters are saved
  const closeFilterMenu = () => {
    
    //updates and removes the 'filters' in Redux that is 'after' the index of this filter
    //TODO: split this action in "updateFilter" and "removeFilterAfterIndex"
    //so that RelationMenu can call "removeFilterAfterIndex"
    updateFilter(localFilters, selectedDataset, andOrs);
    let localIndex = (selectedDataset * 2) + 1
    
    let localGremlinQuery = localFiltersToGremlinParser()
    dispatch(setGremlinQueryStep(localGremlinQuery, localIndex))
    
    // This code removes all queries after this filter
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)))
    dispatch(appendToGremlinQuery(localGremlinQuery))
    
    setshouldSetFiltersFromStore(true)
    
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());
    
    // Deletes the autocomplete values for the selected properties
    deleteFetchedPropertyValues()
  };

  // Removes filter from component local storage
  const removeFilter = (index) => {
    localFilters.splice(index, 1);
    setLocalFilters([...localFilters]);
    if (index >= 1){
      andOrs.splice(index-1, 1)
    }
    else{
      andOrs.splice(index, 1)
    }
    setAndOrs([...andOrs])
  };

  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  // checks whether all filter lines has its fields filled
  // if not if should not be possible to add another filter
  // or apply filters at all
  const filterlineIsNotFilled = () => {
    // const notFilled = (filterLine) => (filterLine.property === "" || filterLine.vlauer === "")
    // return localFilters.some(notFilled);

    for(let i = 0; i < localFilters.length; i++){
      if(localFilters[i]['property'] === "" || localFilters[i]['value'] === ""){
        return true
      } 
    }

    return false
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        //keepMounted
        onClose={handleClose}
        aria-labelledby="filter-menu-dialog-slide-title"
        //aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
      >
        <DialogTitle id="filter-menu-dialog-slide-title" style={{textAlign: 'center'}}>
          {"Filter this dataset"}
          <img alt="Close window" src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/>
        </DialogTitle>
          
        <DialogContent style={{ maxWidth: '80vw', maxHeight: '80vh', minWidth: '30vw' }}>
          <div className={classes.cardContainer}>
            <div>
              <FormGroup>
                {localFilters.map((element, index) => {
                  return (
                    <div key={index}>
                      <div className={classes.flexRow}>
                        <div className={classes.flexColumn}>
                 
                          <Autocomplete
                            name="property"
                            options={allProperties}
                            value={localFilters[index].property !== undefined && localFilters[index].property !== "" ? localFilters[index].property : null }
                            getOptionLabel={(option) => option}
                            groupBy={(option) => option !== "Label / Type" && option !== "Node ID" ? option.charAt(0).toUpperCase() : ""}
                            style={{ width: '250px' }}
                            onChange={(event, selectedProperty) => {
                              handlePropertyChange(index, selectedProperty)
                            }}
                            
                            renderInput={(params) => <TextField className={classes.textFieldClass} {...params} label="Filter by..." variant="outlined" />}

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

 
                        </div>
                        <div className={classes.operatorButtonContainer}>
                          <FormControl style={{ width: "36px" }}>
                            <Select
                              className={classes.fixPadding}
                              onChange={(e) => handleOperatorChange(index, e)}
                              variant="outlined"
                              value={localFilters[index].operator}
                              IconComponent={() => <EmptyIcon />}
                              >
                              <MenuItem value="==" name="operator">
                                {`=`}
                              </MenuItem>
                              <MenuItem value="!=" name="operator">
                                {`≠`}
                              </MenuItem>
                              
                              {localFilters[index].property !== "Label / Type" &&
                                localFilters[index].property !== "Node ID" &&
                                <MenuItem value=">=" name="operator">
                                  {`≥`}
                                </MenuItem>
                              }

                              {localFilters[index].property !== "Label / Type" &&
                                localFilters[index].property !== "Node ID" &&
                                <MenuItem value=">" name="operator">
                                  {`>`}
                                </MenuItem>
                              }

                              {localFilters[index].property !== "Label / Type" &&
                                localFilters[index].property !== "Node ID" &&
                                <MenuItem value="<" name="operator">
                                  {`<`}
                                </MenuItem>
                              }

                              {localFilters[index].property !== "Label / Type" &&
                                localFilters[index].property !== "Node ID" &&  
                                <MenuItem value="=<" name="operator">
                                  {`≤`}
                                </MenuItem>
                              }  
                              
                            </Select>
                          </FormControl>
                        </div>
                        <div className={classes.flexColumn}>


                          {/* <TextField
                            className={classes.textFieldClass}
                            value={element.value}
                            name="value"
                            variant="outlined"
                            label="Value"
                            onChange={(e) => handleValueChange(index, e)}
                            >
                            {" "}
                          </TextField> */}

                          {/* Autocomplete with list of options, and the option to enter own value */}
                          <Autocomplete
                            freeSolo={localFilters[index].property !== "Label / Type"}
                            name="value"
                            options={allResults[DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS + localFilters[index]['property']] === undefined ? [] : allResults[DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS + localFilters[index]['property']]}
                            defaultValue={localFilters[index].value !== undefined && localFilters[index].value !== "" ? localFilters[index].value : null}
                            inputValue={localFilters[index].value !== undefined && localFilters[index].value !== "" ? localFilters[index].value : ""}
                            getOptionLabel={(option) => "" + option}
                            groupBy={(option) => isNaN(option) ? option.charAt(0).toUpperCase() : "Numbers"}
                            style={{ width: '250px' }}
                            onInputChange={(event, selectedValue) => {
                              handleValueChange(index, selectedValue)
                            }}
                            
                            renderInput={(params) => <TextField name="value" className={classes.textFieldClass} {...params} label="Value..." variant="outlined" />}

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

                        </div>

                        <div className={classes.removeButtonContainer}>
                          <Button
                            size="small"
                            onClick={() => removeFilter(index)}
                            >
                            <DeleteForever></DeleteForever>
                          </Button>
                        </div>
                      </div>
                      {/* if the index of this row of filters is not the last, make an and/or button after the row
                      This only adds and/or buttons in between rows and not at the end*/}
                      {index+1 !== localFilters.length ? 
                      <div className={classes.container}>
                        <div className={andOrs[index] === "AND" ? classes.borderAND: classes.borderOR} />
                        <span className={classes.content}>

                        <FormControl >
                          <Select className={classes.withLine}
                            style={{  height: "15px" }}
                            className={classes.andOrButton}
                            onChange={(e) => handleAndOrChange(index, e)}
                            //variant="outlined"
                            value={andOrs[index]}
                            //IconComponent={() => <EmptyIcon />}
                            >
                            <MenuItem value="AND">
                              {`AND`}
                            </MenuItem>
                            <MenuItem value="OR">
                              {`OR`}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </span>
                      <div className={andOrs[index] === "AND" ? classes.borderAND: classes.borderOR} />
                      </div>
                      : null}
                    </div>
                  );
                })}
              </FormGroup>

              <IconButton onClick={() => addFilter()} disabled={filterlineIsNotFilled()}>
                <AddIcon />
              </IconButton>
            </div>
            <br></br>

            <div className={classes.saveButtonContainer}>
              <Button
                disabled={filterlineIsNotFilled()}
                onClick={() => closeFilterMenu()}
                variant="contained"
                color="primary"
                size="large"
                className={classes.saveButtonClass}
                startIcon={<SaveIcon />}
                >
                Apply Filters
              </Button>
            </div>

            {/* Warning message when editing datasets that are not the head */}
            <div style={{width: '100%'}}>
              <div style={{maxWidth: "90%", margin: '0 auto'}}>
                {selectedDataset < (numberOfDatasets-1) && open ? <EditWarning></EditWarning> : null}
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FilterMenu;

const useStyles = makeStyles( theme  => ({
  root: {
    width: 500,
    background: "#eeeeee",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "-15px"
  },

  saveButtonClass: {
    margin: "5px",
    background: "#6DBCB4",
  },

  saveButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex",
  },

  operatorButtonContainer: {
    display: "flex",
    marginTop: "15px",
    padding: "5px",
  },

  removeButtonContainer: {
    margin: "5px",
    marginTop: "15px",
    marginLeft: "5px",
    marginRight: "2px",
    display: "flex",
    height: "40px",
  },

  cardContainer: {
    margin: "10px",
  },

  textFieldClass: {
    marginTop: "15px",
  },
  filtersHeader: {
    display: "flex",
    justifyContent: "space-between",
    aligntItems: "center",
  },
  MuiSelectIcon: {
    color: "white",
  },
  fixPadding: {
    "& .MuiSelect-outlined.MuiSelect-outlined": {
      paddingRight: "6px",
    },
  },
  andOrButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex",
  },

  andOrButton: {
    //width: "50px",
    margin: "0px"
  
  },
  container: {
    marginTop: "10px",
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    marginRight: "11%"
  },
  borderAND: {
    borderBottom: "2px solid gray",
    width: "100%"
  },
  borderOR: {
    borderBottom: "5px solid gray",
    width: "100%"
  },
  content: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    fontWeight: 500,
    fontSize: 22,
    color: "lightgray"
  }

}));
