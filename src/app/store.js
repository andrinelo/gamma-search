import { configureStore } from '@reduxjs/toolkit';
import OutputPaginationReducer from '../reducers/OutputPaginationReducer'
export default configureStore({
  reducer: {
    OutputPaginationReducer,
  },
});
