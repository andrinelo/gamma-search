import { combineReducers } from "redux";
import testReducer from "./TestReducer.js";
import windowReducer from "./WindowReducer.js";

// Combines all reducers and export them
export default combineReducers({
  testVariable: testReducer,
  activeWindow: windowReducer
});
