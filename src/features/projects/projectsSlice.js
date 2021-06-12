import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        projects: [
            {
                text: "FPGA Prototype",
                date: "November 2019",
                enddate: "Ongoing",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            },
            {
                text: "Capstone Project: Smart Pillbox",
                date: "August 2020",
                enddate: "April 2021",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            },
            {
                text: "Full stack dev course",
                date: "May 2021",
                enddate: "Ongoing",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            },
            {
                text: "FPGA Prototype",
                date: "November 2019",
                enddate: "Ongoing",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            },
            {
                text: "Capstone Project: Smart Pillbox",
                date: "August 2020",
                enddate: "April 2021",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            },
            {
                text: "Full stack dev course",
                date: "May 2021",
                enddate: "Ongoing",
                category: {
                    tag: 'medium',
                    color: '#018f69'
                },
            }
        ]
    },
    reducers: {
        addProject: (state, action) => {
            state.projects.push(action.payload);
        }
    }
});

export const selectProjectsArray = (state) => state.project.projects;
export const { addProject } = projectsSlice.actions;
export default projectsSlice.reducer;