import { RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS, SET_QUERY_ITEMS, APPEND_QUERY_ITEMS, DELETE_QUERY_ITEMS_BY_KEYS } from './types.js';

import { PROPERTY_TABLE_VALUES } from './QueryKeys'
import { setPropertyTableIsFetching } from './PropertyTableWindowActions'

import store from '../app/store.js';

// Empties the query state
export function resetAllQueryItems() {
  return {
    type: RESET_ALL_QUERY_ITEMS,
  };
}

// Empties the state, based on the queryKey
export function resetQueryItems(key) {
  return {
    type: RESET_QUERY_ITEMS,
    queryKey: key
  };
}

// Deletes the state, based on the queryKey
export function deleteQueryItemsByKeys(keys) {
  return {
    type: DELETE_QUERY_ITEMS_BY_KEYS,
    queryKeys: keys
  };
}

// Add more items to the search result
export function setQueryItems(items, key) {

  return {
    type: SET_QUERY_ITEMS,
    payload: {
      queryItems: items.result,
      queryKey: key
    }
  };
}

// Add more items to the search result
export function appendQueryItems(items, key) {

  return {
    type: APPEND_QUERY_ITEMS,
    payload: {
      queryItems: items.result,
      queryKey: key
    }
  };
}

// Asynchronous action creator using redux-thunk. Fetches new items to add to
// the search-result. Normally returns max 1000 elements, but if parameter 'start'
// is set to something above or equal to 0, we get all the elements.
export function fetchQueryItems(gremlinQuery, key, start=-1, fetchID=null) {

  return async function(dispatch) {
    try {
      
      // PROPERTY TABLE: If we're trying to fetch table values for the property table, we only start fetching if
      // this fetch is the latest property table value fetch
      if(key === PROPERTY_TABLE_VALUES){
        if(store.getState().propertyTableLatestFetchID === fetchID){
          dispatch(setPropertyTableIsFetching(true))
        }
        else{
          return
        }
      }

      // Adds the range to the gremlin query if start has been set to above or equal to 0
      let correctData = JSON.stringify({"query": start < 0 ? gremlinQuery : gremlinQuery + ".range(" + start + ", " + (start + 1000) + ")"})

      const API_URL = process.env.NODE_ENV === 'production' ? "/ardoq/api/graph-search?org=tdt42902019" : "/api/graph-search?org=tdt42902019"

      const response = await fetch(API_URL, {
        method: 'POST',                                             // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',                                               // no-cors, *cors, same-origin
        cache: 'no-cache',                                          // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',                                 // include, *same-origin, omit
        headers: {
          'Authorization': 'Token token=5025706857394e28ab294f1bd8c482cb',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        redirect: 'follow',                                         // manual, *follow, error
        referrerPolicy: 'no-referrer',                              // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: correctData                                  // body data type must match "Content-Type" header
      });

      const results = await response.json()
      
      // WE SET RESULTLIST
      if(start <= 0){
        
        // PROPERTY TABLE: If we're fetching values for the property table, we only add them if this is the most up-to-date fetch
        if(key === PROPERTY_TABLE_VALUES){
          if(store.getState().propertyTableLatestFetchID === fetchID){
            dispatch(setQueryItems(results, key))
            
            // Set loading to false
            dispatch(setPropertyTableIsFetching(false))
          }
          else{
            return
          }
        }

        // EVERYTHING ELSE
        else{
          dispatch(setQueryItems(results, key))
        }

      }

      // WE APPEND TO ITEMLIST
      else{

        // PROPERTY TABLE: If we're fetching values for the property table, we only add them if this is the most up-to-date fetch
        if(key === PROPERTY_TABLE_VALUES){
          if(store.getState().propertyTableLatestFetchID === fetchID){
            dispatch(appendQueryItems(results, key))
          }
          else{
            return
          }
        }

        // EVERYTHING ELSE
        else{
          dispatch(appendQueryItems(results, key))
        }

      }

      // We recursively fetch the complete results in intervals of 1000 elements
      if(start >= 0 && results.result.length === 1000){
        dispatch(fetchQueryItems(gremlinQuery, key, start + 1000, fetchID))
      }

      else{
        if(key === PROPERTY_TABLE_VALUES && store.getState().propertyTableLatestFetchID === fetchID){
          // Set the loading to false
          dispatch(setPropertyTableIsFetching(false))
        }
      }

    }
    catch(error) {
      console.log("Could not fetch data: ", error)

      // If we're trying to fetch table values for the property table, we decrease the fetch queue after fetch
      if(key === PROPERTY_TABLE_VALUES && store.getState().propertyTableLatestFetchID === fetchID){
        dispatch(setPropertyTableIsFetching(false))
      }
    }
  }
};
