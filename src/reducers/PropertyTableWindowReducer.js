import { SET_PROPERTY_TABLE_WINDOW_ACTIVE, SET_PROPERTY_TABLE_LATEST_FETCH_ID, SET_PROPERTY_TABLE_IS_FETCHING } from '../actions/types.js';

export const PropertyTableWindowReducer = (state = false, action) => {
    switch(action.type){
        case SET_PROPERTY_TABLE_WINDOW_ACTIVE:
            state = action.value
            return state
        default: 
            return state;
    }
};

export const PropertyTableLatestFetchReducer = (state = '', action) => {
  switch(action.type){
      case SET_PROPERTY_TABLE_LATEST_FETCH_ID:
          state = action.value
          return state
      default: 
          return state;
  }
};

export const PropertyTableLoadingReducer = (state = false, action) => {
  switch(action.type){
      case SET_PROPERTY_TABLE_IS_FETCHING:
          state = action.value
          return state
      
      default: 
          return state;
  }
};