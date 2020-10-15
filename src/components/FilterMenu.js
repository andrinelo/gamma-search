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
import SetFilter from "../actions/SetFilter.js";
import { DeleteForever } from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import EmptyIcon from "./emptyIcon.js";
import Select from "@material-ui/core/Select";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { setFilterWindowActive } from '../actions/FilterDatasetActions.js';
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { resetGremlinQuery, appendToGremlinQuery, removeGremlinQueryStepsAfterIndex, setGremlinQueryStep} from "../actions/GremlinQueryActions.js";
import EditWarning from './EditWarning.js'
import { ALL_PROPERTIES_OF_DATASET, VALUES_FOR_PROPERTY_IN_DATASET } from './../actions/QueryKeys.js'
import { fetchQueryItems, deleteQueryItemsByKeys } from './../actions/QueryManagerActions.js';


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

  
  // Gremlin query corresponding to the gremlin query for the selected dataset, ignoring any filters on this particular dataset
  let datasetBeforeFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, 1 + selectedDataset * 2).join(""))


  // Fetches all possible labels, to be used as auto-suggestions
  const allProperties = useSelector(state => state.allQueryResults[ALL_PROPERTIES_OF_DATASET])
  
  // Initializing menu
  const [localFilters, setLocalFilters] = useState([
    {
      property: "",
      operator: "==",
      value: "",
      isNumber: false
    },
  ], [selectedDataset]);

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
    
    // If the filter window is open and we have set the set filters from store flag, we set the filters from store
    if(shouldSetFiltersFromStore && open){
      let id = selectedDataset;
      if (stateFilters[id] && stateFilters[id].filters !== undefined && stateFilters[id].filters.length > 0) {
        let tmpFilters = stateFilters[id].filters;
        setLocalFilters([...tmpFilters]);

        // Fetches possible values for the properties that was stored in redux
        for(let i = 0; i < tmpFilters.length; i++){
          fetchValuesForProperty(i, tmpFilters[i].property)
        }
      }
      else{
        setLocalFilters([
          {
            property: "",
            operator: "==",
            value: "",
          },
        ]);
      }
      setshouldSetFiltersFromStore(false)
    }
  }, [stateFilters, props, selectedDataset, allResults]);


  // Deletes (from Redux-store) the values that has been fetched for different properties
  const deleteFetchedPropertyValues = () => {
    let keys = Object.keys(allResults)
    keys = keys.filter(key => key.includes(VALUES_FOR_PROPERTY_IN_DATASET))

    dispatch(deleteQueryItemsByKeys(keys))    
  }

  const fetchValuesForProperty = (index, selectedProperty) => {
    if(selectedProperty !== "Node ID" && selectedProperty !== "" && selectedProperty !== null && selectedProperty !== undefined){
      let propertyValuesGremlinQuery = datasetBeforeFiltersGremlinQuery

      if(selectedProperty === "Label / Type"){
        
        propertyValuesGremlinQuery += ".dedup().label().dedup()"
      }
      else{
        propertyValuesGremlinQuery += ".dedup().properties('" + selectedProperty +"').value().dedup()"
      }
      
      // We fetch every possible value in the dataset for the selected property 
      dispatch(fetchQueryItems(propertyValuesGremlinQuery, VALUES_FOR_PROPERTY_IN_DATASET + selectedProperty, 0))
    }
  }

  const handlePropertyChange = (index, selectedProperty) => {
    if(selectedProperty === null || selectedProperty === undefined){
      selectedProperty = ""
    }

    fetchValuesForProperty(index, selectedProperty)
    
    localFilters[index]['property'] = selectedProperty;
    localFilters[index]['value'] = "";

    setLocalFilters([...localFilters]);
  };

  const handleOperatorChange = (index, event) => {
    localFilters[index]['operator'] = event.target.value;
    setLocalFilters([...localFilters]);
  };

  const handleValueChange = (index, selectedValue) => {
    if(selectedValue === null){
      selectedValue = ""
    }

    localFilters[index]['value'] = selectedValue;
    setLocalFilters([...localFilters]);
  };

  // Adds filter to component local storage
  const addFilter = () => {
    localFilters.push({
      property: "",
      operator: "==",
      value: "",
    });
    setLocalFilters([...localFilters]);
  };

  const updateFilter = (filters, cloudId) => {
    dispatch(SetFilter({ filters }, cloudId));
  };

  // run when cross is pressed. Closes the menu without saving to redux
  const handleClose = () => {
    deleteFetchedPropertyValues()
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());
    setshouldSetFiltersFromStore(true)
  };

  const localFiltersToGreminParser = () => {
    let localGremlin = ""
    for (let id in localFilters){
      let filterProperty = localFilters[id].property

      if(filterProperty === "Label / Type"){
        localGremlin = localGremlin.concat(".hasLabel('")
        localGremlin = localGremlin.concat(localFilters[id].value)
        localGremlin = localGremlin.concat("')")
      }

      else if (filterProperty === "Node ID"){
        localGremlin = localGremlin.concat(".hasId('")
        localGremlin = localGremlin.concat(localFilters[id].value)
        localGremlin = localGremlin.concat("')")
      }
      
      else{
        localGremlin = localGremlin.concat(".has('")
        localGremlin = localGremlin.concat(filterProperty)
        localGremlin = localGremlin.concat("', ")

        switch(localFilters[id].operator){
          
          case "==":
            localGremlin = localGremlin.concat("eq")
            break;
          case "<":
            localGremlin = localGremlin.concat("lt")
            break;
          case ">":
            localGremlin = localGremlin.concat("gt")
            break
          case ">=": 
            localGremlin = localGremlin.concat("gte")
            break
          case "<=": 
            localGremlin = localGremlin.concat("lte")
            break
          case "!=": 
            localGremlin = localGremlin.concat("neq")
            break;
          default:
            break;
        }

        // Value is a number (because all the property's values are numbers)
        if(allResults[VALUES_FOR_PROPERTY_IN_DATASET + filterProperty] !== undefined && !allResults[VALUES_FOR_PROPERTY_IN_DATASET + filterProperty].some(isNaN)){
          localGremlin = localGremlin.concat("(")
          localGremlin = localGremlin.concat(localFilters[id].value)
          localGremlin = localGremlin.concat("))")
        }

        // Value is a string
        else{
          localGremlin = localGremlin.concat("('")
          localGremlin = localGremlin.concat(localFilters[id].value)
          localGremlin = localGremlin.concat("'))")
        }
        
      }
    }

    // Updates the localfilters-state
    setLocalFilters([...localFilters]);

    return(localGremlin)
  }

  // Runs when filters are saved
  const closeFilterMenu = () => {
    deleteFetchedPropertyValues()
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());

    //updates and removes the 'filters' in Redux that is 'after' the index of this filter
    updateFilter(localFilters, selectedDataset);
    let localIndex = (selectedDataset * 2) + 1

    let localGremlinQuery = localFiltersToGreminParser()
    dispatch(setGremlinQueryStep(localGremlinQuery, localIndex))

    // This code removes all queries after this filter
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)))
    dispatch(appendToGremlinQuery(localGremlinQuery))




    setshouldSetFiltersFromStore(true)
  };

  // Removes filter from component local storage
  const removeFilter = (index) => {
    localFilters.splice(index, 1);
    setLocalFilters([...localFilters]);
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
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
      >
        <DialogContent style={{ maxWidth: '80vw', maxHeight: '80vh', minWidth: '30vw' }}>
          <div className={classes.cardContainer}>

          <DialogTitle id="alert-dialog-slide-title">
            {"Filter this dataset"}
            <img alt="Close window" src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/>
          </DialogTitle>
        

          {/*}
          <CardHeader
          style={{ textAlign: "center", paddingBottom: "0px" }}
          title={
            <div class={classes.filtersHeader}>
            <div></div>
            <h3>Filter</h3>
            <Button onClick={() => closeFilterMenu()}>
            <CloseIcon></CloseIcon>
            </Button>
            </div>
          }
          ></CardHeader>
        */}

            <div>
              <FormGroup>
                {localFilters.map((element, index) => {
                  return (
                    <div key={index}>
                      <div className={classes.flexRow}>
                        <div className={classes.flexColumn}>


                          {/* <TextField
                            className={classes.textFieldClass}
                            value={element.property}
                            name="property"
                            variant="outlined"
                            label="Select a property"
                            onChange={(e) => handlePropertyChange(index, e)}
                            >
                            {localFilters[index].property !== ""
                              ? localFilters[index].property
                              : ""}
                          </TextField> */}


                          <Autocomplete
                            name="property"
                            options={allProperties}
                            value={localFilters[index]['property'] !== "" && localFilters[index]['property'] !== undefined ? localFilters[index].property : null }
                            getOptionLabel={(option) => option}
                            groupBy={(option) => option !== "Label / Type" && option !== "Node ID" ? option.charAt(0) : ""}
                            style={{ width: '250px' }}
                            onChange={(event, selectedProperty) => {
                              handlePropertyChange(index, selectedProperty)
                            }}
                            
                            renderInput={(params) => <TextField className={classes.textFieldClass} {...params} label="Filter by..." variant="outlined" />}
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
                              <MenuItem value=">=" name="operator">
                                {`≥`}
                              </MenuItem>
                              <MenuItem value=">" name="operator">
                                {`>`}
                              </MenuItem>
                              <MenuItem value="<" name="operator">
                                {`<`}
                              </MenuItem>
                              <MenuItem value="=<" name="operator">
                                {`≤`}
                              </MenuItem>
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
                            freeSolo
                            name="value"
                            options={allResults[VALUES_FOR_PROPERTY_IN_DATASET + localFilters[index]['property']] === undefined ? [] : allResults[VALUES_FOR_PROPERTY_IN_DATASET + localFilters[index]['property']].map(String)}
                            defaultValue={localFilters[index]['value'] !== "" && localFilters[index]['value'] !== undefined ? localFilters[index].value : "" }
                            inputValue={localFilters[index]['value'] !== "" && localFilters[index]['value'] !== undefined ? localFilters[index].value : "" }
                            getOptionLabel={(option) => option}
                            groupBy={(option) => isNaN(option) ? option.charAt(0).toUpperCase() : "Numbers"}
                            style={{ width: '250px' }}
                            onInputChange={(event, selectedValue) => {
                              handleValueChange(index, selectedValue)
                            }}
                            
                            renderInput={(params) => <TextField name="vlauer" className={classes.textFieldClass} {...params} label="Value..." variant="outlined" />}
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
                      <hr></hr>
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

const useStyles = makeStyles({
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
});
