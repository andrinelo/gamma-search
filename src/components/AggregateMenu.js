import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { setActiveWindow } from '../actions/SetActiveWindow.js';
import { fetchQueryItems } from '../actions/QueryManagerActions.js';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {AGGREGATED_RESULT } from './../actions/QueryKeys.js'


  export default function AggregateMenu(props) {
    
    const window = useSelector(state => state.activeWindow);
    const classes = useStyles();  
    const dispatch = useDispatch();
    const [localAggregateFunction, setLocalAggregateFunction] = React.useState('');
    const [localProptype, setLocalProptype] = React.useState('');
    const aggregateFunctions = ["count", "sum", "mean", "max", "min"]; // count should only work when you haven't selected a prop/value field :)
    const aggregatedResult = useSelector(store => store.allQueryResults.aggregatedResult);
    
    // which node we're on
    const selectedDataset = useSelector(store => store.selectedDataset)
    // current query
    const datasetAfterFiltersGremlinQuery = useSelector(store => store.gremlinQueryParts.slice(0, (selectedDataset + 1) * 2).join(""))
    const [currentQuery, setCurrentQuery] = React.useState(datasetAfterFiltersGremlinQuery);


    const handleFunctionChange = e => {
      setLocalAggregateFunction(e.target.value)
    }

    // closes the aggregate menu when pressing x, remove unsaved local change
    const closeAggregateMenu = () => {
      setLocalAggregateFunction('');
      setLocalProptype('');
      setCurrentQuery(datasetAfterFiltersGremlinQuery);
      dispatch(setActiveWindow(""));
    };

    // this updates local state when a user selects a property or aggregation type
    const handleProptypeChange = e => {
      setLocalProptype(e.target.value);
    };

    // 
    const applyAggregation = () => {
      const aggregateGremlinQuery = datasetAfterFiltersGremlinQuery.concat(!localProptype ? `.${localAggregateFunction}()` : `.values('${localProptype}').${localAggregateFunction}()`);
      setCurrentQuery(aggregateGremlinQuery)
      dispatch(fetchQueryItems(aggregateGremlinQuery,  AGGREGATED_RESULT, 0))
    }

    return (
      // shows aggregatemenu if it has been set as active by the cloud button
      <Dialog open={window==="aggregate"}>
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
          <Grid container spacing={2}>
            <Grid item> 
            <Box>
              <Box display="flex">
                <Box>Property type:  </Box>
                <Box>
                  <TextField 
                    variant="outlined" 
                    size="small" 
                    onChange={handleProptypeChange}
                  />
                </Box>
              </Box>
              <Box display="flex">
                <Box>Aggregate function: </Box>
                <Box>
                  <Select
                    labelId="select aggregate function"
                    id="aggregateFunction"
                    onChange={handleFunctionChange}
                    value={localAggregateFunction}
                  >
                    {aggregateFunctions.map((value,key) => <MenuItem key={key} value={value}>{value}</MenuItem>)}
                  </Select>
                </Box>
              </Box>
            </Box>
            </Grid>
            <Grid item>
              <div>
                Result: {aggregatedResult ? aggregatedResult[0] : "None"}
              </div>
              <div>
                Current Query: {currentQuery}
              </div>
            </Grid>
          </Grid>
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
        </DialogContent>

      </Dialog>
    );
  }

  AggregateMenu.propTypes = {
    cloudId: PropTypes.number.isRequired,
  }

  const useStyles = makeStyles({
    root: {
      width: '50%',
      background: "#eeeeee",
      heigth: '50%'
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
        background: "#770079"
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

    buttonClasslarge: {
        margin: "5px",
        width: "12em",
        height: "6em",
        background: "#770079"
    },

    cardContainer :{
      width: "50%",
      margin: "5%"
    },

    textFieldClass: {
        marginTop: "15px"
    },
    relationsHeader: {
        display: "flex",
        justifyContent: "space-between",
        aligntItems: "center"
    },

  });
