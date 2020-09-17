import React from 'react'
import PropTypes from 'prop-types'
import { AccordionDetails, AccordionSummary, Container, TablePagination, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { ExpandMore } from '@material-ui/icons';
import OutputListElement from './OutputListElement';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';


const useStyles = makeStyles({
    OutputListElementContainer: {
        paddingBottom: 10,
    }, 
    root: {
        maxHeight: "30%",
    }
});

export default function OutputAccordion(props) {
    const classes = useStyles();
    const pageCount = props.textList.length % 4 == 0 ? props.textList.length/4 : Math.floor(props.textList.length/4) + 1;
    return (
        <Accordion class={classes}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
            >
                <Typography>Output</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Container>
                    {props.textList.map((text) => 
                            <Container class={classes.OutputListElementContainer}>
                                <OutputListElement text={text}></OutputListElement>
                            </Container>)}
                    <Pagination count={pageCount}></Pagination>
                </Container>
            </AccordionDetails>
        </Accordion>
    );
}
