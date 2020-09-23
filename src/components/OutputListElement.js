import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { Card, Collapse, Container, ListItem, ListItemText, Typography } from '@material-ui/core';
const shortTextCutoffIndex = 35;

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
});

export default function OutputListElement(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false)

    const handleClick = () => {
        setOpen(!open);
    };

    const shortText = props.text.substring(0, shortTextCutoffIndex) + "...";
    return (
        <Card className = {classes.root}>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={shortText} />
                {open ? <ExpandLess/> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Typography>
                        {props.text}
                </Typography>
            </Collapse>
        </Card>
    );
}

OutputListElement.propTypes = {
    text: PropTypes.string.isRequired
}