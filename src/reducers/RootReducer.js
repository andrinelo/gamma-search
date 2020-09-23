import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import OutputTextReducer from "./OutputTextReducer.js";
import GremlinQueryDisplayReducer from './GremlinQueryDisplayReducer.js'
import FullResultsReducer from './FullResultsReducer.js'

// Combines all reducers and export them
export default combineReducers({
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  outputText: OutputTextReducer,
  gremlinQuery: GremlinQueryDisplayReducer,
  fullResults: FullResultsReducer,
});
