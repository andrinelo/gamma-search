import { SET_NODE_TO_INSPECT, SET_INSPECT_WINDOW_ACTIVE } from './types.js';

// sets which window (aggregate nodes, filter nodes) is visible (or if any at all)
export function setInspectWindowActive(active){
  return {
    type: SET_INSPECT_WINDOW_ACTIVE,
    value: active
  };
};

export function setNodeToInspect(nodeNum){
  return {
    type: SET_NODE_TO_INSPECT,
    value: nodeNum
  };
};