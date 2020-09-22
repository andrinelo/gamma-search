import { combineReducers } from "redux";
import testReducer from "./TestReducer.js";
import initialSearchParameterReducer from "./InitialSearchParameterReducer.js";

// Combines all reducers and export them
export default combineReducers({
  InitialSearchParameter: initialSearchParameterReducer,
});
