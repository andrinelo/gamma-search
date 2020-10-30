import { SET_INSPECT_WINDOW_ACTIVE } from '../actions/types.js';

// Reducer for setting whether or not the 'inspect dataset' modal is open
const InspectedDatasetWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_INSPECT_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default InspectedDatasetWindowReducer;