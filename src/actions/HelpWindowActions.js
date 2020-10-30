import { SET_HELP_WINDOW_ACTIVE } from './types.js';

// sets if aggregate window is active
export function setHelpWindowActive(active){
  return {
    type: SET_HELP_WINDOW_ACTIVE,
    value: active
  };
};
