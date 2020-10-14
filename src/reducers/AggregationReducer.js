import {SET_AGGREGATION} from "./../actions/types.js";

const aggregationReducer = (state={}, action) => {
    switch(action.type){
        case SET_AGGREGATION:
            let aggregation = {...state, [action.cloudId]: action.value}
            return aggregation;
        default:
            return state;
    }
};

export default aggregationReducer;