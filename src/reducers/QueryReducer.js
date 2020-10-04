import { SET_QUERY_ITEMS, RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS } from "../actions/types.js";
import { FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INTERNAL_EDGES_IN_INSPECTED_NODES } from "../actions/QueryKeys.js";

const keys = [FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INTERNAL_EDGES_IN_INSPECTED_NODES]
const initialState = {};
keys.map(key => initialState[key] = [])

const queryReducer = (state = initialState, action) => {
  switch (action.type) {

    // Resets the entire query state
    case RESET_ALL_QUERY_ITEMS:
      state = initialState
      return state
    
    // Resets result items in the dict with the given query key   
    case RESET_QUERY_ITEMS:
      state[action.queryKey] = []
      return state;
    
    // Set the dict items to the query items, based on the queryKey
    case SET_QUERY_ITEMS:
      
      // If we're setting the available labels, we sort the list alphabetically
      if(action.payload.queryKey == ALL_AVAILABLE_LABELS){
        action.payload.queryItems.sort()
      }

      state[action.payload.queryKey] = action.payload.queryItems
      return state;
    
    // Default return
    default:
      return state;
  }
};

export default queryReducer;
