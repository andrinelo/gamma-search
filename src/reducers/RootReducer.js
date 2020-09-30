import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import GremlinQueryDisplayReducer from './GremlinQueryDisplayReducer.js';
import AutocompleteSuggestionReducer from './AutocompleteSuggestionReducer.js';
import RelationReducer from "./RelationReducer.js"
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import queryReducer from "./QueryReducer.js"

// Combines all reducers and export them
export default combineReducers({
  allQueryResults: queryReducer,
  gremlinQueryParts: gremlinQueryReducer,
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  gremlinQueryDisplay: GremlinQueryDisplayReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  
});
