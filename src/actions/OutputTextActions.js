import { SET_OUTPUT_TEXT } from "./types.js";

// Redux actions.

export function setOutputText(outputText) {
  return {
    newText: outputText,
    type: SET_OUTPUT_TEXT
  };
}

