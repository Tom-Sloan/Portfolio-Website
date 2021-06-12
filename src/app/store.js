import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import projectsReducer from '../features/projects/projectsSlice';
import aboutReducer from '../features/About/aboutSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    project: projectsReducer,
    about:aboutReducer,
  },
});
