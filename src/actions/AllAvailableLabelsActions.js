import { SET_ALL_AVAILABLE_LABELS } from './types.js';

// Add more items to the search result
export function setAllAvailableLabels(allLabels) {

  return {
    type: SET_ALL_AVAILABLE_LABELS,
    allLabels: allLabels.result.sort()
  };
}

// Asynchronous action creator using redux-thunk. Fetches new movies to add to
// the search-result based on the input parameters using createUrl and addResultitems
// defined above.
export function fetchAllAvailableLabels() {
  const gremlinQuery = "g.V().label().dedup()"

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
      dispatch(setAllAvailableLabels(results))
    }
    catch(error) {
      console.log("Could not fetch data: ", error)
    }
  }
};
