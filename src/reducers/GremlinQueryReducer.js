import { RESET_CURRENT_GREMLIN_QUERY, APPEND_TO_CURRENT_GREMLIN_QUERY, REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX } from '../actions/types.js';

const gremlinQueryReducer = (state = [], action) => {
  
  switch (action.type) {
    case RESET_CURRENT_GREMLIN_QUERY:
      return [];
    case APPEND_TO_CURRENT_GREMLIN_QUERY:
      state.push(action.queryPart);
      return state  
    case REMOVE_GREMLIN_QUERY_STEPS_AFTER_INDEX:
      console.log(state)
      state.splice(action.index,50)
      //fjern lengden av lista, 50 er stor sett alletid lenger enn lista, så det fungerer enn så lenge
      return state
    default:
      return state;
  }
};

export default gremlinQueryReducer;