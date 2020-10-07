import { SET_SELECTED_NODE, RESET_SELECTED_NODE } from '../actions/types.js';

const SelectedNodeReducer = (state = -1, action) => {
    switch(action.type){
        case SET_SELECTED_NODE:
            state = action.value
            return state
        
        case RESET_SELECTED_NODE:
          return -1;
        
        default: 
            return state;
    }
};

export default SelectedNodeReducer;