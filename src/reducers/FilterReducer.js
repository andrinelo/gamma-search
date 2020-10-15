import { SET_FILTER } from "./../actions/types.js";

const filterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FILTER:
      let filter = { ...state, [action.cloudId]: action.value };
      
      //Makes a new state that only contains the filters up unitl this id
      let newState = {}
      for (let i = 0; i<action.cloudId+1; i++){
        if (filter[i]){
          newState[i]= filter[i]
        }
        
      }
      return newState;
    default:
      return state;
  }
};

export default filterReducer;
