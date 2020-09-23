import { FETCH_FULL_RESULTS } from "./types.js";

// Redux actions.

export function fetchFullResults(gremlinQuery) {

  // Write fetch-code here

  // Alerts just to check that the gremlin query is correct. Delete this.
  alert(gremlinQuery)

  return {
    results: "", // Set results here Torstein
    type: FETCH_FULL_RESULTS
  };
}
