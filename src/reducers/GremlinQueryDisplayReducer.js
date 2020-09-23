import { GET_GREMLIN_QUERY_DISPLAY_TEXT, SET_GREMLIN_QUERY_DISPLAY_TEXT} from '../actions/types.js'

export default (state = '{"query": "g.V().limit(10)"}', action) => {
    switch (action.type) {
        case (SET_GREMLIN_QUERY_DISPLAY_TEXT):
            state = action.newText
            return state
        default:
            return state
    }
}