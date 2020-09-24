import { SET_RELATION } from "./../actions/types.js";

// If the action is SET_RELATION, we return the state, but with the new or modified relation menu updated. 
const relationReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_RELATION:
        let relation = {...state, [action.edgeId]: action.value}
        return relation;
    default:
        return state;
  }
};

export default relationReducer;
