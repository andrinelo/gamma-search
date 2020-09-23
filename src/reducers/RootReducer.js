import { combineReducers } from "redux";
import testReducer from "./TestReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import OutputTextReducer from "./OutputTextReducer.js";

// Combines all reducers and export them
export default combineReducers({
  testVariable: testReducer,
  currentOutputPage: OutputPaginationReducer,
  outputText: OutputTextReducer,
});
