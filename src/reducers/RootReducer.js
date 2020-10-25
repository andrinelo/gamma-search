import { combineReducers } from "redux";
import OutputPaginationReducer from "./OutputPaginationReducer.js";
import AutocompleteSuggestionReducer from "./AutocompleteSuggestionReducer.js";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import gremlinQueryReducer from "./GremlinQueryReducer.js";
import queryReducer from "./QueryReducer.js"
import InitialSearchParameterReducer from "./InitialSearchParameterReducer.js"
import FilterDatasetWindowReducer from "./FilterDatasetWindowReducer"
import SelectedDatasetReducer from "./SelectedDatasetReducer.js"
import InspectedDatasetWindowReducer from "./InspectedDatasetWindowReducer.js"
import RelationWindowReducer from "./RelationWindowReducer.js"
import AggregateDatasetWindowReducer from "./AggregateDatasetWindowReducer.js";
import { PropertyTableWindowReducer, PropertyTableLoadingReducer, PropertyTableLatestFetchReducer } from "./PropertyTableWindowReducer"


// Combines all reducers and export them
export default combineReducers({
  allQueryResults: queryReducer,
  gremlinQueryParts: gremlinQueryReducer,
  initialSearchParameter: InitialSearchParameterReducer,
  currentOutputPage: OutputPaginationReducer,
  autoComplete: AutocompleteSuggestionReducer,
  relations: RelationReducer,
  filters: FilterReducer,  
  selectedDataset: SelectedDatasetReducer,
  inspectDatasetWindowActive: InspectedDatasetWindowReducer,
  filterDatasetWindowActive: FilterDatasetWindowReducer,
  relationWindowActive: RelationWindowReducer,
  aggregateDatasetWindowActive: AggregateDatasetWindowReducer,
  propertyTableWindowActive: PropertyTableWindowReducer,
  propertyTableIsFetching: PropertyTableLoadingReducer,
  propertyTableLatestFetchID: PropertyTableLatestFetchReducer,
});
