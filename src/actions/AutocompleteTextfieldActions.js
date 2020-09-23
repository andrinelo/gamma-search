import { SET_AUTOCOMPLETE_OPTIONS } from './types.js'

export function setAutocompleteOptions(id, options) {
    return {
        id: id,
        options: options,
        type: SET_AUTOCOMPLETE_OPTIONS
    }
}
