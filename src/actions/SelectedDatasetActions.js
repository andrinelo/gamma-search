import { SET_SELECTED_DATASET, RESET_SELECTED_DATASET } from './types.js';


export function setSelectedDataset(datasetNum){
  return {
    type: SET_SELECTED_DATASET,
    value: parseInt(datasetNum)
  };
};

export function resetSelectedDataset(){
  return {
    type: RESET_SELECTED_DATASET,
  };
};