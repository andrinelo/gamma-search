import React from 'react'
import { AccordionDetails, AccordionSummary, Container, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { ExpandMore } from '@material-ui/icons';
import OutputListElement from './OutputListElement';
import { makeStyles } from '@material-ui/core/styles';
import OutputPaginator from './OutputPaginator'
import { useSelector } from 'react-redux'

const useStyles = makeStyles({
    OutputListElementContainer: {
        paddingBottom: 10,
    }, 
    root: {
        maxHeight: "30%",
    }
});

const outputsPerPage = 4
export default function OutputAccordion(props) {
    const indexValue = useSelector(state => state.OutputPaginationReducer)
    const classes = useStyles();
    const showList = props.textList.slice(indexValue*outputsPerPage, Math.min(indexValue*outputsPerPage + outputsPerPage, props.textList.length+1))
    const pageCount = props.textList.length % outputsPerPage == 0 ? props.textList.length/outputsPerPage : Math.floor(props.textList.length/outputsPerPage) + 1;
    return (
        <Accordion class={classes}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
            >
                <Typography>Output</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Container>
                    {showList.map((text) => 
                            <Container class={classes.OutputListElementContainer}>
                                <OutputListElement text={text}></OutputListElement>
                            </Container>)}
                    <OutputPaginator pageCount={pageCount}></OutputPaginator>
                </Container>
            </AccordionDetails>
        </Accordion>
    );
}