import React, { useState, useEffect } from 'react'
import { AccordionDetails, AccordionSummary, Container, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import { ExpandMore } from '@material-ui/icons';
import OutputListElement from './OutputListElement';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector, useDispatch } from 'react-redux'
import { PAGED_RESULT_ITEMS, DATASET_NODE_COUNT } from './../actions/QueryKeys.js'
import { fetchQueryItems } from '../actions/QueryManagerActions.js';

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
  const dispatch = useDispatch()
  const classes = useStyles()

  const [currentPage, setCurrentPage] = useState(1)

  // The amount of different datasets
  const numberOfDatasets = Math.floor(useSelector(store => store.gremlinQueryParts).length / 2)
  
  // Retrieve the size of the current results
  const resultItemsCount = useSelector(state => state.allQueryResults[DATASET_NODE_COUNT + (numberOfDatasets-1)])
  
  // Retrieve the subset of the result items, which will be displayed
  const pagedResultItems = useSelector(state => state.allQueryResults[PAGED_RESULT_ITEMS])
  
  
  // Full current gremlin query
  const fullGremlinQuery = useSelector(store => store.gremlinQueryParts.join(""))

  // Parse the subset of the list
  const showList = pagedResultItems.map(item => OutputJSONParser(item));
  
  // Find image urls for image display
  const imageURLList = pagedResultItems.map(item => GetUrl(item));
  
  // Twin together the lists
  const dataImageList = [];
  for (let i0 = 0; i0 < imageURLList.length; i0++) {
      dataImageList.push([showList[i0], imageURLList[i0]]);
  }
  
  // Determine page count
  const pageCount = Math.ceil(resultItemsCount/outputsPerPage);
  
  // Resets the current page to 1 whenever the query changes, and fetches the new results
  useEffect(() => {
    setCurrentPage(1)
    fetchPagedResultItems(1)
  //eslint-disable-next-line
  }, [fullGremlinQuery])

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchPagedResultItems(value)
  };
  
  // Fetches the nodes corresponding to current gremlin query and page
  const fetchPagedResultItems = (page) => {
    const gremlinQueryNodes = fullGremlinQuery + ".dedup().range(" + (page - 1)*outputsPerPage + ", " + page*outputsPerPage + ")"
    dispatch(fetchQueryItems(gremlinQueryNodes, PAGED_RESULT_ITEMS))
  }

  return (
      <Accordion style={{width: "50vw", margin: "auto", backgroundColor: "#F8F8F8"}}>
          <AccordionSummary
              expandIcon={<ExpandMore/>}
          >
              <Typography>View nodes in dataset {numberOfDatasets}</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Container>
                  {dataImageList.map((values, index) => // Map images too
                    <Container key={index} className={classes.OutputListElementContainer}>
                        <OutputListElement values={values} ></OutputListElement>
                    </Container>)}
                    <Pagination style={{display: 'flex', justifyContent: 'center', userSelect: 'none'}} count={pageCount} page={currentPage} siblingCount={1} onChange={handlePageChange} />
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
            if (property !== "name") { // Name property already added
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
    
  // If in production we use our proxy set on the nginx server
  const imageURLPrefix = process.env.NODE_ENV === 'production' ? "/ardoq" : ""

  if ("properties" in inputJSON && "image" in inputJSON["properties"]) {
    if (0 in inputJSON["properties"]["image"]) { // List containing a tuple
        return imageURLPrefix + inputJSON["properties"]["image"][0]["value"];
    }
    else if ("value" in inputJSON["properties"]["image"]) { // and if property value array contains field "value"
        return imageURLPrefix + inputJSON["properties"]["image"]["value"];
    }
    else {
        return imageURLPrefix + inputJSON["properties"]["image"]
    }
  }
  return null   
}