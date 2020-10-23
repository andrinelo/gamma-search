import { SET_FILTER } from "./types.js";

// Action used to update the filters
export default function setFilter(filterValue, andOrs, cloudId) {
  return {
    value: filterValue,
    andOrs: andOrs,
    cloudId: cloudId,
    type: SET_FILTER,
  };
}
