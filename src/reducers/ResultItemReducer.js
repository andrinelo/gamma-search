import { RESET_RESULT_ITEMS, ADD_RESULT_ITEMS } from "./../actions/types.js";

const initialState = [];

const resultItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_RESULT_ITEMS:
      return [];
    case ADD_RESULT_ITEMS:
      // Add the items at the end of the search result item list
      return [...state, ...action.payload.itemsToAdd];
      
    default:
      return state;
  }
};

export default resultItemReducer;
