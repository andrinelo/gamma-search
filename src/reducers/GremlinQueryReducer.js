import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY, REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX, SET_GREMLIN_QUERY_STEP } from '../actions/types.js';

const gremlinQueryReducer = (state = [], action) => {
  
  let newState = null

  switch (action.type) {
    case RESET_CURRENT_GREMLIN_QUERY:
      return [];
    case APPEND_TO_CURRENT_GREMLIN_QUERY:
      newState = JSON.parse(JSON.stringify(state))
      newState.push(action.queryPart);
      return newState  
    case REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX:
      newState = JSON.parse(JSON.stringify(state))
      newState = newState.slice(0, action.index + 1)
      return newState
    case SET_GREMLIN_QUERY_STEP:
      newState = JSON.parse(JSON.stringify(state))
      newState[action.index] = action.queryPart
      return newState
    default:
      return state;
  }
};

export default gremlinQueryReducer;