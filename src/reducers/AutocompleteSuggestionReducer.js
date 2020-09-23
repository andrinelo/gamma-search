import { SET_AUTOCOMPLETE_OPTIONS } from '../actions/types.js'



export default (state = {"testData1":[{text: "Apple"}, {text: "Banana"},
                         {text: "Citrus"}, {text: "Dynosys"}, {text: "E"}, {text: "Frankriket"}, 
                        {text: "God mat"}, {text: "Helse"}, {text: "Ikke"}]}, action) => {
    switch (action.type) {
        case (SET_AUTOCOMPLETE_OPTIONS):
            state[action.id] = action.options
            return state
        default:
            return state
    }
}