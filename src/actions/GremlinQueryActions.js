import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY, APPEND_TO_GREMLIN_QUERY_STEP, SET_GREMLIN_QUERY_STEP, REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX } from './types.js';

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

// Action used to append to the current gremlin query step
export function appendToGremlinQueryStep(gremlinQueryPart) {
  return {
    queryPart: gremlinQueryPart,
    type: APPEND_TO_GREMLIN_QUERY_STEP
  };
}

// Action used to set the gremlin query step by index
export function setGremlinQueryStep(gremlinQueryPart, index) {
  return {
    queryPart: gremlinQueryPart,
    index: index,
    type: SET_GREMLIN_QUERY_STEP
  };
}

// Action used to remove all steps after the given steps
export function removeGremlinQueryStepsAfterIndex(index) {
  return {
    index: index,
    type: REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX
  };
}