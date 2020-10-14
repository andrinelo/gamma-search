import React, { useState, useEffect } from "react";
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
import { setFilterWindowActive } from './../actions/FilterNodeActions.js';
import { resetSelectedDataset } from './../actions/SelectedDatasetActions.js';
import { resetGremlinQuery, appendToGremlinQuery, removeGremlinQueryStepsAfterIndex, setGremlinQueryStep} from "../actions/GremlinQueryActions.js";
import EditWarning from './EditWarning.js'


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
  const open = useSelector(state => state.filterNodeWindowsActive)
  const selectedDataset = useSelector(state => state.selectedDataset)  
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)

  console.log("SELECTED: ", selectedDataset)
  console.log("TOTAL: ", numberOfDatasets)


  const stateFilters = useSelector((state) => state.filters);

  useEffect(() => {
    let id = selectedDataset;
    if (stateFilters[id]) {
      let tmpFilters = stateFilters[id].filters;
      setLocalFilters([...tmpFilters]);
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
  }, [stateFilters, props, selectedDataset]);

  const dispatch = useDispatch();
  const classes = useStyles();

  // Initializing menu
  const [localFilters, setLocalFilters] = useState([
    {
      property: "",
      operator: "==",
      value: "",
    },
  ], [selectedDataset]);

  const handlePropertyChange = (index, event) => {
    let name = event.target.name;
    localFilters[index][name] = event.target.value;
    setLocalFilters([...localFilters]);
  };

  const handleOperatorChange = (index, event) => {
    let name = "operator";
    localFilters[index][name] = event.target.value;
    setLocalFilters([...localFilters]);
  };

  const handleValueChange = (index, event) => {
    let name = event.target.name;
    localFilters[index][name] = event.target.value;
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

  //run when cross is pressed. Closes the menu without saving to redux
  const handleClose = () => {
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());
  };

  const localFiltersToGreminParser = () => {
    let localGremlin = ""
    for (let id in localFilters){
      localGremlin = localGremlin.concat(".has('")
      localGremlin = localGremlin.concat(localFilters[id].property)
      localGremlin = localGremlin.concat("', ")
      switch(localFilters[id].operator){
        
        case "==":
          localGremlin = localGremlin.concat("eq")
          break;
        case "<":
          localGremlin = localGremlin.concat("gt")
          break;
        case ">":
          localGremlin = localGremlin.concat("lt")
          break
        case ">=": 
          localGremlin = localGremlin.concat("lte")
          break
        case "<=": 
          localGremlin = localGremlin.concat("gte")
          break
        case "!=": 
          localGremlin = localGremlin.concat("neq")
          break;
        default:
          break;
      }
      localGremlin = localGremlin.concat("('")
      localGremlin = localGremlin.concat(localFilters[id].value)
      localGremlin = localGremlin.concat("'))")
    }
    return(localGremlin)
  }

  const closeFilterMenu = () => {
    dispatch(setFilterWindowActive(false));
    dispatch(resetSelectedDataset());
    updateFilter(localFilters, selectedDataset);
    let localIndex = (selectedDataset * 2) +1

    let localGremlinQuery = localFiltersToGreminParser()
    dispatch(setGremlinQueryStep(localGremlinQuery, localIndex))

    // This code removes all queries after this filter, TODO: Remove the 'filters' in Redux that is 'after' the index of this filter
    dispatch(removeGremlinQueryStepsAfterIndex((selectedDataset*2)))
    dispatch(appendToGremlinQuery(localGremlinQuery))    

  };

  // Removes filter from component local storage
  const removeFilter = (index) => {
    localFilters.splice(index, 1);
    setLocalFilters([...localFilters]);
  };

  let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

  // checks whether the newly added filter has its fields filled
  // if not if should not be possible to add another filter
  // or apply filters at all
  const filterlineIsNotFilled = () => {
    const notFilled = (filterLine) => (filterLine.property === "" || filterLine.value === "");
    return localFilters.some(notFilled);
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
        <DialogContent style={{ maxWidth: '80vw', maxHeight: '80vh' }}>
          <div className={classes.cardContainer}>

          <DialogTitle id="alert-dialog-slide-title">
            {"Filter this dataset"}
            <img alt="icon" src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={handleClose}/>
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
                          <TextField
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
                          </TextField>
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
                          <TextField
                            className={classes.textFieldClass}
                            value={element.value}
                            name="value"
                            variant="outlined"
                            label="Select a value"
                            onChange={(e) => handleValueChange(index, e)}
                            >
                            {" "}
                          </TextField>
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
