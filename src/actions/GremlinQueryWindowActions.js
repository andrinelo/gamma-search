import { SET_GREMLIN_QUERY_DISPLAY_TEXT } from "./types.js";

// Redux actions.

export function setGremlinWindowText(gremlinText) {
  return {
    newText: gremlinText,
    type: SET_GREMLIN_QUERY_DISPLAY_TEXT
  };
}

