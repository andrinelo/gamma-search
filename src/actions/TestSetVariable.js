import { UPDATE_SORT_TERM } from './types.js';

// Action used to update the sort term
export default function updateSortValue(sortTerm) {
  return {
    newValue: sortTerm,
    type: UPDATE_SORT_TERM
  };
}
