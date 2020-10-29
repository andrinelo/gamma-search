import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import {setRelation, removeLaterRelaions} from "../actions/SetRelation.js";
import { DeleteForever } from "@material-ui/icons";
import EditWarning from './EditWarning.js'
import { Autocomplete } from "@material-ui/lab";
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { appendToGremlinQuery, removeGremlinQueryStepsAfterIndex} from "../actions/GremlinQueryActions.js";
import {setRelationWindowActive} from "../actions/RelationWindowActions";
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS } from './../actions/QueryKeys.js'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {removeLaterFilters} from "../actions/SetFilter.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function RelationMenu(props) {
  const open = useSelector(state => state.relationWindowActive)
  const stateRelations = useSelector((state) => state.relations);
  const selectedDataset = useSelector(state => state.selectedDataset)  
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)
  const availableIngoingRelations = useSelector(state => state.allQueryResults[DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS])
  const availableOutgoingRelations = useSelector(state => state.allQueryResults[DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS])
  const [allAvailableRelations, setAllAvailableRelations] = useState([])

  // If the "All ingoing relations" item has not already been added to the list, we add it
  if(!availableIngoingRelations.includes("All ingoing relations") && availableIngoingRelations.length > 0){
    availableIngoingRelations.unshift("All ingoing relations")
  }
  
  // If the "All outgoing relations" item has not already been added to the list, we add it
  if(!availableOutgoingRelations.includes("All outgoing relations") && availableOutgoingRelations.length > 0){
    availableOutgoingRelations.unshift("All outgoing relations")
  }

  // Updates the list of allAvailableRelations (and removes duplicated relations)
  useEffect(() => {
    const combinedRelations = [...availableIngoingRelations, ...availableOutgoingRelations]
    const uniqueCombinedRelations = combinedRelations.filter((item, pos) => combinedRelations.indexOf(item) === pos)
    uniqueCombinedRelations.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

    // Removes the 'All ingoing relations' from the combined relations list
    if(uniqueCombinedRelations.indexOf("All ingoing relations") > -1) {
      uniqueCombinedRelations.splice(uniqueCombinedRelations.indexOf("All ingoing relations"), 1);
    }

    // Removes the 'All outgoing relations' from the combined relations list
    if(uniqueCombinedRelations.indexOf("All outgoing relations") > -1) {
      uniqueCombinedRelations.splice(uniqueCombinedRelations.indexOf("All outgoing relations"), 1);
    }

    // If the "All relations" item has not already been added to the list, we add it
    if(!uniqueCombinedRelations.includes("All ingoing and outgoing relations") && uniqueCombinedRelations.length > 0){
      uniqueCombinedRelations.unshift("All ingoing and outgoing relations")
    }

    setAllAvailableRelations(uniqueCombinedRelations)
  }, [availableIngoingRelations, availableOutgoingRelations])


  useEffect(() => {
    let id = selectedDataset;
    //if there exists a object in the state for this menu(id), then load that state to this component
    if (stateRelations[id] && stateRelations[id].relations !== undefined && stateRelations[id].relations.length > 0) {
      let tmpRelations = stateRelations[id].relations;
      setLocalRelations(JSON.parse(JSON.stringify(tmpRelations)));
      let tmpAllRelation = stateRelations[id].allRelations;
      setAllRelations(JSON.parse(JSON.stringify(tmpAllRelation)));

      let tmpAndOrs = stateRelations[id].andOrs
      setAndOrs([...tmpAndOrs]);
    }
    else {
      setLocalRelations([
        {
          checkedIn: false,
          checkedOut: true, // Out is default value
          text: null,
        },
      ])
      setAndOrs([]);
    };
    setAllRelations("");
  }, [props, selectedDataset, stateRelations]);

  const dispatch = useDispatch();
  const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);
  const classes = useStyles();

  //the menu gets initialized with one empty relation
  const [localRelations, setLocalRelations] = React.useState([
    {
      checkedIn: false,
      checkedOut: true, // Out is default value
      text: null,
    },
  ]);

  const [andOrs, setAndOrs] = React.useState([], [selectedDataset]);

  //this state can be "", "Inn", "Out" or "All". If this parameter is not "", that localReltions is not used, beacuse
  //than you only have check if the user wants all connections inn, out or both
  const [allRelations, setAllRelations] = React.useState("");

  const handleAddAllButtons = (name) => {
    setAllRelations(name);
  };

  const handleCheckboxChange = (index, event) => {
    let name = event.target.name;
    // If checkedOut is only checked checkbox and it is unchecked automatically check in checkbox
    if (name === "checkedOut" && localRelations[index]["checkedIn"] === false && localRelations[index][name] === true) {
      localRelations[index]["checkedIn"] = true;
    }
    // Vice versa for in
    if (name === "checkedIn" && localRelations[index]["checkedOut"] === false && localRelations[index][name] === true) {
      localRelations[index]["checkedOut"] = true;
    }
    // Also update actual change
    localRelations[index][name] = event.target.checked;
    localRelations[index]['text'] = null
    setLocalRelations([...localRelations]);
  };

  const handleTextChange = (index, value) => {
    localRelations[index]["text"] = value;
    setLocalRelations([...localRelations]);
  };

  // Adds relation to component local storage
  const addRelation = () => {
    localRelations.push({
      checkedIn: false,
      checkedOut: true, // Out is default value
      text: null,
    });
    setLocalRelations([...localRelations]);

    andOrs.push(
      "OR"
    )
    setAndOrs([...andOrs]);
  };


  //when the sasve button is pressed, this function saves the local state to redux. It also sends inn the id of the edge
  //it's connected to, so that the diffrent menues can be saved in redux at the same time.
  const updateRelation = (relations, allRelations, edgeId) => {
    //dispatch(SetRelation({ relations, allRelations }, edgeId));
    dispatch(setRelation({ relations, allRelations }, {andOrs}, edgeId));
    dispatch(removeLaterFilters(edgeId))
    dispatch(removeLaterRelaions(edgeId))
  };

  // MAYBE: maybe one should not be able to apply changes made when there's no relations set by the user
  const localFiltersToGremlinParser = () => {

    if (localRelations.length === 0){
      return("")
    }

    let localGremlin = ""

    let both = true
    let inn = true
    let out = true
    let bothOne = false

    for (let id in localRelations){
      let element = localRelations[id]
      if (!(element.checkedIn === true && element.checkedOut === true)){
        both = false
      }
      if (!element.checkedIn === true){
        inn = false
      }
      if (!element.checkedOut === true){
        out = false
      }
      if (element.checkedIn === true && element.checkedOut === true){
        bothOne = true
      }
    }

    if (bothOne){
      out = false
      inn = false
    }

    let notAll = true
    for (let id in localRelations){
      let element = localRelations[id]
      if ((element.text === "All outgoing relations" || element.text === "All ingoing relations" || element.text === "All ingoing and outgoing relations")){
        notAll = false
        break
      }
    }



    if(!andOrs.includes("AND") && (both || inn || out)  && notAll){
    //if (false){
      if (both){
        localGremlin = localGremlin.concat(".both(")
      }
      else if(inn){
        localGremlin = localGremlin.concat(".in(")
      }
      else if(out){
        localGremlin = localGremlin.concat(".out(")
      }
      if (both || inn || out){
        for (let i = 0; i < localRelations.length; i++){
          let element = localRelations[i]
          
          localGremlin = localGremlin.concat("'")
          localGremlin = localGremlin.concat(element.text)
          localGremlin = localGremlin.concat("'")

          if (i !== localRelations.length -1){
            localGremlin = localGremlin.concat(",")
          }
        }
        localGremlin = localGremlin.concat(")")
      }
    }

    else{

      //lag liste med alle relasjonen, bere omvendt
      let gremlinList = []
      for (let i = 0; i < localRelations.length; i++){
        let tmpQuery = ""
        let element = localRelations[i]
        if (element.checkedIn && element.checkedOut){
          tmpQuery = tmpQuery.concat("both(")
        }
        else if (element.checkedIn){
          tmpQuery = tmpQuery.concat("in(")
        }
        else if (element.checkedOut){
          tmpQuery = tmpQuery.concat("out(")
        }
        if (!(element.text === "All outgoing relations" || element.text === "All ingoing relations" || element.text === "All ingoing and outgoing relations")){
          tmpQuery = tmpQuery.concat("'")
          tmpQuery = tmpQuery.concat(element.text)
          tmpQuery = tmpQuery.concat("'")
        }

        tmpQuery = tmpQuery.concat(")")
        gremlinList.push(tmpQuery)
      }

      //join ands
      let index = 0
      for (let i = 0; i < andOrs.length; i++){
        let tmpAndGremlin = ""
        if (andOrs[i] === "AND"){
          let counter = 0
          for (let j = i; j<andOrs.length; j++){
            if(andOrs[j] === "AND"){
              counter+=1
            }
            else{
              break
            }
          }
          tmpAndGremlin = tmpAndGremlin.concat("match(__.as('a').")
          tmpAndGremlin = tmpAndGremlin.concat(gremlinList[index])
          tmpAndGremlin = tmpAndGremlin.concat(".as('b')")
          tmpAndGremlin = tmpAndGremlin.concat(", ")
          for (let k = 0; k<counter; k++){
            tmpAndGremlin = tmpAndGremlin.concat("__.as('a').")
            tmpAndGremlin = tmpAndGremlin.concat(gremlinList[index+k+1])
            tmpAndGremlin = tmpAndGremlin.concat(".as('b')")
            if (k !== counter-1){
              tmpAndGremlin = tmpAndGremlin.concat(", ")
            }
          }
          tmpAndGremlin = tmpAndGremlin.concat(")")
          tmpAndGremlin = tmpAndGremlin.concat(".select('b')")
          i += counter-1
          gremlinList.splice(index, counter+1, tmpAndGremlin)
        }
        else{
          index += 1
        }
      }
      let andOrGremlinQuery = ""

      //joins ors
      if (andOrs.includes("OR")){
        andOrGremlinQuery = andOrGremlinQuery.concat(".union(")
        for (let localIndex in gremlinList){
          if (gremlinList[localIndex].startsWith("in(")){
            andOrGremlinQuery = andOrGremlinQuery.concat("__.")
          }
          andOrGremlinQuery = andOrGremlinQuery.concat(gremlinList[localIndex])
          if (localIndex !== gremlinList.length -1){
            andOrGremlinQuery = andOrGremlinQuery.concat(", ")
          }
        }
        andOrGremlinQuery = andOrGremlinQuery.concat(")")
      }
      else {
        andOrGremlinQuery = andOrGremlinQuery.concat(".")
        andOrGremlinQuery = andOrGremlinQuery.concat(gremlinList[0])
      }
      localGremlin = localGremlin.concat(andOrGremlinQuery)
    }

    return(localGremlin)
  }

  const saveAndCloseRelationMenu = () => {
    updateRelation(localRelations, allRelations, selectedDataset);
    //dispatch(appendToGremlinQuery(""))

    let localGremlinQuery = localFiltersToGremlinParser()
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)+1))
    if (localRelations.length >0){
      dispatch(appendToGremlinQuery(localGremlinQuery))
      dispatch(appendToGremlinQuery(""))
    }
    handleClose()
  }
  

  // Removes relation from component local storage
  const removeRelation = (index) => {
    localRelations.splice(index, 1);
    setLocalRelations([...localRelations]);
    if (index >= 1){
      andOrs.splice(index-1, 1)
    }
    else{
      andOrs.splice(index, 1)
    }
    setAndOrs([...andOrs])
  };
  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};


  const handleClose = () => {
    dispatch(setRelationWindowActive(false));
    dispatch(resetSelectedDataset());
  };

  // Deletes (from Redux-store) the values that has been fetched for different properties
  /*
  const deleteFetchedPropertyValues = () => {
    let keys = Object.keys(allResults)
    keys = keys.filter(key => key.includes(DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS))

    dispatch(deleteQueryItemsByKeys(keys))    
  }
  */


  const handleAndOrChange = (index, event) => {
    andOrs[index] = event.target.value;
    setAndOrs([...andOrs]);
  }
  

  return (
    <div className={classes.cardContainer}>
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
          {"Explore dataset relations"}
          <img alt="Close window" src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/>
        </DialogTitle>
        <DialogContent style={{ maxWidth: '80vw', maxHeight: '80vh', minWidth: '30vw' }}>
          {allRelations !== "" ? (
            <p>
              {allRelations} relations added{" "}
              <IconButton onClick={() => handleAddAllButtons("")}>
                {" "}
                <CloseIcon />
              </IconButton>
            </p>
          ) : (
            <div>
              <FormGroup>
                {localRelations.map((element, index) => {
                  return (
                    <div key={index}>
                      <div className={classes.flexRow}>
                        <div className={classes.flexColumn}>
                          <FormControlLabel
                            control={
                              <ArdoqThemedCheckbox
                                className={classes.checkboxClass}
                                checked={element.checkedIn}
                                name="checkedIn"
                                onChange={(e) => handleCheckboxChange(index, e)}
                              ></ArdoqThemedCheckbox>
                            }
                            label="In"
                          ></FormControlLabel>
                          <FormControlLabel
                            control={
                              <ArdoqThemedCheckbox
                                checked={element.checkedOut}
                                name="checkedOut"
                                onChange={(e) => handleCheckboxChange(index, e)}
                              ></ArdoqThemedCheckbox>
                            }
                            label="Out"
                          ></FormControlLabel>
                        </div>
                        <div className={classes.flexColumn}>
                          <Autocomplete
                            className={classes.textFieldClass}
                            name="text"
                            onChange={(e, v, r) => handleTextChange(index, v)}
                            options={element.checkedIn ? element.checkedOut ? allAvailableRelations : availableIngoingRelations : element.checkedOut ? availableOutgoingRelations : []}
                            value={element.text !== undefined && element.text !== "" ? element.text : null }
                            getOptionLabel={(option) => option}
                            groupBy={(option) => option !== "All ingoing and outgoing relations" && option !== "All outgoing relations" && option !== "All ingoing relations" ? option.charAt(0).toUpperCase() : ""}
                            //value = {element.text}
                            renderInput={(params) => <TextField {...params} className={classes.textFieldClass} value={element.text} label="Type of relation" variant="outlined" name="text"/>}
                          
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
                        <Button onClick={() => removeRelation(index)}>
                          <DeleteForever></DeleteForever>
                        </Button>
                      </div>
                      {index+1 !== localRelations.length ? 
                      <div className={classes.container}>
                        <div className={andOrs[index] === "AND" ? classes.borderAND: classes.borderOR} />
                        <span className={classes.content}>

                        <FormControl >
                          <Select className={classes.withLine}
                            style={{  height: "15px" }}
                            //className={classes.andOrButton}
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

              <IconButton disabled={localRelations.map((relation) => relation.text).includes(null)} onClick={() => addRelation()}>
                <AddIcon />
              </IconButton>
            </div>
          )}
          <br></br>


          <br></br>

          <div className={classes.saveButtonContainer}>
            <Button
              onClick={() => saveAndCloseRelationMenu()}
              variant="contained"
              color="primary"
              size="large"
              className={classes.saveButtonClass}
              startIcon={<SaveIcon />}
              disabled={localRelations.map((relation) => relation.text).includes(null)}
            >
              Save Changes
            </Button>
          </div>
            {/* Warning message when editing datasets that are not the head */}
            <div style={{width: '100%'}}>
              <div style={{maxWidth: "90%", margin: '0 auto'}}>
                {selectedDataset < (numberOfDatasets-1) && open ? <EditWarning></EditWarning> : null}
              </div>
            </div>

          
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RelationMenu;

const checkBoxStyles = (theme) => ({
  root: {
    "&$checked": {
      color: "#6DBCB4",
    },
  },
  checked: {},
});

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
  },
  buttonClass: {
    margin: "5px",
    background: "#770079",
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

  buttonClasslarge: {
    margin: "5px",
    width: "12em",
    height: "6em",
    background: "#770079",
  },

  cardContainer: {
    margin: "10px",
  },

  textFieldClass: {
    marginTop: "10px",
    width: "500px",
  },
  relationsHeader: {
    display: "flex",
    justifyContent: "space-between",
    aligntItems: "center",
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

