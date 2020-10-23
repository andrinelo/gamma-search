import { SET_INITIAL_SEARCH_PARAMETER } from '../actions/types.js'

export default (state = "", action) => {
    switch (action.type) {
        case (SET_INITIAL_SEARCH_PARAMETER):
            state = action.value
            return state
        default:
            return state
    }
}