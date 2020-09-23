import { FETCH_FULL_RESULTS} from '../actions/types.js'

export default (state = {}, action) => {
    switch (action.type) {
        case (FETCH_FULL_RESULTS):
            state = action.results
            return state
        default:
            return state
    }
}