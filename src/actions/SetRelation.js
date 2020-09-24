import { SET_RELATION } from './types.js';

// Action used to update the relations
export default function setRelation (relationValue, edgeId) {
  return {
    value: relationValue,
    edgeId: edgeId,
    type: SET_RELATION
  };
}
