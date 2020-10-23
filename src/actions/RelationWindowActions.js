import { SET_RELATION_WINDOW_ACTIVE } from './types.js';

// sets if relation window is active
export function setRelationWindowActive(active){
  return {
    type: SET_RELATION_WINDOW_ACTIVE,
    value: active
  };
};
