import { SET_RELATION, DELETE_LATER_RELATIONS } from './types.js';

// Action used to update the relations
export function setRelation (relationValue, andOrs, edgeId) {
  return {
    value: relationValue,
    edgeId: edgeId,
    andOrs: andOrs,
    type: SET_RELATION
  };
}

// Action used to remove all relations with an ID larger than the inputted ID
export function removeLaterRelations(edgeId) {
  return {
    edgeId: edgeId,
    type: DELETE_LATER_RELATIONS,
  };
}