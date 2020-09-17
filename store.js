import { createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/RootReducer.js";

const initialState = {};

// Thunk is needed for asynchronous action creators.
const middleware = [thunk];

// ComposeWithdevTools make the page run both with and without the reduxdevtools,
// which are very useful for debugging.
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
