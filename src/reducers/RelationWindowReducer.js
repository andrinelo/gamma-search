import { SET_RELATION_WINDOW_ACTIVE } from '../actions/types.js';

const RelationWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_RELATION_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default RelationWindowReducer;