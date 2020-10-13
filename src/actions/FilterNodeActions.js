import { SET_FILTER_WINDOW_ACTIVE } from './types.js';

export function setFilterWindowActive(active){
  return {
    type: SET_FILTER_WINDOW_ACTIVE,
    value: active
  };
};
