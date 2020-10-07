import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import SelectPropertyView from './SelectPropertyView';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { setActiveWindow } from '../actions/SetActiveWindow.js';
import { setAggregation } from '../actions/SetAggregation.js';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";

  export default function AggregateMenu(props) {
    const window = useSelector(state => state.activeWindow);
    const classes = useStyles();  
    const dispatch = useDispatch();

    const addAggregateChoices = () => { 
      localAggregations.push({
        proptype: "",
        aggregateFunction: ""
      });
      setLocalAggregation([...localAggregations]);
    }

    // closes the aggregate menu when pressing x, remove local state
    const closeAggregateMenu = () => {
      setLocalAggregation([{
        proptype: "",
        aggregateFunction: ""
      }]);
      dispatch(setActiveWindow(""));
    }

    // close the aggregate menu, save state 
    const save = () => {
      dispatch(setAggregation(localAggregations, props.cloudId));
      dispatch(setActiveWindow(""));
      // TODO add to redux
    }

    const [localAggregations, setLocalAggregation] = React.useState([{proptype: "", aggregateFunction: ""}]);

    const handleChange = (e, id, index) => {
      localAggregations[index][id] = e.target.value;
      setLocalAggregation([...localAggregations]);
    };

    const handleDeleteAggregation = (index) => {
      localAggregations.splice(index, 1);
      setLocalAggregation([...localAggregations]);
    }

    return (
      // shows aggregatemenu if it has been set as active by the cloud button
      window === "aggregate" && <Card className={classes.root} variant="outlined">
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
        <CardContent>
          <div>
            {localAggregations.map((element, index) => {
              return (
                <div key={index}>
                  <SelectPropertyView onChange={(e, id)=>handleChange(e, id, index)} onDelete={()=>handleDeleteAggregation(index)} proptype={element.proptype} aggregateFunction={element.aggregateFunction}/> 
                </div>
              )
            })}
            <IconButton onClick={()=> addAggregateChoices()}>  
              <AddIcon/>
            </IconButton>
          </div>
        </CardContent>
        <CardActions>
          <Button onClick={()=> save()} size="large" startIcon={<SaveIcon />} variant="contained" color="primary" className={classes.saveButtonClass}>Save</Button>
        </CardActions>
      </Card>
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
