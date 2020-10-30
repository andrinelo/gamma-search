import { SET_RELATION, DELETE_LATER_RELATIONS } from "./../actions/types.js";

// Reducer for storing what relations the user has explored
const relationReducer = (state = {}, action) => {
  switch (action.type) {
    
    // If the action is SET_RELATION, we return the state, but with the new or modified relation menu updated. 
    case SET_RELATION:
        let combinedObject = Object.assign(action.value, action.andOrs); 
        let relation = { ...state, [action.edgeId]: combinedObject};
        return relation;

    // Makes a new state that only contains the relations up until this id
    case DELETE_LATER_RELATIONS:
      let newState = {} 
      for (let i = 0; i<action.edgeId+1; i++){
        if (state[i]){
          newState[i]= state[i]
        }
      }
      return newState

    default:
        return state;
  }
};

export default relationReducer;
