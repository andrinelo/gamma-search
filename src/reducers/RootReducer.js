import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import AutocompleteSuggestionReducer from "./AutocompleteSuggestionReducer.js";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import queryReducer from "./QueryReducer.js"
import InitialSearchParameterReducer from "./InitialSearchParameterReducer.js"
import SelectedDatasetReducer from "./SelectedDatasetReducer.js"
import InspectedDatasetWindowReducer from "./InspectedDatasetWindowReducer.js"

// Combines all reducers and export them
export default combineReducers({
  allQueryResults: queryReducer,
  gremlinQueryParts: gremlinQueryReducer,
  initialSearchParameter: InitialSearchParameterReducer,
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  filters: FilterReducer,  
  selectedDataset: SelectedDatasetReducer,
  inspectDatasetWindowActive: InspectedDatasetWindowReducer,
});
