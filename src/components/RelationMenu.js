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

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import AddIcon from '@material-ui/icons/Add';

import IconButton from '@material-ui/core/IconButton';

function RelationMenu() {
    const classes = useStyles();

    const [checkedState, setCheckedState] = React.useState({
        checkedIn: true,
        checkedOut: false
    });

    const [relations, setRelations] = React.useState([
        {
            checkedIn: true,
            checkedOut: false,
            text: "heisann",
        },

    ]);

    const handleChange = (event) => {
        console.log("changed State")
        setCheckedState({...checkedState, [event.target.name]: event.target.checked})
    }

    const handleChange2 = (index, event) => {

        let name =event.target.name
        //setRelations({...relations, [[index][name]]: event.target.checked})
        setRelations([...relations])
        console.log(relations);
        relations[index][name] = event.target.checked
    }

    const addRealtion = () => {
        relations.push({
            checkedIn: false,
            checkedOut: false,
            text: "heisann",
        })
        console.log(relations)
        setRelations([...relations])
    }

    

    return (
      <div className={classes.cardContainer}>
          <p>RelationMenu</p>
          <Card className={classes.root}>
            <CardHeader title="Realtions">
            </CardHeader>
            <CardContent>
                <FormGroup>
                    {relations.map((element, index) => {
                        return( <div key={index}>
                                    <div className={classes.flexRow}>
                                        <div className={classes.flexColumn}>
                                            <FormControlLabel
                                                control={<Checkbox  className={classes.checkboxClass} checked={element.checkedIn} name="checkedIn" onChange={(e) => handleChange2(index, e)}></Checkbox>}
                                                label="Inn"
                                            ></FormControlLabel>
                                            <FormControlLabel
                                                control={<Checkbox checked={element.checkedOut} name="checkedOut" onChange={(e) => handleChange2(index, e)}></Checkbox>}
                                                label="Out"
                                            ></FormControlLabel>
                                        </div>
                                        <div>
                                            <TextField className={classes.textFieldClass} variant="outlined" id="relationName" label="Name of relation"> </TextField>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </div>)
                    })}

                </FormGroup >

                <IconButton onClick={() => addRealtion()}>
                    <AddIcon />
                </IconButton>

                <br></br>  

                <div className={classes.flexRow}>
                    <div className={classes.flexColumn}>
                        <Button className={classes.buttonClass} variant="contained" color="primary">Add all ingoing</Button>
                        <Button className={classes.buttonClass} variant="contained" color="primary">Add all outgoing</Button>
                    </div>
                    <div>
                        <Button className={classes.buttonClasslarge} variant="contained" color="primary">Add all </Button>
                    </div>
                </div>
               
                
                
            </CardContent>
          </Card>
      </div>
    );
  }
  
  export default RelationMenu;

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

    checkboxClass: {
        color: "#6DBCB4",
        '&$checked': {
            color: "#6DBCB4",
          },
    }

  });