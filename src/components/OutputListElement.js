import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Card, Collapse, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

const shortTextCutoffIndex = 60;

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

// Component containing a single node-result
export default function OutputListElement(props) {
    const classes = useStyles();

    // Whether or not the accordion is open
    const [open, setOpen] = React.useState(false)

    // Process values from props
    const values = props.values[0];
    const imageHyperlink = props.values[1];

    // Fired whenever the user clicks on this accordion
    const handleClick = () => {
        setOpen(!open);
    };
    
    // Determine shortened display text for closed accordion
    let longText = values.filter(value => value["property"] === 'name')[0]['value'] + " (" + values.filter(value => value["property"] === 'label')[0]['value'] + ")"
    const shortText = longText.length > shortTextCutoffIndex ? <b>{longText.substring(0, shortTextCutoffIndex) + "..."}</b> : <b>{longText}</b>

    // Determine image url
    let imageURL = "";

    // Tries to fetch an image URL, if the node does not have an image we use the placeholder image
    if(imageHyperlink != null){
        imageURL = imageHyperlink
    }
    else{
        imageURL = "/PlaceholderNodeImage.png"
    }

    return (
        <Card className = {classes.root}>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={shortText} />
                <ListItemIcon>
                    <img src={imageURL} height="100" alt=""></img>
                </ListItemIcon> 
                {open ? <ExpandLess/> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit style={{padding: "15px"}}>
                {values.map((element, index) => 
                    <Typography key={index}>
                        <b>{element.property}</b>: {element.value}
                    </Typography>
                )}
            </Collapse>
        </Card>
    );
}

OutputListElement.propTypes = {
    values: PropTypes.array.isRequired,
}