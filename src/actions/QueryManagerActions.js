import { RESET_QUERY_ITEMS, RESET_ALL_QUERY_ITEMS, SET_QUERY_ITEMS, APPEND_QUERY_ITEMS, DELETE_QUERY_ITEMS_BY_KEY } from './types.js';

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
export function deleteQueryItemsByKey(key) {
  return {
    type: DELETE_QUERY_ITEMS_BY_KEY,
    queryKey: key
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
export function fetchQueryItems(gremlinQuery, key, start=-1) {

  return async function(dispatch) {
    try {

      // Adds the range to the gremlin query if start has been set to above or equal to 0
      let correctData = JSON.stringify({"query": start < 0 ? gremlinQuery : gremlinQuery + ".range(" + start + ", " + (start + 1000) + ")"})
      
      const response = await fetch('http://localhost:3000/api', {
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
      
      // When we limit the results to 1000 elements
      if(start <= 0){
        dispatch(setQueryItems(results, key))
      }
      else{
        dispatch(appendQueryItems(results, key))
      }

      // We fetch the complete results in intervals of 1000 elements
      if(start >= 0 && results.result.length === 1000){
        dispatch(fetchQueryItems(gremlinQuery, key, start + 1000))
      }
    }
    catch(error) {
      console.log("Could not fetch data: ", error)
    }
  }
};
