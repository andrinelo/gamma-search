import { RESET_RESULT_ITEMS , ADD_RESULT_ITEMS } from './types.js';

// Empties the state
export function resetResultItems() {
  return {
    type: RESET_RESULT_ITEMS
  };
}

// Add more items to the search result
export function addResultItems(resultItems) {

  return {
    type: ADD_RESULT_ITEMS,
    payload: {
      itemsToAdd: resultItems.result
    }
  };
}

// Asynchronous action creator using redux-thunk. Fetches new items to add to
// the search-result
export function fetchResultItems(gremlinQuery) {

  return async function(dispatch) {
    try {
      let correctData = JSON.stringify({"query": gremlinQuery})
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
      dispatch(addResultItems(results))
    }
    catch(error) {
      console.log("Could not fetch data: ", error)
    }
  }
};
