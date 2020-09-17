import { TEST_ACTION } from './types.js';

// Action used to update the sort term
export default function testSetVariable(variableValue) {
  return {
    value: variableValue,
    type: TEST_ACTION
  };
}
