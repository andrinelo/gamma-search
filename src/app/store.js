import { configureStore } from '@reduxjs/toolkit';
import OutputPaginationReducer from '../reducers/OutputPaginationReducer'
import OutputTextReducer from '../reducers/OutputTextReducer'
import rootReducer from '../reducers/RootReducer'

export default configureStore({
  reducer: {
    OutputPaginationReducer,
    OutputTextReducer,
    rootReducer,
  },
});
