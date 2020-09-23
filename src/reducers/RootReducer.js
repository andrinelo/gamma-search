import { combineReducers } from "redux";
import testReducer from "./TestReducer.js";
import RelationReducer from "./RelationReducer.js"

// Combines all reducers and export them
export default combineReducers({
  testVariable: testReducer,
  relations: RelationReducer,
});
