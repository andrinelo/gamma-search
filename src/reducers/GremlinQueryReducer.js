import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY } from '../actions/types.js';

const gremlinQueryReducer = (state = [], action) => {
  
  switch (action.type) {
    case RESET_CURRENT_GREMLIN_QUERY:
      return [];
    case APPEND_TO_CURRENT_GREMLIN_QUERY:
      state.push(action.queryPart);
      return state  
    default:
      return state;
  }
};

export default gremlinQueryReducer;