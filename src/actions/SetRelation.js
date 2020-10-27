import { SET_RELATION } from './types.js';

// Action used to update the relations
export default function setRelation (relationValue, andOrs, edgeId) {
  return {
    value: relationValue,
    edgeId: edgeId,
    andOrs: andOrs,
    type: SET_RELATION
  };
}
