import { SET_FILTER_WINDOW_ACTIVE } from './types.js';

// sets which window (aggregate nodes, filter nodes) is visible (or if any at all)
export function setFilterWindowActive(active){
  return {
    type: SET_FILTER_WINDOW_ACTIVE,
    value: active
  };
};
