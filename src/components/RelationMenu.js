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

import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';



function RelationMenu() {

    const ArdoqThemedCheckbox = withStyles(checkBoxStyles)(Checkbox);

    const classes = useStyles();

    const [relations, setRelations] = React.useState([
        {
            checkedIn: true,
            checkedOut: false,
            text: "hei",
        },
        {
            checkedIn: false,
            checkedOut: true,
            text: "hallo",
        },
    ]);

    const handleCheckboxChange = (index, event) => {
        let name =event.target.name
        relations[index][name] = event.target.checked
        setRelations([...relations])
        console.log(relations);
    }

    const handleTextChange = (index, event) => {
        let name =event.target.name
        relations[index][name] = event.target.value
        setRelations([...relations])
        console.log(relations);
    }


    const addRealtion = () => {
        relations.push({
            checkedIn: false,
            checkedOut: false,
            text: "",
        })
        setRelations([...relations])
        console.log(relations)
    }

    

    return (
      <div className={classes.cardContainer}>
          <p>RelationMenu</p>
          <Card className={classes.root}>
            <CardHeader style={{ textAlign: 'center', paddingBottom: "0px" }} title="Relations">
            </CardHeader>
            <CardContent>
                <FormGroup>
                    {relations.map((element, index) => {
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
                                            <TextField className={classes.textFieldClass} defaultValue={element.text} name="text" variant="outlined" label="Name of relation" onChange={(e) => handleTextChange(index, e)}> </TextField>
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