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
import SaveIcon from "@material-ui/icons/Save";
import { withStyles } from "@material-ui/core/styles";
import {setRelation, removeLaterRelations} from "../actions/RelationActions.js";
import { DeleteForever } from "@material-ui/icons";
import EditWarning from './EditWarning.js'
import { Autocomplete } from "@material-ui/lab";
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { appendToGremlinQuery, removeGremlinQueryStepsAfterIndex} from "../actions/GremlinQueryActions.js";
import { setHelpWindowActive } from '../actions/HelpWindowActions.js';
import {setRelationWindowActive} from "../actions/RelationWindowActions";
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS } from './../actions/QueryKeys.js'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {removeLaterFilters} from "../actions/FilterActions.js";

// Modal slide transition animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// Component used for exploring a dataset's relations (and therefor creating new datasets)
function RelationMenu(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  
  // Checkbox with the Ardoq theme
  const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);
  
  // Whether or not this modal is open
  const open = useSelector(state => state.relationWindowActive)
  
  // Any previously applied relations that's saved in the state
  const stateRelations = useSelector((state) => state.relations);
  
  // The dataset we're traversing/exploring from.
  const selectedDataset = useSelector(state => state.selectedDataset)  
  
  // The amount of datasets in the current query build
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)
  
  // All types on ingoing relations to the dataset
  const availableIngoingRelations = useSelector(state => state.allQueryResults[DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS])
  
  // All types of outgoing relations from the dataset
  const availableOutgoingRelations = useSelector(state => state.allQueryResults[DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS])
  
  // All types of relations to and from the dataset
  const [allAvailableRelations, setAllAvailableRelations] = useState([])
  
  // The list of ANDs and ORs between each relation line
  const [andOrs, setAndOrs] = React.useState([], [selectedDataset]);
  
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

    // If the "All ingoing and outgoing relations" item has not already been added to the list, we add it
    if(!uniqueCombinedRelations.includes("All ingoing and outgoing relations") && uniqueCombinedRelations.length > 0){
      uniqueCombinedRelations.unshift("All ingoing and outgoing relations")
    }

    setAllAvailableRelations(uniqueCombinedRelations)
  }, [availableIngoingRelations, availableOutgoingRelations])


  useEffect(() => {
    let id = selectedDataset;

    // If there exists a object in the state for this menu(id), then load that state to this component
    if (stateRelations[id] && stateRelations[id].relations !== undefined && stateRelations[id].relations.length > 0) {
      let tmpRelations = stateRelations[id].relations;
      setLocalRelations(JSON.parse(JSON.stringify(tmpRelations)));
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

  }, [props, selectedDataset, stateRelations]);


  // The menu gets initialized with one empty relation
  const [localRelations, setLocalRelations] = React.useState([
    {
      checkedIn: false,
      checkedOut: true, // Out is default value
      text: null,
    },
  ]);


  // Fires when user changes the wanted direction of the relation
  const handleDirectionChange = (index, event) => {
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

  // Fired whenever the user changes the label/type of relation
  const handleRelationChange = (index, value) => {
    localRelations[index]["text"] = value;
    setLocalRelations([...localRelations]);
  };

  // Adds relation to component local storage
  const addNewRelation = () => {
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


  // When the save button is pressed, this function saves the local state to redux. It also sends inn the id of the edge
  // it's connected to, so that the diffrent menues can be saved in redux at the same time.
  const updateRelation = (relations, datasetID) => {
    dispatch(setRelation({ relations }, {andOrs}, datasetID));
    dispatch(removeLaterFilters(datasetID))
    dispatch(removeLaterRelations(datasetID))
  };

  const localFiltersToGremlinParser = () => {

    //returns empty string if the user has removed all relations
    if (localRelations.length === 0){
      return("")
    }

    let localGremlin = ""

    let both = true
    let inn = true
    let out = true
    let bothOne = false

    //checks of only one direction of edges is choosen
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

    //checks if the user has not selected an "all" relations
    let notAll = true
    for (let id in localRelations){
      let element = localRelations[id]
      if ((element.text === "All outgoing relations" || element.text === "All ingoing relations" || element.text === "All ingoing and outgoing relations")){
        notAll = false
        break
      }
    }


    //if the user has only selected one direction for graphs, only selected ORS and have not selected "all" relations
    //the gremlin query can be written in the simple form of e.g out("A", "B", "C")
    if(!andOrs.includes("AND") && (both || inn || out)  && notAll){
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

    //else the query must be parsed in a more complex way
    else{
      //makes a list of all the relations parsed indivudialy to gremlin
      //this is later used to AND and OR together the elements of the list
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

        andOrGremlinQuery = andOrGremlinQuery.slice(0, -2)
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

  // Fired when applying the new relations
  const saveAndCloseRelationMenu = () => {
    updateRelation(localRelations, selectedDataset);

    let localGremlinQuery = localFiltersToGremlinParser()
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)+1))
    
    // Assures that new datasets are not added to the graph when applying 0 relations
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

  // Fired whenever the modal closes
  const handleClose = () => {
    dispatch(setRelationWindowActive(false));
    dispatch(resetSelectedDataset());
  };

  // Fired whenever the ANDs or ORs changes
  const handleAndOrChange = (index, event) => {
    andOrs[index] = event.target.value;
    setAndOrs([...andOrs]);
  }
  
  return (
    <div className={classes.cardContainer}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="filter-menu-dialog-slide-title"
        maxWidth={false}
      >
        <DialogTitle id="filter-menu-dialog-slide-title" style={{textAlign: 'center'}}>
          {"Explore dataset's relations"}
          <HelpOutlineOutlinedIcon style={{marginBottom: '-5px', marginLeft: '5px', cursor: 'pointer'}} onClick={() => dispatch(setHelpWindowActive(true))}/>
          <img alt="Close window" src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/>
        </DialogTitle>
        <DialogContent style={{ maxWidth: '80vw', maxHeight: '80vh', minWidth: '30vw' }}>
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
                              onChange={(e) => handleDirectionChange(index, e)}
                            ></ArdoqThemedCheckbox>
                          }
                          label="In"
                        ></FormControlLabel>
                        <FormControlLabel
                          control={
                            <ArdoqThemedCheckbox
                              checked={element.checkedOut}
                              name="checkedOut"
                              onChange={(e) => handleDirectionChange(index, e)}
                            ></ArdoqThemedCheckbox>
                          }
                          label="Out"
                        ></FormControlLabel>
                      </div>
                      <div className={classes.flexColumn}>

                        {/* The field for selecting relation name/label/type */}
                        <Autocomplete
                          className={classes.textFieldClass}
                          name="text"
                          onChange={(e, v, r) => handleRelationChange(index, v)}
                          options={element.checkedIn ? element.checkedOut ? allAvailableRelations : availableIngoingRelations : element.checkedOut ? availableOutgoingRelations : []}
                          value={element.text !== undefined && element.text !== "" ? element.text : null }
                          getOptionLabel={(option) => option}
                          groupBy={(option) => option !== "All ingoing and outgoing relations" && option !== "All outgoing relations" && option !== "All ingoing relations" ? option.charAt(0).toUpperCase() : ""}
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
                          onChange={(e) => handleAndOrChange(index, e)}
                          value={andOrs[index]}
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

            <Button
              variant="contained"
              color="primary"
              size={"small"}
              className={classes.addButtonClass}
              endIcon={<AddIcon />}
              disabled={localRelations.map((relation) => relation.text).includes(null)}
              onClick={() => addNewRelation()}
              >
              More relations
            </Button>
          </div>
        
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
              Apply relations
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


  addButtonClass: {
    background: "#770079",
    marginTop: "20px",
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

