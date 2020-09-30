import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import { resetGremlinQuery, appendToGremlinQuery} from "../actions/GremlinQueryActions.js";
import useQuery from '../queryManager';
import { resetResultItems } from './../actions/ResultItemActions.js';
import { fetchAllAvailableLabels } from './../actions/AllAvailableLabelsActions.js';
import { resetPageNumber } from './../actions/OutputPageActions.js';


export default function StartNodeInputField() {
  const dispatch = useDispatch();

  // Fetches all possible labels, to be used as auto-suggestions
  const allLabels = useSelector(state => state.allAvailableLabels)

  // Passing an empty array as a second parameter to useEffect makes it run only on initial render of the web page.
  useEffect(() => {
    // Updates the list of all available labels
    dispatch(fetchAllAvailableLabels())
  }, [])

  return (
    <div style={{ width: '100%' }}>
        <Box display="flex" justifyContent="center" m={1} p={1}>
            <Autocomplete
                id="label-combo-box"
                options={allLabels}
                getOptionLabel={(option) => option}
                style={{ width: 300 }}
                onChange={(event, newInputValue) => {
                  
                  // Regardless of what the new input is, we reset the current query and results
                  dispatch(resetGremlinQuery())
                  dispatch(resetResultItems())
                  dispatch(resetPageNumber())

                  // We update the gremlin query only if the new input is not null
                  if(newInputValue != null){
                    dispatch(appendToGremlinQuery("g.V().hasLabel('" + newInputValue + "')"))
                  }
                }}
                
                renderInput={(params) => <TextField {...params} label="Filter by category" variant="outlined" />}
            />
        </Box>
    </div>
  );
}
