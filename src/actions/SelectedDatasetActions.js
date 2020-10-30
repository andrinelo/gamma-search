import { SET_SELECTED_DATASET, RESET_SELECTED_DATASET } from './types.js';

// Sets the selected dataset (selected dataset is the dataset which a feature, like filter, is using)
export function setSelectedDataset(datasetNum){
  return {
    type: SET_SELECTED_DATASET,
    value: parseInt(datasetNum)
  };
};

// Resets the selected dataset
export function resetSelectedDataset(){
  return {
    type: RESET_SELECTED_DATASET,
  };
};