import { SET_SELECTED_NODE, RESET_SELECTED_NODE } from './types.js';


export function setSelectedNode(nodeNum){
  return {
    type: SET_SELECTED_NODE,
    value: nodeNum
  };
};

export function resetSelectedNode(nodeNum){
  return {
    type: RESET_SELECTED_NODE,
  };
};