import { SET_QUERY_ITEMS, APPEND_QUERY_ITEMS, RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS } from "../actions/types.js";
import { FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, ALL_PROPERTIES_OF_DATASET, VALUES_FOR_PROPERTY_IN_DATASET } from "../actions/QueryKeys.js";

const keys = [FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, ALL_PROPERTIES_OF_DATASET]
const initialState = {};
keys.map(key => initialState[key] = [])

const queryReducer = (state = initialState, action) => {
  let newState = null;

  switch (action.type) {

    // Resets the entire query state
    case RESET_ALL_QUERY_ITEMS:
      state = initialState
      return state
    
    // Resets result items in the dict with the given query key   
    case RESET_QUERY_ITEMS:
      // Redux good-practice requires us to make a copy of the state and return it, instead of modifying the state directly
      newState = JSON.parse(JSON.stringify(state))
      newState[action.queryKey] = []
      return newState;
    
    // Set the dict items to the query items, based on the queryKey
    case SET_QUERY_ITEMS:
      // Redux good-practice requires us to make a copy of the state and return it, instead of modifying the state directly
      newState = JSON.parse(JSON.stringify(state))
      
      // If we're setting the available labels, we sort the list alphabetically
      if(action.payload.queryKey == ALL_AVAILABLE_LABELS){
        action.payload.queryItems.sort()
      }

      // If we're setting the available properties, we sort the list alphabetically
      if(action.payload.queryKey == ALL_PROPERTIES_OF_DATASET){
        action.payload.queryItems.sort()
      }

      // If we're setting the available values of a property, we sort the list alphabetically, and with numbers sorted risingly
      if(action.payload.queryKey.includes(VALUES_FOR_PROPERTY_IN_DATASET)){
        action.payload.queryItems.sort(function(a, b) {
          if(!isNaN(a) && !isNaN(b)){
            return Number(a) - Number(b)
          }
          return (b.localeCompare("a")>=0)-(a.localeCompare("a")>=0) || a.localeCompare(b);
        });

      }

      newState[action.payload.queryKey] = action.payload.queryItems
      return newState;


    // Set the dict items to the query items, based on the queryKey
    case APPEND_QUERY_ITEMS:
      // Redux good-practice requires us to make a copy of the state and return it, instead of modifying the state directly
      newState = JSON.parse(JSON.stringify(state))

      newState[action.payload.queryKey].push(...action.payload.queryItems)
      
      // Sorts the list alphabetically with special characters last, and with numbers sorted risingly
      newState[action.payload.queryKey].sort(function(a, b) {
        if(!isNaN(a) && !isNaN(b)){
          return Number(a) - Number(b)
        }
        return (b.localeCompare("a")>=0)-(a.localeCompare("a")>=0) || a.localeCompare(b);
      });
      
      return newState;  
    
    // Default return
    default:
      return state;
  }
};

export default queryReducer;
