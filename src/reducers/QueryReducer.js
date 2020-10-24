import { SET_QUERY_ITEMS, APPEND_QUERY_ITEMS, RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS, DELETE_QUERY_ITEMS_BY_KEYS } from "../actions/types.js";

import { FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS, PROPERTY_TABLE_VALUES, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS, AGGREGATED_RESULT } from "../actions/QueryKeys.js";

const keys = [FULL_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, PROPERTY_TABLE_VALUES, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS, AGGREGATED_RESULT]

const initialState = {};
keys.map(key => initialState[key] = [])

const queryReducer = (state = initialState, action) => {
  let newState = null;

  switch (action.type) {

    // Resets the entire query state
    case RESET_ALL_QUERY_ITEMS:
      state = initialState
      return state

    // Deletes the elements defined by the list of keys
    case DELETE_QUERY_ITEMS_BY_KEYS:
      newState = JSON.parse(JSON.stringify(state))
      
      for(let i = 0; i < action.queryKeys.length; i++){
        if(newState.hasOwnProperty(action.queryKeys[i])){
          delete newState[action.queryKeys[i]]
        }
      }

      return newState  
    
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

      newState[action.payload.queryKey] = action.payload.queryItems
      
      sortResults(newState[action.payload.queryKey], action.payload.queryKey)
      
      return newState;


    // Set the dict items to the query items, based on the queryKey
    case APPEND_QUERY_ITEMS:
      // Redux good-practice requires us to make a copy of the state and return it, instead of modifying the state directly
      newState = JSON.parse(JSON.stringify(state))

      newState[action.payload.queryKey].push(...action.payload.queryItems)

      sortResults(newState[action.payload.queryKey], action.payload.queryKey)
      
      return newState;  
    
    // Default return
    default:
      return state;
  }
};

const sortResults = (resultItems, key) => {

  // If we're setting the available labels, we sort the list alphabetically
  if(key === ALL_AVAILABLE_LABELS){
    resultItems.sort()
  }

  // If we're setting the available properties, we sort the list alphabetically
  else if(key === DATASET_PROPERTIES_BEFORE_DATASET_FILTERS){
    resultItems.sort()
  }

  // If we're setting the available properties, we sort the list alphabetically
  else if(key === DATASET_PROPERTIES_AFTER_DATASET_FILTERS){
    resultItems.sort()
  }

  // If we're setting the available ingoing relations, we sort the list alphabetically
  else if(key === DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS){
    resultItems.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }
  
  // If we're setting the available outgoing relations, we sort the list alphabetically
  else if(key === DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS){
    resultItems.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }

  // If we're setting the available values of a property, we sort the list alphabetically, and with numbers placed last sorted risingly
  else if(key.includes(DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS)){
    resultItems.sort(function(a, b) {
      if(!isNaN(a) && !isNaN(b)){
        return Number(a) - Number(b)
      }
      else if(!isNaN(a) && isNaN(b)){
        return 1
      }
      else if(isNaN(a) && !isNaN(b)){
        return -1
      }
      return (b.localeCompare("a")>=0)-(a.localeCompare("a")>=0) || a.localeCompare(b);
    });
  }

}

export default queryReducer;
