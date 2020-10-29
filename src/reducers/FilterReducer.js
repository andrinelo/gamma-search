import { SET_FILTER, DELETE_LATER_FILTERS } from "./../actions/types.js";

const filterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FILTER:
      let combinedObject = Object.assign(action.value, action.andOrs); 

      let filter = { ...state, [action.cloudId]: combinedObject};

      return filter;
    
    case DELETE_LATER_FILTERS:
      //Makes a new state that only contains the filters up unitl this id
      let newState = {} 
      for (let i = 0; i<action.cloudId+1; i++){
        if (state[i]){
          newState[i]= state[i]
        }
      }
      return newState

    default:
      return state;
  }
};

export default filterReducer;
