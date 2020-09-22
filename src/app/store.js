import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/RootReducer';

export default configureStore({
  reducer: {
    rootReducer
  },
});
