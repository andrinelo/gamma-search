import { SET_NODE_TO_INSPECT } from '../actions/types.js';

const ActiveInspectedNodeReducer = (state = -1, action) => {
    switch(action.type){
        case SET_NODE_TO_INSPECT:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default ActiveInspectedNodeReducer;