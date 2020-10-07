import { SET_INSPECT_WINDOW_ACTIVE } from '../actions/types.js';

const InspectedNodeWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_INSPECT_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default InspectedNodeWindowReducer;