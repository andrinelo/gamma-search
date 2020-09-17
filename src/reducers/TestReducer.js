import { TEST_ACTION } from "./../actions/types.js";

// If the action is TEST_ACTION, we return the payload that we want added to the state
const testReducer = (state = {}, action) => {
  switch (action.type) {
    case TEST_ACTION:
      return action.payload.value;
    default:
      return state;
  }
};

export default testReducer;
