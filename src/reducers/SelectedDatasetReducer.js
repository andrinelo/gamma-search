import { SET_SELECTED_DATASET, RESET_SELECTED_DATASET } from '../actions/types.js';

const SelectedDatasetReducer = (state = -1, action) => {
    switch(action.type){
        case SET_SELECTED_DATASET:
            state = action.value
            return state
        
        case RESET_SELECTED_DATASET:
          return -1;
        
        default: 
            return state;
    }
};

export default SelectedDatasetReducer;