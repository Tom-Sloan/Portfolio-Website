import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const aboutSlice = createSlice({
  name: "about",
  initialState: {
    division: [
      {
        // 'M 100 550 Q 0 150 100 100 Q 150 50 200 150 Q 300 350 600 400 Q 800 450 550 500 L 100 550 '
        path: "M0,1 L0,0 L0.333,0 Q0.417,0.625,0.583,0.625 L1,0.625 L1,1 L0,1",
        // path: 'M0,1 L1,1 C0.6,0.8,0.9,0.6,0.6,0.2 Q0.5,0,0.4,0.2 C0.1,0.6,0.4,0.8,0,1',
        color: "rgb(255, 63, 3)",
        position: "0 0 600 399",
        title: "Personal",
      },
      {
        // M 250 100 C 225 200 275 200 250 300 C 200 350 250 350 200 400 C 150 450 100 400 50 450 Q 0 500 50 550 Q 400 600 750 550 Q 800 500 750 450 C 750 400 600 450 600 400 C 550 350 600 350 550 300 C 525 200 575 200 550 100 Q 400 0 250 100
        path: "M0,1 L0,0.625 Q0.333,0.625,0.333,0 L0.667,0 Q0.667,0.625,1,0.625 L1,1 L0,1",
        // path:'M0.241,0.333 C0.181,0.75,0.301,0.75,0.241,1 Q0.663,1,1,1 C1,1,1,1,1,0.833 Q0.843,0.667,0.723,0.833 C0.482,1,0.723,0.5,0.602,0.333 Q0.361,0,0.241,0.333',
        color: "rgb(85, 19, 218)",

        position: "0 0 600 399",
        title: "Art",
      },
      {
        // 'M 600 100 L 700 100 C 800 100 800 500 700 550 L 100 550 C 75 500 125 500 150 450 C 200 350 250 450 400 400 C 475 275 450 100 600 100'
        path: "M1,1 L1,0 L0.667,0 Q0.667,0.625,0.417,0.625 L0,0.625 L0,1 L1,1",
        // path:'M0,1 L1,1 C0.6,0.8,0.9,0.6,0.6,0.2 Q0.5,0,0.4,0.2 C0.1,0.6,0.4,0.8,0,1',
        color: "rgb(30, 215, 96)",
        position: "0 0 600 400",
        title: "Music",
      },
    ],
    indexNumber: 0,
  },
  reducers: {
    updateIndex: (state, action) => {
      state.indexNumber = action.payload.index;
    },
  },
});

export const { updateIndex } = aboutSlice.actions;
export const selectDivisions = (state) => state.about.division;
export const selectIndexNumber = (state) => state.about.indexNumber;
export default aboutSlice.reducer;
