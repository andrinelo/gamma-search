import { SET_RELATION_WINDOW_ACTIVE } from './types.js';

// Opens the relation modal
export function setRelationWindowActive(active){
  return {
    type: SET_RELATION_WINDOW_ACTIVE,
    value: active
  };
};
