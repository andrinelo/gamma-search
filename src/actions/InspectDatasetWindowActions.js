import { SET_INSPECT_WINDOW_ACTIVE } from './types.js';

// sets if inspect dataset window is active
export function setInspectWindowActive(active){
  return {
    type: SET_INSPECT_WINDOW_ACTIVE,
    value: active
  };
};
