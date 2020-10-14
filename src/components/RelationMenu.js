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


function RelationMenu(props) {
  const stateRelations = useSelector((state) => state.relations);
  console.log(stateRelations)
  
  React.useEffect(() => {
    let id = props.edgeId;
    //if there exists a object in the state for this menu(id), then load that state to this component
    if (stateRelations[id]) {
      //console.log(stateRelations[id].relations);
      let tmpRelations = stateRelations[id].relations;
      //console.log(tmpRelations);
      setLocalRelations(JSON.parse(JSON.stringify(tmpRelations)));
      let tmpAllRelation = stateRelations[id].allRelations;
      setAllRelations(JSON.parse(JSON.stringify(tmpAllRelation)));
    }
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

  const saveAndCloseRelationMenu = () => {
    updateRelation(localRelations, allRelations, props.edgeId);
    dispatch(appendToGremlinQuery(""))
    closeRelationMenu();
  }
  
  const closeRelationMenu = () => {
    props.showMenu();
  };

  // Removes relation from component local storage
  const removeRelation = (index) => {
    localRelations.splice(index, 1);
    setLocalRelations([...localRelations]);
  };

  return (
    <div className={classes.cardContainer}>
      <Card className={classes.root}>
        <CardHeader
          style={{ textAlign: "center", paddingBottom: "0px" }}
          title={
            <div class={classes.relationsHeader}>
              <div></div>
              <h3>Relations</h3>
              <Button onClick={() => closeRelationMenu()}>
                <CloseIcon></CloseIcon>
              </Button>
            </div>
          }
        ></CardHeader>
        <CardContent>
          <EditWarning></EditWarning>
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
        </CardContent>
      </Card>
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
    width: 400,
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
    marginTop: "15px",
    width: "250px",
  },
  relationsHeader: {
    display: "flex",
    justifyContent: "space-between",
    aligntItems: "center",
  },
});


const tempAutocompleteOptions = [{"value":"ParentOf"}, {"value":"ChickenOf"}, {"value":"HasParent"}, {"value":"HasChicken"}];