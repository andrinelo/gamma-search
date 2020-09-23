import React from 'react'
import { AccordionDetails, AccordionSummary, Container, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useSelector } from 'react-redux';
import GremlinQueryDisplayReducer from '../reducers/GremlinQueryDisplayReducer';

const useStyles = makeStyles({
    root: {
        maxHeight: "30%",
        maxWidth: "100%",
    },
    text: {
        wordbreak: 'break-all',
        wordWrap: 'break-word',
        overflow: 'auto',
    }
});

export default function GremlinQueryDisplayAccordion(props) {
    const displayText = useSelector(state => state.GremlinQueryDisplayReducer)
    const classes = useStyles();
    return (
        <Accordion class={classes.root}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
            >
                <Typography>Gremlin Query</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <p class={classes.text}>
                    {displayText}
                </p>
            </AccordionDetails>
        </Accordion>
    );
}