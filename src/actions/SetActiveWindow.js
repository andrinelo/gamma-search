import { SET_ACTIVE_WINDOW } from './types.js';

// sets which window (aggregate nodes, filter nodes) is visible (or if any at all)
export function setActiveWindow(windowType){
  return {
    type: SET_ACTIVE_WINDOW,
    windowType
  };
};