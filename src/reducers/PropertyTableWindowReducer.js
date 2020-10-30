import { SET_PROPERTY_TABLE_WINDOW_ACTIVE, SET_PROPERTY_TABLE_LATEST_FETCH_ID, SET_PROPERTY_TABLE_IS_FETCHING } from '../actions/types.js';


// Reducer for setting whether or not the 'property table' modal is open
export const PropertyTableWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_PROPERTY_TABLE_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

// Reducer for the ID of the latest fetch request in the property table
export const PropertyTableLatestFetchReducer = (state = '', action) => {
  switch(action.type){
      case SET_PROPERTY_TABLE_LATEST_FETCH_ID:
          state = action.value
          return state
      default: 
          return state;
  }
};

// Reducer for whether or not the property table is loading
export const PropertyTableLoadingReducer = (state = false, action) => {
  switch(action.type){
      case SET_PROPERTY_TABLE_IS_FETCHING:
          state = action.value
          return state
      
      default: 
          return state;
  }
};