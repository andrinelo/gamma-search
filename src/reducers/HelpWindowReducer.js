import { SET_HELP_WINDOW_ACTIVE } from '../actions/types.js';

// Reducer for setting whether or not the help modal is open
const HelpWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_HELP_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export default HelpWindowReducer;