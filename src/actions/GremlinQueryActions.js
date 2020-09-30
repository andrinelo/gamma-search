import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY } from './types.js';

// Action used to reset the gremlin query
export function resetGremlinQuery() {
  return {
    query: [],
    type: RESET_CURRENT_GREMLIN_QUERY
  };
}


// Action used to append to the current gremlin query
export function appendToGremlinQuery(gremlinQueryPart) {
  return {
    queryPart: gremlinQueryPart,
    type: APPEND_TO_CURRENT_GREMLIN_QUERY
  };
}