import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const aboutSlice = createSlice({
  name: "about",
  initialState: {
    division: [
      {
        // path: "M0,1 L0,0 L0.333,0 Q0.417,0.625,0.583,0.625 L1,0.625 L1,1 L0,1",
        // path: 'M0,1 L0,0 L0.667,0 Q0.667,1,1,1 L0,1',
        color: "rgb(255, 63, 3)",
        position: "0 0 600 400",
        title: "Personaaaal",
      },
      {
        // path: "M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,",
        // path:'M0,1 L1,1 Q1,0.727,0.75,0.364 Q0.5,0,0.25,0.364 Q0,0.727,0,1',
        color: "rgb(85, 19, 218)",
        position: "0 0 600 400",
        title: "Artist",
      },
    //   {
    //     // path: "M0,1 L0,0.625 Q0.333,0.625,0.333,0 L0.667,0 Q0.667,0.625,1,0.625 L1,1 L0,1",
    //     // path:'M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,1',
    //     color: "rgb(85, 19, 218)",
    //     position: "0 0 600 400",
    //     title: "Art",
    //   },
    //   {
    //     // path: "M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,",
    //     // path:'M0,1 L1,1 Q1,0.727,0.75,0.364 Q0.5,0,0.25,0.364 Q0,0.727,0,1',
    //     color: "rgb(185, 19, 218)",
    //     position: "0 0 600 400",
    //     title: "Artist",
    //   },
    //   {
    //     // path: "M0,1 L0,0.625 Q0.333,0.625,0.333,0 L0.667,0 Q0.667,0.625,1,0.625 L1,1 L0,1",
    //     // path:'M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,1',
    //     color: "rgb(85, 19, 218)",
    //     position: "0 0 600 400",
    //     title: "Art",
    //   },
      {
        // path: "M1,1 L1,0 L0.667,0 Q0.667,0.625,0.417,0.625 L0,0.625 L0,1 L1,1",
        // path:'M0,1 L1,1 L1,0 L0.333,0 Q0.333,1,0,1',
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
