import { SET_RELATION, DELETE_LATER_RELATIONS } from "./../actions/types.js";

// If the action is SET_RELATION, we return the state, but with the new or modified relation menu updated. 
const relationReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_RELATION:

        let combinedObject = Object.assign(action.value, action.andOrs); 
        let relation = { ...state, [action.edgeId]: combinedObject};
        return relation;

      case DELETE_LATER_RELATIONS:
        //Makes a new state that only contains the relations up unitl this id
        let newState = {} 
        for (let i = 0; i<action.edgeId+1; i++){
          if (state[i]){
            newState[i]= state[i]
          }
        }
        return newState
  

    default:
        return JSON.parse(JSON.stringify(state));
  }
};

export default relationReducer;
