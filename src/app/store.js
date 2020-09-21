import { configureStore } from '@reduxjs/toolkit';
import GremlinQueryDisplayReducer from '../reducers/GremlinQueryDisplayReducer'
export default configureStore({
  reducer: {
    GremlinQueryDisplayReducer,
  },
});
