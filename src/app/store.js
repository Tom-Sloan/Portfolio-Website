import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import projectsReducer from '../features/projects/projectsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    project: projectsReducer,
  },
});
