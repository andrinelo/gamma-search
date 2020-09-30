import { SET_INITIAL_SEARCH_PARAMETER } from './types.js'

export function setInitialSearchParameter(searchParameter) {
    return {
        value: searchParameter,
        type: SET_INITIAL_SEARCH_PARAMETER
    }
}