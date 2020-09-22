import {SET_ACTIVE_WINDOW} from "../actions/types.js";

const windowReducer = (state = '', action) => {
    switch(action.type){
        case SET_ACTIVE_WINDOW:
            return Object.assign({}, state, {
                windowType: action.windowType
            })
        default: 
            return state;
    }
};

export default windowReducer;