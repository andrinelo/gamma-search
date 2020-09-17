import { combineReducers } from "redux";
import testReducer from "./TestReducer.js";

// Combines all reducers and export them
export default combineReducers({
  testVariable: testReducer,
});
