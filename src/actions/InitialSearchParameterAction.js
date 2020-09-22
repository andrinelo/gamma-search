import { SET_INITIAL_SEARCH_PARAMETER } from './types.js';

// Action used to update the sort term
export default function setInitialSearchParameter(searchParameterType, searchParameterValue) {
  let value = {};
  value[searchParameterType] = searchParameterValue;
  
  return {
    typeAndValue: value,
    type: SET_INITIAL_SEARCH_PARAMETER
  };
}
