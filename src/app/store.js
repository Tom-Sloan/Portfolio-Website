import { configureStore } from "@reduxjs/toolkit";

import projectsReducer from "../features/projects/projectsSlice";

export const store = configureStore({
  reducer: {
    project: projectsReducer,
  },
});
