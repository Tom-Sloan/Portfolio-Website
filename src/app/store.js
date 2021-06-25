import { configureStore } from "@reduxjs/toolkit";
import workplaceSlice from "../features/linkedIn/workplaceSlice";

import projectsReducer from "../features/projects/projectsSlice";

export const store = configureStore({
  reducer: {
    project: projectsReducer,
    work: workplaceSlice,
  },
});
