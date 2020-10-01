import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import SetFilter from "../actions/SetFilter.js";
import { DeleteForever } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EpmtyIcon from "./emptyIcon.js"
import Select from "@material-ui/core/Select";

const operators = {
  "=": "=",
  "!=": "≠",
  ">=": "≥",
  ">": ">",
  "<": "<",
  "=<": "≤",
};

function FilterMenu(props) {
  const stateFilters = useSelector((state) => state.filters);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    let id = props.cloudId;
    if (stateFilters[id]) {
      let tmpFilters = stateFilters[id].filters;
      setLocalFilters([...tmpFilters]);
    }
  }, [stateFilters, props]);

  const dispatch = useDispatch();
  const classes = useStyles();

  // Initializing menu
  const [localFilters, setLocalFilters] = useState([
    {
      property: "",
      operator: "=",
      value: "",
    },
  ]);

  const handlePropertyChange = (index, event) => {
    let name = event.target.name;
    localFilters[index][name] = event.target.value;
    setLocalFilters([...localFilters]);
  };

  const handleOperatorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOperatorClose = () => {
    setAnchorEl(null);
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
      operator: "=",
      value: "",
    });
    setLocalFilters([...localFilters]);
  };

  const updateFilter = (filters, cloudId) => {
    dispatch(SetFilter({ filters }, cloudId));
  };

  const closeFilterMenu = () => {
    updateFilter(localFilters, props.cloudId);
    props.showFilter();
  };

  // Removes filter from component local storage
  const removeFilter = (index) => {
    localFilters.splice(index, 1);
    setLocalFilters([...localFilters]);
  };

  return (
    <div className={classes.cardContainer}>
      <Card className={classes.root}>
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
        <CardContent>
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
            
                        <div>
                        <Select
                          onChange={(e) => handleOperatorChange(index, e)}
                          variant="outlined"
                          value={localFilters[index].operator}
                          IconComponent={() => (
                            < EpmtyIcon/>
                          )}
                        >
                          <MenuItem

                            value="="
                            name="operator"
                          >
                            {`=`}
                            
                          </MenuItem>
                          <MenuItem
                            value="!="
                            name="operator"
                          >
                            {`≠`}
                          </MenuItem>
                          <MenuItem
                            value=">="
                            name="operator"
                          >
                            {`≥`}
                          </MenuItem>
                          <MenuItem
                            value=">"
                            name="operator"
                          >
                            {`>`}
                          </MenuItem>
                          <MenuItem
                            value="<"
                            name="operator"
                          >
                            {`<`}
                          </MenuItem>
                          <MenuItem
                            value="=<"
                            name="operator"
                          >
                            {`≤`}
                          </MenuItem>

                        </Select>

                        </div>
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

            <IconButton onClick={() => addFilter()}>
              <AddIcon />
            </IconButton>
          </div>
          <br></br>

          <div className={classes.saveButtonContainer}>
            <Button
              onClick={() => closeFilterMenu()}
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
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    margin: "15px",
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
    color: "white"
  }
});
