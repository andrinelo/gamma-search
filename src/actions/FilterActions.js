import { SET_FILTER, DELETE_LATER_FILTERS } from "./types.js";

// Action used to update the filters
export function setFilter(filterValue, andOrs, datasetId) {
  return {
    value: filterValue,
    andOrs: andOrs,
    datasetId: datasetId,
    type: SET_FILTER,
  };
}

// Action used to remove all filters with an ID larger than the inputted ID
export function removeLaterFilters(datasetId) {
  return {
    datasetId: datasetId,
    type: DELETE_LATER_FILTERS,
  };
}
