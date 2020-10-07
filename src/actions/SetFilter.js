import { SET_FILTER } from "./types.js";

// Action used to update the filters
export default function setFilter(filterValue, cloudId) {
  return {
    value: filterValue,
    cloudId: cloudId,
    type: SET_FILTER,
  };
}
