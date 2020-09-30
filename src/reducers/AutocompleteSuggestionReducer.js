import { SET_AUTOCOMPLETE_OPTIONS, AUTOCOMPLETE_SET_DEBUG } from '../actions/types.js'

export default (state = {"testData1":[{text: "Apple"}, {text: "Banana"},
                         {text: "Citrus"}, {text: "Dynosys"}, {text: "E"}, {text: "Frankriket"}, 
                        {text: "God mat"}, {text: "Helse"}, {text: "Ikke"}]}, action) => {
    switch (action.type) {
        case (SET_AUTOCOMPLETE_OPTIONS):
            state[action.id] = action.options
            return state
        case (AUTOCOMPLETE_SET_DEBUG): // To check that function dispatching passed through props works
            console.log(action.debugText)
            return state
        default:
            return state
    }
}