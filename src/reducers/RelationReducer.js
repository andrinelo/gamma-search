import { SET_RELATION } from "./../actions/types.js";

// If the action is SET_RELATION, we return the state, but with the new or modified relation menu updated. 
const relationReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_RELATION:

        let combinedObject = Object.assign(action.value, action.andOrs); 
        let relation = { ...state, [action.edgeId]: combinedObject};
        //const relation = JSON.parse(JSON.stringify(state));
        //relation[action.edgeId] = action.value;
        return relation;
    default:
        return JSON.parse(JSON.stringify(state));
  }
};

export default relationReducer;
