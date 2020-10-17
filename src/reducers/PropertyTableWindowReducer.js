import { SET_PROPERTY_TABLE_WINDOW_ACTIVE } from '../actions/types.js';

const PropertyTableWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_PROPERTY_TABLE_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default PropertyTableWindowReducer;