import { combineReducers } from "redux";
import RelationReducer from "./RelationReducer.js";
import FilterReducer from "./FilterReducer.js";
import GremlinQueryReducer from "./GremlinQueryReducer.js";
import QueryReducer from "./QueryReducer.js"
import FilterDatasetWindowReducer from "./FilterDatasetWindowReducer"
import SelectedDatasetReducer from "./SelectedDatasetReducer.js"
import InspectedDatasetWindowReducer from "./InspectedDatasetWindowReducer.js"
import RelationWindowReducer from "./RelationWindowReducer.js"
import AggregateDatasetWindowReducer from "./AggregateDatasetWindowReducer.js";
import HelpWindowReducer from "./HelpWindowReducer.js";
import { PropertyTableWindowReducer, PropertyTableLoadingReducer, PropertyTableLatestFetchReducer } from "./PropertyTableWindowReducer"


// Combines all reducers and export them
export default combineReducers({
  allQueryResults: QueryReducer,
  gremlinQueryParts: GremlinQueryReducer,
  relations: RelationReducer,
  filters: FilterReducer,  
  selectedDataset: SelectedDatasetReducer,
  inspectDatasetWindowActive: InspectedDatasetWindowReducer,
  filterDatasetWindowActive: FilterDatasetWindowReducer,
  relationWindowActive: RelationWindowReducer,
  aggregateDatasetWindowActive: AggregateDatasetWindowReducer,
  helpWindowActive: HelpWindowReducer,
  propertyTableWindowActive: PropertyTableWindowReducer,
  propertyTableIsFetching: PropertyTableLoadingReducer,
  propertyTableLatestFetchID: PropertyTableLatestFetchReducer,
});
