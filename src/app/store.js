import { configureStore } from '@reduxjs/toolkit';
import OutputPaginationReducer from '../reducers/OutputPaginationReducer'
import OutputTextReducer from '../reducers/OutputTextReducer'
export default configureStore({
  reducer: {
    OutputPaginationReducer,
    OutputTextReducer,
  },
});
