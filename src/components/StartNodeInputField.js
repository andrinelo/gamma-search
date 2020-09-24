import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import setInitialSearchParameter from "../actions/InitialSearchParameterAction.js";



function updateInitialSearchParameter(dispatch, searchParameterType, searchParameterValue) {
  dispatch(
    setInitialSearchParameter(
      searchParameterType,
      searchParameterValue
    )
  );
}


// Labels the user can choose as a "start node"
const availableLabels = [
  { labelName: 'Person' },
  { labelName: 'Software' },
  { labelName: 'Computer' },
];


export default function StartNodeInputField() {
  const dispatch = useDispatch();

  return (
    <div style={{ width: '100%' }}>
        <Box display="flex" justifyContent="center" m={1} p={1}>
            <Autocomplete
                id="label-combo-box"
                options={availableLabels}
                getOptionLabel={(option) => option.labelName}
                style={{ width: 300 }}
                onChange={(event, newInputValue) => {
                    updateInitialSearchParameter(dispatch, "label", newInputValue);
                }}
                renderInput={(params) => <TextField {...params} label="Filtrer etter kategori" variant="outlined" />}
            />
        </Box>
    </div>
  );
}
