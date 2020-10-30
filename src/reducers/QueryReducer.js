import { SET_QUERY_ITEMS, APPEND_QUERY_ITEMS, RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS, DELETE_QUERY_ITEMS_BY_KEYS } from "../actions/types.js";
import { PAGED_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, DATASET_PROPERTY_VALUES_BEFORE_DATASET_FILTERS, PROPERTY_TABLE_VALUES, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS, RESULT_FROM_AGGREGATION, AGGREGATE_PROPERTY_EXAMPLE_VALUE } from "../actions/QueryKeys.js";

const keys = [PAGED_RESULT_ITEMS, ALL_AVAILABLE_LABELS, INSPECTED_EDGES_IN_DATASET, INSPECTED_NODES_IN_DATASET, DATASET_PROPERTIES_BEFORE_DATASET_FILTERS, DATASET_PROPERTIES_AFTER_DATASET_FILTERS, PROPERTY_TABLE_VALUES, DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS, DATASET_OUTGOING_RELATIONS_AFTER_DATASET_FILTERS, RESULT_FROM_AGGREGATION, AGGREGATE_PROPERTY_EXAMPLE_VALUE]
keys.map(key => initialState[key] = [])

const initialState = {};

// Reducer for all types of queries towards the Ardoq API
const QueryReducer = (state = initialState, action) => {

  switch (action.type) {

    // Resets the entire query state
    case RESET_ALL_QUERY_ITEMS:
      state = initialState
      return state

    // Deletes the elements defined by the list of keys
    case DELETE_QUERY_ITEMS_BY_KEYS:
      for(let i = 0; i < action.queryKeys.length; i++){
        if(state.hasOwnProperty(action.queryKeys[i])){
          delete state[action.queryKeys[i]]
        }
      }

      return state  
    
    // Resets result items in the dict with the given query key   
    case RESET_QUERY_ITEMS:
      state[action.queryKey] = []
      return state;
    
    // Set the dict items to the query items, based on the queryKey
    case SET_QUERY_ITEMS:
      state[action.payload.queryKey] = action.payload.queryItems
      
      sortResults(state[action.payload.queryKey], action.payload.queryKey)
      
      return state;


    // Set the dict items to the query items, based on the queryKey
    case APPEND_QUERY_ITEMS:
      state[action.payload.queryKey].push(...action.payload.queryItems)

      sortResults(state[action.payload.queryKey], action.payload.queryKey)
      
      // For components to be able to detect a change, we need to return a new object
      state[action.payload.queryKey] = JSON.parse(JSON.stringify(state[action.payload.queryKey]))

      return state;  
    
    // Default return
    default:
      return state;
  }
};

// Used to sort the results in some way
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

  // If we're setting the available ingoing relations, we sort the list alphabetically, case-insensitive
  else if(key === DATASET_INGOING_RELATIONS_AFTER_DATASET_FILTERS){
    resultItems.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  }
  
  // If we're setting the available outgoing relations, we sort the list alphabetically, case-insensitive
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

export default QueryReducer;
