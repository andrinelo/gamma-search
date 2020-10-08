import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY, REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX, SET_GREMLIN_QUERY_STEP } from '../actions/types.js';

const gremlinQueryReducer = (state = [], action) => {
  
  switch (action.type) {
    case RESET_CURRENT_GREMLIN_QUERY:
      return [];
    case APPEND_TO_CURRENT_GREMLIN_QUERY:
      state.push(action.queryPart);
      return state  
    case REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX:
      state.splice(action.index,state.length)
      return state
    case SET_GREMLIN_QUERY_STEP:
      state[action.index] = action.queryPart
      return state
    default:
      return state;
  }
};

export default gremlinQueryReducer;