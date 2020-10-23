import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Card, Collapse, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import {typography} from '@material-ui/system';

const shortTextCutoffIndex = 80;

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

export default function OutputListElement(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false)
    // Process values from props
    const values = props.values[0];
    const imageHyperlink = props.values[1];

    const handleClick = () => {
        setOpen(!open);
    };
    // Determine shortened display text for closed accordion
    let longText = "";
    for (const ele in values) {
        longText = longText + values[ele]["property"] + ": " + values[ele]["value"] + ", ";
    }
    const shortText = longText.substring(0, shortTextCutoffIndex) + "...";

    // Determine image url
    let imageURL = "";

    // Tries to fetch an image URL, if the node does not have an image we use the placeholder image
    if(imageHyperlink != null){
        imageURL = "https://app.ardoq.com" + imageHyperlink
    }
    else{
        imageURL = "/PlaceholderNodeImage.png"
    }

    return (
        <Card className = {classes.root}>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={shortText} />
                <ListItemIcon>
                    <img src={imageURL} height="100"></img>
                </ListItemIcon> 
                {open ? <ExpandLess/> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {values.map((element) => 
                    <Typography>
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