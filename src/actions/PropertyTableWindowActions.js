import { SET_PROPERTY_TABLE_WINDOW_ACTIVE } from './types.js';

// sets if property table window is active
export function setPropertyTableWindowActive(active){
  return {
    type: SET_PROPERTY_TABLE_WINDOW_ACTIVE,
    value: active
  };
};
