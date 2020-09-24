import { SET_AUTOCOMPLETE_OPTIONS, AUTOCOMPLETE_SET_DEBUG } from './types.js'

export function setAutocompleteOptions(id, options) {
    return {
        id: id,
        options: options,
        type: SET_AUTOCOMPLETE_OPTIONS
    }
}

export function autocompleteDebug(debugText) {
    return {
        type: AUTOCOMPLETE_SET_DEBUG,
        debugText: debugText
    }
}
