import { SET_HELP_WINDOW_ACTIVE } from './types.js';

// Opens the help modal
export function setHelpWindowActive(active){
  return {
    type: SET_HELP_WINDOW_ACTIVE,
    value: active
  };
};
