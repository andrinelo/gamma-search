import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import OutputTextReducer from "./OutputTextReducer.js";
import GremlinQueryDisplayReducer from "./GremlinQueryDisplayReducer.js";
import AutocompleteSuggestionReducer from "./AutocompleteSuggestionReducer.js";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import initialSearchParameterReducer from "./InitialSearchParameterReducer.js";
import GremlinQueryDisplayReducer from './GremlinQueryDisplayReducer.js';
import AutocompleteSuggestionReducer from './AutocompleteSuggestionReducer.js';
import RelationReducer from "./RelationReducer.js"
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import queryReducer from "./QueryReducer.js"
import InitialSearchParameterReducer from "./InitialSearchParameterReducer.js"
import FilterReducer from "./FilterReducer.js";


// Combines all reducers and export them
export default combineReducers({
  allQueryResults: queryReducer,
  gremlinQueryParts: gremlinQueryReducer,
  initialSearchParameter: InitialSearchParameterReducer,
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  gremlinQueryDisplay: GremlinQueryDisplayReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  filters: FilterReducer,  
});
