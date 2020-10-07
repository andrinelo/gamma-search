import { SET_FILTER } from "./../actions/types.js";

const filterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_FILTER:
      let filter = { ...state, [action.cloudId]: action.value };
      return filter;
    default:
      return state;
  }
};

export default filterReducer;
