import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import SetRelation from "../actions/SetRelation.js";
import { DeleteForever } from "@material-ui/icons";
import EditWarning from './EditWarning.js'
import { resetGremlinQuery, appendToGremlinQuery, setGremlinQueryStep, removeGremlinQueryStepsAfterIndex} from "../actions/GremlinQueryActions.js";
import { Autocomplete } from "@material-ui/lab";
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {setRelationWindowActive} from "../actions/RelationWindowActions";
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS } from './../actions/QueryKeys.js'
import { fetchQueryItems, deleteQueryItemsByKeys } from './../actions/QueryManagerActions.js';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function RelationMenu(props) {
  const allResults = useSelector(state => state.allQueryResults)
  const open = useSelector(state => state.relationWindowActive)
  const stateRelations = useSelector((state) => state.relations);
  const selectedDataset = useSelector(state => state.selectedDataset)  
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)

  React.useEffect(() => {
    let id = selectedDataset;
    //if there exists a object in the state for this menu(id), then load that state to this component
    if (stateRelations[id]) {
      let tmpRelations = stateRelations[id].relations;
      setLocalRelations(JSON.parse(JSON.stringify(tmpRelations)));
      let tmpAllRelation = stateRelations[id].allRelations;
      setAllRelations(JSON.parse(JSON.stringify(tmpAllRelation)));
    }
    else {
      setLocalRelations([
        {
          checkedIn: false,
          checkedOut: true, // Out is default value
          text: "",
        },
      ])};
      setAllRelations("");
  }, [props]);

  const dispatch = useDispatch();
  const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);
  const classes = useStyles();

  //the menu gets initialized with one empty relation
  const [localRelations, setLocalRelations] = React.useState([
    {
      checkedIn: false,
      checkedOut: true, // Out is default value
      text: "",
    },
  ]);

  //this state can be "", "Inn", "Out" or "All". If this parameter is not "", that localReltions is not used, beacuse
  //than you only have check if the user wants all connections inn, out or both
  const [allRelations, setAllRelations] = React.useState("");

  const handleAddAllButtons = (name) => {
    setAllRelations(name);
  };

  const handleCheckboxChange = (index, event) => {
    let name = event.target.name;
    // If checkedOut is only checked checkbox and it is unchecked automatically check in checkbox
    if (name == "checkedOut" && localRelations[index]["checkedIn"] == false && localRelations[index][name] == true) {
      localRelations[index]["checkedIn"] = true;
    }
    // Vice versa for in
    if (name == "checkedIn" && localRelations[index]["checkedOut"] == false && localRelations[index][name] == true) {
      localRelations[index]["checkedOut"] = true;
    }
    // Also update actual change
    localRelations[index][name] = event.target.checked;
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
      text: "",
    });
    setLocalRelations([...localRelations]);
  };


  //when the sasve button is pressed, this function saves the local state to redux. It also sends inn the id of the edge
  //it's connected to, so that the diffrent menues can be saved in redux at the same time.
  const updateRelation = (relations, allRelations, edgeId) => {
    dispatch(SetRelation({ relations, allRelations }, edgeId));
  };

  const localFiltersToGremlinParser = () => {
    let localGremlin = ""
    for (let id in localRelations){
      let element = localRelations[id]
      if (element.checkedIn === true && element.checkedOut === true){
        localGremlin = localGremlin.concat(".both('")
      }
      else if (element.checkedIn === true && element.checkedOut === false){
        localGremlin = localGremlin.concat(".in('")
      }
      else if (element.checkedIn === false && element.checkedOut === true){
        localGremlin = localGremlin.concat(".out('")
      }
      localGremlin = localGremlin.concat(element.text.value)
      localGremlin = localGremlin.concat("')")

    }
    return(localGremlin)
  }

  const saveAndCloseRelationMenu = () => {
    updateRelation(localRelations, allRelations, selectedDataset);
    //dispatch(appendToGremlinQuery(""))

    let localGremlinQuery = localFiltersToGremlinParser()
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)+1))
    dispatch(appendToGremlinQuery(localGremlinQuery))
    dispatch(appendToGremlinQuery(""))

    handleClose()
  }
  

  // Removes relation from component local storage
  const removeRelation = (index) => {
    localRelations.splice(index, 1);
    setLocalRelations([...localRelations]);
  };
  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};


  const handleClose = () => {
    deleteFetchedPropertyValues()
    dispatch(setRelationWindowActive(false));
    dispatch(resetSelectedDataset());
  };

    // Deletes (from Redux-store) the values that has been fetched for different properties
    const deleteFetchedPropertyValues = () => {
      let keys = Object.keys(allResults)
      keys = keys.filter(key => key.includes(DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS))
  
      dispatch(deleteQueryItemsByKeys(keys))    
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
          {"Add relations"}
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
                            options={tempAutocompleteOptions}
                            getOptionLabel={(option) => option.value}
                            value = {element.text}
                            renderInput={(params) => <TextField {...params} className={classes.textFieldClass} 
                                value={element.text} label="Name of relation" variant="outlined" name="text"/>}
                          >
                            {" "}
                          </Autocomplete>
                        </div>
                        <Button onClick={() => removeRelation(index)}>
                          <DeleteForever></DeleteForever>
                        </Button>
                      </div>
                      <hr></hr>
                    </div>
                  );
                })}
              </FormGroup>

              <IconButton disabled={localRelations.map((relation) => relation.text).includes("")} onClick={() => addRelation()}>
                <AddIcon />
              </IconButton>
            </div>
          )}
          <br></br>
          <div className={classes.saveButtonContainer}>
            <div className={classes.flexRow}>
              <div className={classes.flexColumn}>
                <Button
                  onClick={() => handleAddAllButtons("Inn")}
                  className={classes.buttonClass}
                  variant="contained"
                  color="primary"
                >
                  Add all ingoing
                </Button>
                <Button
                  onClick={() => handleAddAllButtons("Out")}
                  className={classes.buttonClass}
                  variant="contained"
                  color="primary"
                >
                  Add all outgoing
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => handleAddAllButtons("Both")}
                  className={classes.buttonClasslarge}
                  variant="contained"
                  color="primary"
                >
                  Add all{" "}
                </Button>
              </div>
            </div>
          </div>

          <br></br>

          <div className={classes.saveButtonContainer}>
            <Button
              onClick={() => saveAndCloseRelationMenu()}
              variant="contained"
              color="primary"
              size="large"
              className={classes.saveButtonClass}
              startIcon={<SaveIcon />}
              disabled={localRelations.map((relation) => relation.text).includes("")}
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
});


const tempAutocompleteOptions = [{"value":"Is Expert In"}, {"value":"imports"}, {"value":"Realized By"}, {"value":"ardoq_parent"}];