import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const aboutSlice = createSlice({
  name: "about",
  initialState: {
    division: [
      {
        title: "Personal",
      },
      {
        title: "Artist",
      },
      {
        title: "Music",
      },
      {
        title: "Personal",
      },
      {
        title: "Artist",
      },
      {
        title: "Artist",
      },
      {
        title: "Music",
      },
      {
        title: "Personal",
      },
      {
        title: "Artist",
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
