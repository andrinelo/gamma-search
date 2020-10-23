import React from 'react'
import { AccordionDetails, AccordionSummary, Container, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { ExpandMore } from '@material-ui/icons';
import OutputListElement from './OutputListElement';
import { makeStyles } from '@material-ui/core/styles';
import OutputPaginator from './OutputPaginator'
import { useSelector } from 'react-redux'
import { FULL_RESULT_ITEMS } from './../actions/QueryKeys.js'

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
    const indexValue = useSelector(state => state.currentOutputPage);
    const textList = useSelector(state => state.allQueryResults[FULL_RESULT_ITEMS]);
    const classes = useStyles();
    // Find the subset of the list that will be displayed
    const shortenedList = textList.slice(indexValue*outputsPerPage, Math.min(indexValue*outputsPerPage + outputsPerPage, textList.length+1));
    // Parse the subset of the list
    const showList = shortenedList.map(item => OutputJSONParser(item));
    // Find image urls for image display
    const imageURLList = shortenedList.map(item => GetUrl(item));
    // Twin together the lists
    const dataImageList = [];
    for (let i0 = 0; i0 < imageURLList.length; i0++) {
        dataImageList.push([showList[i0], imageURLList[i0]]);
    }
    // Determine page count
    const pageCount = textList.length % outputsPerPage == 0 ? textList.length/outputsPerPage : Math.floor(textList.length/outputsPerPage);
    return (
        <Accordion class={classes}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
            >
                <Typography>Output</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Container>
                    {dataImageList.map((values) => // Map images too
                            <Container class={classes.OutputListElementContainer}>
                                <OutputListElement values={values} ></OutputListElement>
                            </Container>)}
                    <OutputPaginator pageCount={pageCount}></OutputPaginator>
                </Container>
            </AccordionDetails>
        </Accordion>
    );
}


function OutputJSONParser(inputJSON) {
    const toReturn = [];
    if ("properties" in inputJSON && "label" in inputJSON) { // If this is not the case toReturn is empty
        toReturn.push({"property":"label", "value":inputJSON["label"]}); // Start by adding label to the front
        if ("name" in inputJSON["properties"]) { 
            if (Array.isArray(inputJSON["properties"]["name"])) { // if name is a tuple (id, string)
                if (0 in inputJSON["properties"]["name"]) { // List containing a tuple
                    toReturn.push({"property":"name", "value":inputJSON["properties"]["name"][0]["value"]})
                }
                else if ("value" in inputJSON["properties"]["name"]) { 
                    toReturn.push({"property":"name", "value":inputJSON["properties"]["name"]["value"]})
                }
            }
            else { 
                toReturn.push({"property":"name", "value":inputJSON["properties"]["name"]}); // If there is a name property add it to the front
            }
        }
        if ("id" in inputJSON) {
            toReturn.push({"property":"id", "value":inputJSON["id"]});
        }
        for (const property in inputJSON["properties"]) { // for all the properties possible
            if (property != "name") { // Name property already added
                if (Array.isArray(inputJSON["properties"][property])) { // If property value is formated as an array
                    if (0 in inputJSON["properties"][property]) { // List containing a tuple
                        toReturn.push({"property":property, "value":inputJSON["properties"][property][0]["value"]});
                    }
                    else if ("value" in inputJSON["properties"][property]) { // and if property value array contains field "value"
                        toReturn.push({"property":property, "value":inputJSON["properties"][property]["value"]});
                    }
                }
                else { //Else the value is easily accessible
                toReturn.push({"property":property, "value":inputJSON["properties"][property]});
                }
            }
        }
    }
    return toReturn;
  }

  function GetUrl(inputJSON) {
      if ("properties" in inputJSON && "image" in inputJSON["properties"]) {
        if (0 in inputJSON["properties"]["image"]) { // List containing a tuple
            return inputJSON["properties"]["image"][0]["value"];
        }
        else if ("value" in inputJSON["properties"]["image"]) { // and if property value array contains field "value"
            return inputJSON["properties"]["image"]["value"];
        }
        else {
            return inputJSON["properties"]["image"]
        }
      }
      return null   
  }