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

function RelationMenu(props) {
  const stateRelations = useSelector((state) => state.relations);

  React.useEffect(() => {
    let id = props.edgeId;
    //if there exists a object in the state for this menu(id), then load that state to this component
    if (stateRelations[id]) {
      let tmpRelations = stateRelations[id].relations;
      setLocalRelations([...tmpRelations]);
      let tmpAllRelation = stateRelations[id].allRelations;
      setAllRelations(tmpAllRelation);
    }
  }, [stateRelations, props]);

  const dispatch = useDispatch();
  const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);
  const classes = useStyles();

  //the menu gets initialized with one empty relation
  const [localRelations, setLocalRelations] = React.useState([
    {
      checkedIn: false,
      checkedOut: false,
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
    localRelations[index][name] = event.target.checked;
    setLocalRelations([...localRelations]);
  };

  const handleTextChange = (index, event) => {
    let name = event.target.name;
    localRelations[index][name] = event.target.value;
    setLocalRelations([...localRelations]);
  };

  // Adds relation to component local storage
  const addRelation = () => {
    localRelations.push({
      checkedIn: false,
      checkedOut: false,
      text: "",
    });
    setLocalRelations([...localRelations]);
  };

  //when the sasve button is pressed, this function saves the local state to redux. It also sends inn the id of the edge
  //it's connected to, so that the diffrent menues can be saved in redux at the same time.
  const updateRelation = (relations, allRelations, edgeId) => {
    dispatch(SetRelation({ relations, allRelations }, edgeId));
  };

  const closeRelationMenu = () => {
    updateRelation(localRelations, allRelations, props.edgeId);
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
                            label="Inn"
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
                          <TextField
                            className={classes.textFieldClass}
                            value={element.text}
                            name="text"
                            variant="outlined"
                            label="Name of relation"
                            onChange={(e) => handleTextChange(index, e)}
                          >
                            {" "}
                          </TextField>
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

              <IconButton onClick={() => addRelation()}>
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
              onClick={() => closeRelationMenu()}
              variant="contained"
              color="primary"
              size="large"
              className={classes.saveButtonClass}
              startIcon={<SaveIcon />}
            >
              Save
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
  },
  relationsHeader: {
    display: "flex",
    justifyContent: "space-between",
    aligntItems: "center",
  },
});
