import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Checkbox from '@material-ui/core/Checkbox';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import { useSelector, useDispatch } from "react-redux";
import SetRelation from "../actions/SetRelation.js";

function RelationMenu(props) {

    const stateRelations = useSelector(state => state.relations)
    //console.log(stateRelations)

    
    React.useEffect(() => {
        //const stateRelations = useSelector(state => state.relations)
        let id = props.edgeId
        console.log(stateRelations)
        if (stateRelations[id]){
            let tmpRelations = stateRelations[id].relations
            console.log(tmpRelations)
            setLocalRelations([...tmpRelations])

            let tmpAllRelation = stateRelations[id].allRelations
            setAllRelations(tmpAllRelation)
        }
        
        //setRelations(stateRelations.por)
    }, [])
    

    const dispatch = useDispatch();

    const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);

    const classes = useStyles();

    const [localRelations, setLocalRelations] = React.useState([
        {
            checkedIn: false,
            checkedOut: false,
            text: "",
        },
    ]);

    const [allRelations, setAllRelations] = React.useState("");

    const handleAddAllButtons = (name) => {
        setAllRelations(name)
        //console.log(allRelations);
    }

    const handleCheckboxChange = (index, event) => {
        let name =event.target.name
        localRelations[index][name] = event.target.checked
        setLocalRelations([...localRelations])
        //console.log(relations);
    }

    const handleTextChange = (index, event) => {
        let name =event.target.name
        localRelations[index][name] = event.target.value
        setLocalRelations([...localRelations])
        //console.log(relations);
    }


    const addRealtion = () => {
        localRelations.push({
            checkedIn: false,
            checkedOut: false,
            text: "",
        })
        setLocalRelations([...localRelations])
        //console.log(relations)
    }

    const updateRelation = (relations, allRelations, edgeId) => {
        //console.log(relations)
        dispatch(
            SetRelation(
                {relations, allRelations}, edgeId
          )
        );
      }
    
      const closeRelationMenu = () => {
        //console.log(props.edgeId)
        updateRelation(localRelations, allRelations, props.edgeId);
        props.showMenu()
      }
    

    return (
      <div className={classes.cardContainer}>
          <Card className={classes.root}>
            <CardHeader style={{ textAlign: 'center', paddingBottom: "0px" }} title="Relations">
                <p>hei</p>
            </CardHeader>
            <CardContent>
                {allRelations!=="" ? <p>{allRelations} realtions added <IconButton onClick={() => handleAddAllButtons("")}> <CloseIcon /></IconButton></p>  : <div>
                    <FormGroup>
                        {localRelations.map((element, index) => {
                            return( <div key={index}>
                                        <div className={classes.flexRow}>
                                            <div className={classes.flexColumn}>
                                                <FormControlLabel
                                                    control={<ArdoqThemedCheckbox className={classes.checkboxClass} checked={element.checkedIn} name="checkedIn" onChange={(e) => handleCheckboxChange(index, e)}></ArdoqThemedCheckbox>}
                                                    label="Inn"
                                                ></FormControlLabel>
                                                <FormControlLabel
                                                    control={<ArdoqThemedCheckbox checked={element.checkedOut} name="checkedOut" onChange={(e) => handleCheckboxChange(index, e)}></ArdoqThemedCheckbox>}
                                                    label="Out"
                                                ></FormControlLabel>
                                            </div>
                                            <div>
                                                <TextField className={classes.textFieldClass} value={element.text} name="text" variant="outlined" label="Name of relation" onChange={(e) => handleTextChange(index, e)}> </TextField>
                                            </div>
                                        </div>
                                        <hr></hr>
                                    </div>)
                        })} 
                        
                    </FormGroup >
                    
                    <IconButton onClick={() => addRealtion()}>
                        <AddIcon />
                    </IconButton>
                </div>}
                <br></br>  

                <div className={classes.flexRow}>
                    <div className={classes.flexColumn}>
                        <Button onClick={() => handleAddAllButtons("Inn")} className={classes.buttonClass} variant="contained" color="primary">Add all ingoing</Button>
                        <Button onClick={() => handleAddAllButtons("Out")} className={classes.buttonClass} variant="contained" color="primary">Add all outgoing</Button>
                    </div>
                    <div>
                        <Button onClick={() => handleAddAllButtons("Both")} className={classes.buttonClasslarge} variant="contained" color="primary">Add all </Button>
                    </div>
                </div>
                
                <br></br>

                <div className = {classes.saveButtonContainer}>
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

  const checkBoxStyles = theme => ({
    root: {
      '&$checked': {
        color: '#6DBCB4',
      },
    },
    checked: {},
   })

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
        margin: "10px"
    },

    textFieldClass: {
        marginTop: "15px"
    },


  });