import { SET_AGGREGATE_WINDOW_ACTIVE } from './types.js';

// Sets if aggregate window is active
export function setAggregateWindowActive(active){
  return {
    type: SET_AGGREGATE_WINDOW_ACTIVE,
    value: active
  };
};
