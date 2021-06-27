import { configureStore } from "@reduxjs/toolkit";
import experienceSlice from "../features/experience/experienceSlice";
import generalSlice from "../features/general/generalSlice";
import workplaceSlice from "../features/linkedIn/workplaceSlice";

import projectsReducer from "../features/projects/projectsSlice";

export const store = configureStore({
  reducer: {
    project: projectsReducer,
    work: workplaceSlice,
    experience: experienceSlice,
    general: generalSlice
  },
});
