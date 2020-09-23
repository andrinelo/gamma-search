import { SET_RELATION } from "./../actions/types.js";

// If the action is SET_RELATION, we return the payload that we want added to the state
const realtionReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_RELATION:
        let relation = {...state, [action.edgeId]: action.value}
        //state.relations["test"] = action.value
        return relation;
    default:
        return state;
  }
};

export default realtionReducer;
