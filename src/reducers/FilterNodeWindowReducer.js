import { SET_FILTER_WINDOW_ACTIVE } from '../actions/types.js';

const FilterNodeWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_FILTER_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default FilterNodeWindowReducer;