import {SET_ACTIVE_WINDOW} from "../actions/types.js";

const windowReducer = (state = '', action) => {
    switch(action.type){
        case SET_ACTIVE_WINDOW:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default windowReducer;