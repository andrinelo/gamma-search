import { SET_PROPERTY_TABLE_WINDOW_ACTIVE, SET_PROPERTY_TABLE_IS_FETCHING, SET_PROPERTY_TABLE_LATEST_FETCH_ID } from './types.js';

// Opens the property table modal
export function setPropertyTableWindowActive(active){
  return {
    type: SET_PROPERTY_TABLE_WINDOW_ACTIVE,
    value: active
  };
};


// Sets if property table is fetching/loading
export function setPropertyTableIsFetching(isFetching){
  return {
    type: SET_PROPERTY_TABLE_IS_FETCHING,
    value: isFetching,
  };
};


// Sets the ID of the latest property table fetch; to be used to dismiss/abort older fetches 
export function setPropertyTableFetchID(fetchID){
  return {
    type: SET_PROPERTY_TABLE_LATEST_FETCH_ID,
    value: fetchID
  };
};

