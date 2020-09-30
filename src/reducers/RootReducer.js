import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import OutputTextReducer from "./OutputTextReducer.js";
import GremlinQueryDisplayReducer from "./GremlinQueryDisplayReducer.js";
import AutocompleteSuggestionReducer from "./AutocompleteSuggestionReducer.js";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import initialSearchParameterReducer from "./InitialSearchParameterReducer.js";

// Combines all reducers and export them
export default combineReducers({
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  outputText: OutputTextReducer,
  gremlinQuery: GremlinQueryDisplayReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  filters: FilterReducer,
  InitialSearchParameter: initialSearchParameterReducer,
});
