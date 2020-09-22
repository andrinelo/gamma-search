import { SET_INITIAL_SEARCH_PARAMETER } from "../actions/types.js";

// If the action is TEST_ACTION, we return the payload that we want added to the state
const initialSearchParameterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_INITIAL_SEARCH_PARAMETER:
      return action.typeAndValue;
    default:
      return state;
  }
};

export default initialSearchParameterReducer;
