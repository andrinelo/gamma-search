import { SET_RELATION } from './types.js';

// Action used to update the sort term
export default function setRelation (relationValue, edgeId) {
    //console.log(edgeId)
  return {
    value: relationValue,
    edgeId: edgeId,
    type: SET_RELATION
  };
}
