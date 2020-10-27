import { SET_FILTER, DELETE_LATER_FILTERS } from "./types.js";

// Action used to update the filters
export function setFilter(filterValue, andOrs, cloudId) {
  return {
    value: filterValue,
    andOrs: andOrs,
    cloudId: cloudId,
    type: SET_FILTER,
  };
}

export function removeLaterFilters( cloudId) {
  return {
    cloudId: cloudId,
    type: DELETE_LATER_FILTERS,
  };
}
