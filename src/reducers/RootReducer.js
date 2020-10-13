import { combineReducers } from "redux";
import windowReducer from "./WindowReducer.js";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import AutocompleteSuggestionReducer from "./AutocompleteSuggestionReducer.js";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import queryReducer from "./QueryReducer.js"
import InitialSearchParameterReducer from "./InitialSearchParameterReducer.js"
import FilterNodeWindowsReducer from "./FilterNodeWindowReducer"
import SelectedDatasetReducer from "./SelectedDatasetReducer.js"
import InspectedDatasetWindowReducer from "./InspectedDatasetWindowReducer.js"
import aggregationReducer from "./AggregationReducer.js";

// Combines all reducers and export them
export default combineReducers({
  aggregation: aggregationReducer,
  allQueryResults: queryReducer,
  gremlinQueryParts: gremlinQueryReducer,
  initialSearchParameter: InitialSearchParameterReducer,
  activeWindow: windowReducer,
  currentOutputPage: OutputPaginationReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  filters: FilterReducer,  
  filterNodeWindowsActive: FilterNodeWindowsReducer,
  selectedDataset: SelectedDatasetReducer,
  inspectDatasetWindowActive: InspectedDatasetWindowReducer,
});
