import { FETCH_FULL_RESULTS } from "./types.js";

// Redux actions.

export function setFullResults(gremlinQuery) {

  // Write fetch-code here


  
  return {
    results: "", // Set results here Torstein
    type: FETCH_FULL_RESULTS
  };
}
