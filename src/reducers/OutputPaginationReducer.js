import {OUTPUT_NEXT_PAGE, OUTPUT_PREVIOUS_PAGE} from '../actions/types'

export default (state = 0, action) => {
    switch (action.type) {
        case (OUTPUT_PREVIOUS_PAGE):
            return Math.max(0, state-1)
        case (OUTPUT_NEXT_PAGE):
            return state + 1
        default:
            return state
    }
}

/* 
const initialState = 1;

// Keeps track of the current page; and has functionality for reseting the page and increasing the page number
const outputPaginationReducer = (state=initialState, action) => {
    switch(action.type){
        case (OUTPUT_PREVIOUS_PAGE):
            return Math.max(0, state-1)
        case (OUTPUT_NEXT_PAGE):
            return state + 1
        default:
            return state
    }
};

export default outputPaginationReducer;
 */