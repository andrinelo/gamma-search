import { SET_INITIAL_SEARCH_PARAMETER } from "../actions/types.js";

const initialSearchParameterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_INITIAL_SEARCH_PARAMETER:
      return action.typeAndValue;
    default:
      return state;
  }
};

export default initialSearchParameterReducer;