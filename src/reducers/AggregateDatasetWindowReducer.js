import { SET_AGGREGATE_WINDOW_ACTIVE } from '../actions/types.js';

// Reducer for setting whether or not the aggregate modal is open
const AggregateDatasetWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_AGGREGATE_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default AggregateDatasetWindowReducer;