import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import { resetGremlinQuery, appendToGremlinQuery} from "../actions/GremlinQueryActions.js";
import { fetchQueryItems, resetQueryItems } from '../actions/QueryManagerActions.js';
import { resetPageNumber } from './../actions/OutputPageActions.js';
import { ALL_AVAILABLE_LABELS, FULL_RESULT_ITEMS } from './../actions/QueryKeys.js'
import { setInitialSearchParameter } from "./../actions/InitialSearchParameterActions"

export default function StartNodeInputField() {
  const dispatch = useDispatch();

  // Fetches all possible labels, to be used as auto-suggestions
  const allLabels = useSelector(state => state.allQueryResults[ALL_AVAILABLE_LABELS])
  
  // If the "Include All Categories" item has not already been added to the list, we add it
  if(!allLabels.includes("Include All Categories")){
    allLabels.unshift("Include All Categories")
  }

  // Passing an empty array as a second parameter to useEffect makes it run only on initial render of the web page.
  useEffect(() => {
    // Updates the list of all available labels
    dispatch(fetchQueryItems("g.V().label().dedup()", ALL_AVAILABLE_LABELS))
  }, [])

  return (
    <div style={{ width: '100%' }}>
        <Box display="flex" justifyContent="center" m={1} p={1}>
            <Autocomplete
                id="label-combo-box"
                options={allLabels}
                getOptionLabel={(option) => option}
                groupBy={(option) => option !== "Include All Categories" ? option.charAt(0) : ""}
                style={{ width: 300 }}
                onChange={(event, newInputValue) => {
                  
                  // Regardless of what the new input is, we reset the current query and results
                  dispatch(resetGremlinQuery())
                  dispatch(resetQueryItems(FULL_RESULT_ITEMS))
                  dispatch(resetPageNumber())
                  dispatch(setInitialSearchParameter(""))

                  // We update the gremlin query only if the new input is not null
                  if(newInputValue != null){
                    dispatch(setInitialSearchParameter(newInputValue))

                    // If the chosen label is "everything", we use the appropriate gremlin string
                    if(newInputValue !== "Include All Categories"){
                      dispatch(appendToGremlinQuery("g.V().hasLabel('" + newInputValue + "')"))
                    }
                    else{
                      dispatch(appendToGremlinQuery("g.V()"))
                    }
                  }
                }}
                
                renderInput={(params) => <TextField {...params} label="Filter by category" variant="outlined" />}
            />
        </Box>
    </div>
  );
}
