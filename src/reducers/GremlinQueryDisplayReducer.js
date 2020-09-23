import { GET_GREMLIN_QUERY_DISPLAY_TEXT, SET_GREMLIN_QUERY_DISPLAY_TEXT} from '../actions/types.js'

export default (state = "g.V().hasLabel('Person')", action) => {
    switch (action.type) {
        case (SET_GREMLIN_QUERY_DISPLAY_TEXT):
            state = action.newText
            return state
        default:
            return state
    }
}