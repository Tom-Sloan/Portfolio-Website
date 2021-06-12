import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const aboutSlice = createSlice({
    name: "about",
    initialState: {
        division: [
            {
                // 'M 100 550 Q 0 150 100 100 Q 150 50 200 150 Q 300 350 600 400 Q 800 450 550 500 L 100 550 '
                path: "M0.157,1 Q0,0.214,0.157,0.107 Q0.235,0,0.313,0.214 Q0.47,0.643,0.939,0.75 Q1,0.857,0.861,0.964 L0.157,1",
                color: "#000",
                indexLevel: 1,
                position:"0 0 800 600",
            },
            {
                // M 250 100 C 225 200 275 200 250 300 C 200 350 250 350 200 400 C 150 450 100 400 50 450 Q 0 500 50 550 Q 400 600 750 550 Q 800 500 750 450 C 750 400 600 450 600 400 C 550 350 600 350 550 300 C 525 200 575 200 550 100 Q 400 0 250 100 
                path: "M0.333,0.19 C0.3,0.381,0.367,0.381,0.333,0.571 C0.267,0.667,0.333,0.667,0.267,0.762 C0.2,0.857,0.133,0.762,0.067,0.857 Q0,0.952,0.067,1 Q0.533,1,1,1 Q1,0.952,1,0.857 C1,0.762,0.8,0.857,0.8,0.762 C0.733,0.667,0.8,0.667,0.733,0.571 C0.7,0.381,0.767,0.381,0.733,0.19 Q0.533,0,0.333,0.19",
                color: "#0F0",
                indexLevel: 2,
                position: "0 0 800 600",
            },
            {
                // 'M 600 100 L 700 100 C 800 100 800 500 700 550 L 100 550 C 75 500 125 500 150 450 C 200 350 250 450 400 400 C 475 275 450 100 600 100'
                path: 'M0.77,0 L0.917,0 C1,0,1,0.889,0.917,1 L0.037,1 C0,0.889,0.073,0.889,0.11,0.778 C0.183,0.556,0.257,0.778,0.477,0.667 C0.587,0.389,0.55,0,0.77,0',
                color: "#00F",
                indexLevel: 3,
                position:"0 0 800 600",
            }
        ],
        indexNumber: 0,
    },
    reducers: {
        updateIndex: (state, action) => {
            state.indexNumber = (state.indexNumber + 1) % state.division.length;
        },
    },
});

export const { updateIndex } = aboutSlice.actions;
export const selectDivisions = (state) => state.about.division;
export const selectIndexNumber = (state) => state.about.indexNumber;
export default aboutSlice.reducer;