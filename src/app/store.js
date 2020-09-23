import { configureStore } from '@reduxjs/toolkit';
import GremlinQueryDisplayReducer from '../reducers/GremlinQueryDisplayReducer'
import OutputPaginationReducer from '../reducers/OutputPaginationReducer'
import OutputTextReducer from '../reducers/OutputTextReducer'
import rootReducer from '../reducers/RootReducer'

export default configureStore({
  reducer: {
    GremlinQueryDisplayReducer,
    OutputPaginationReducer,
    OutputTextReducer,
    rootReducer,
  },
});
