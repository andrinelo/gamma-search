import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import PropTypes from 'prop-types'

// Generic autocomplete text field. 
export default function AutocompleteTextField(props) {
    const dispatch = useDispatch()
    const id = props.id
    const allowedSolutions = useSelector(state => state.autoComplete[id])
    return <Autocomplete
            id = {id}
            options={allowedSolutions}
            getOptionLabel={(option) => option.text}
            noOptionsText="No matching entries"
            onChange={(event, value) => dispatch(props.onChange(value))}
            renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.displayText}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            ></Autocomplete>
}

AutocompleteTextField.propTypes = {
    displayText: PropTypes.string.isRequired, // The label of the text input
    id: PropTypes.string.isRequired, // The id of the component + used for filtering autocomplete. 
    onChange: PropTypes.func // Function dispatched when text field entry is completed
}