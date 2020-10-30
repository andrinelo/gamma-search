import { SET_INSPECT_WINDOW_ACTIVE } from './types.js';

// Opens the inspect dataset modal
export function setInspectWindowActive(active){
  return {
    type: SET_INSPECT_WINDOW_ACTIVE,
    value: active
  };
};
