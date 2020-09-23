import { OUTPUT_NEXT_PAGE, OUTPUT_PREVIOUS_PAGE, RESET_PAGE_NUMBER } from "./types.js";

// Redux actions. Page number is how many elemtents we have loaded so far. As we scroll down 10 new elements are added and
// the pagenumber is increased. When we change to sorting og filtering options we start from scratch and reset the pagenr.

export function resetPageNumber() {
  return {
    type: RESET_PAGE_NUMBER
  };
}

export function increasePageNumber() {
  return {
    type: OUTPUT_NEXT_PAGE
  };
}

export function decreasePageNumber() {
  return {
    type: OUTPUT_PREVIOUS_PAGE
  };
}
