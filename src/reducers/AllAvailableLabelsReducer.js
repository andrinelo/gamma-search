import { SET_ALL_AVAILABLE_LABELS } from "../actions/types.js";

const initialState = [];

const allAvailableLabelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_AVAILABLE_LABELS:
      return action.allLabels
    default:
      return state;
  }
};

export default allAvailableLabelsReducer;
