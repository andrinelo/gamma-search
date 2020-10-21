import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { setActiveWindow } from '../actions/SetActiveWindow.js';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";

  export default function AggregateMenu(props) {
    
    const window = useSelector(state => state.activeWindow);
    const stateAggregations = useSelector(state => state.aggregation);
    const classes = useStyles();  
    const dispatch = useDispatch();
    const [localAggregateFunction, setLocalAggregateFunction] = React.useState('');
    const [localProptype, setLocalProptype] = React.useState('');
    
    const aggregateFunctions = ["count", "sum", "mean", "max", "min"];


    const handleFunctionChange = e => {
      setLocalAggregateFunction(e.target.value)
    }

    // closes the aggregate menu when pressing x, remove unsaved local change
    const closeAggregateMenu = () => {
      setLocalAggregateFunction('');
      setLocalProptype('');
      dispatch(setActiveWindow(""));
    };

    // this updates local state when a user selects a property or aggregation type
    const handleProptypeChange = e => {
      setLocalProptype(e.target.value);
    };

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
              <p>{localAggregateFunction} of {localProptype}</p>
            </Grid>
          </Grid>
        </DialogContent>

      </Dialog>
    );
  }

  AggregateMenu.propTypes = {
    cloudId: PropTypes.number.isRequired,
  }

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
