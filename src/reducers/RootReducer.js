import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import OutputTextReducer from "./OutputTextReducer.js";
import GremlinQueryDisplayReducer from './GremlinQueryDisplayReducer.js';
import AutocompleteSuggestionReducer from './AutocompleteSuggestionReducer.js';
import RelationReducer from "./RelationReducer.js"
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import resultItemReducer from "./ResultItemReducer.js";
import allAvailableLabelsReducer from "./AllAvailableLabelsReducer.js"

// Combines all reducers and export them
export default combineReducers({
  gremlinQueryParts: gremlinQueryReducer,
  resultItems: resultItemReducer,
  allAvailableLabels: allAvailableLabelsReducer,
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  outputText: OutputTextReducer,
  gremlinQueryDisplay: GremlinQueryDisplayReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  
});
