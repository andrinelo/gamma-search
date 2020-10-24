import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { setActiveWindow } from '../actions/SetActiveWindow.js';
import { fetchQueryItems, resetQueryItems} from '../actions/QueryManagerActions.js';
import { useDispatch, useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import {AGGREGATED_RESULT } from './../actions/QueryKeys.js'
import TextField from "@material-ui/core/TextField";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';




  export default function AggregateMenu() {
    
    const window = useSelector(state => state.activeWindow);
    const classes = useStyles();  
    const dispatch = useDispatch();

    const [localAggregateFunction, setLocalAggregateFunction] = React.useState('');
    const [localProptype, setLocalProptype] = React.useState('');

    const properties = ["number_of_interfaces", "name"];
    const aggregateFunctions = ["count", "sum", "mean", "max", "min"]; // count should only work when you haven't selected a prop/value field :)
    const aggregatedResult = useSelector(store => store.allQueryResults.aggregatedResult);

    // which node we're on
    const selectedDataset = useSelector(store => store.selectedDataset)
    // query before aggregation
    const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
    // query after aggregation
    const [currentQuery, setCurrentQuery] = React.useState(datasetAfterFiltersGremlinQuery);

    // set aggregate function
    const handleFunctionChange = e => {
      setLocalAggregateFunction(e.target.value)
    }

    // closes the aggregate menu when pressing x, remove unsaved local change
    const closeAggregateMenu = () => {
      setLocalAggregateFunction('');
      setLocalProptype('');
      setCurrentQuery(datasetAfterFiltersGremlinQuery);
      dispatch(resetQueryItems(AGGREGATED_RESULT));
      dispatch(setActiveWindow(""));
    };

    // this updates local state when a user selects a property or aggregation type
    const handleProptypeChange = selectedProperty => {
      setLocalProptype(selectedProperty);
      console.log(selectedProperty);
    };

    // fetch query result to calculate aggregation
    const applyAggregation = () => {
      const aggregateGremlinQuery = datasetAfterFiltersGremlinQuery.concat(!localProptype ? `.${localAggregateFunction}()` : `.values('${localProptype}').${localAggregateFunction}()`);
      setCurrentQuery(aggregateGremlinQuery)
      dispatch(fetchQueryItems(aggregateGremlinQuery,  AGGREGATED_RESULT, 0))
    }

    return (
      <Dialog 
        open={window==="aggregate"} 
        maxWidth={'sm'}
        fullWidth={true}
      >
        <CardHeader style={{ textAlign: 'center', paddingBottom: "0px" }} title={
          <div class={classes.relationsHeader}>
              <div></div>
              <h3>Aggregate</h3>
              <IconButton onClick={() => closeAggregateMenu()}>
                <CloseIcon/>
              </IconButton>
            </div>
          }>
        </CardHeader>
        <DialogContent>
          <Grid 
          container 
          spacing={3} 
          direction={"column"}
        >
            <Grid item container> 
                <Grid item >
                  <Autocomplete
                    name="property"
                    options={properties}
                    value={localProptype !== "" && localProptype !== undefined ? localProptype : null }
                    getOptionLabel={(option) => option}
                    groupBy={(option) => option !== "Label / Type" && option !== "Node ID" ? option.charAt(0).toUpperCase() : ""}
                    style={{ width: '250px' }}
                    onChange={(event, selectedProperty) => {
                      handleProptypeChange(selectedProperty)
                    }}
                            
                    renderInput={(params) => <TextField className={classes.textFieldClass} {...params} label="Select Property..." variant="outlined" />}

                    renderOption={(option, { inputValue }) => {
                      const matches = match(option, inputValue);
                      const parts = parse(option, matches);
                      
                      return (
                        <div>
                          {parts.map((part, index) => (
                            <span key={index} >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      ); 
                    }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.flexRow}>Aggregate function:  </div>
                    <Select
                      labelId="select aggregate function"
                      id="aggregateFunction"
                      onChange={handleFunctionChange}
                      value={localAggregateFunction}
                    >
                      {aggregateFunctions.map((value,key) => <MenuItem key={key} value={value}>{value}</MenuItem>)}
                    </Select>
                </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.saveButtonContainer}>
                <Button
                  onClick={applyAggregation}
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.saveButtonClass}
                  disabled={!localAggregateFunction}
                  >
                  Apply aggregation
                </Button>
              </div>
            </Grid>
            <Grid item container>
              {aggregatedResult.length > 0 && <Grid container spacing={1} direction={"column"}>
                  <Grid item>
                    Result: { aggregatedResult[0] }
                  </Grid>
                  <Grid item>
                    Current Query: {currentQuery}
                  </Grid>
                </Grid>
              }
            </Grid>
          </Grid>
        </DialogContent>

      </Dialog>
    );
  }

  const useStyles = makeStyles({
   
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    
    saveButtonClass: {
        margin: "5px",
        background: "#6DBCB4",
    },

    saveButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        display: "flex"
    },

    relationsHeader: {
        display: "flex",
        justifyContent: "space-between",
        aligntItems: "center"
    },

  });
