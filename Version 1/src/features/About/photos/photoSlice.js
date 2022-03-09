import { createSlice } from "@reduxjs/toolkit";

export const photoSlice = createSlice({
    name: "photoCollage",
    initialState: {
        photos: {
            dan: [
                {
                    image: "https://picsum.photos/800/400?random=1",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
                {
                    image: "https://picsum.photos/400/400?random=2",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
                {
                    image: "https://picsum.photos/200/400?random=3",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
                {
                    image: "https://picsum.photos/400/600?random=4",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
            ],
            tom: [
                {
                    image: "https://picsum.photos/400/100?random=5",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
                {
                    image: "https://picsum.photos/400/400?random=6",
                    description: "Lorem whatever stuff filler balh blah blah",
                },
            ]
        }
    },
    reducers: {
        addPhoto: (state, action) => {
            state.photos = [action.payload, ...state.photos];
        },
    },
})

export const selectPhotoArray = (state) => state.photos.photos;
export const { addPhoto } = photoSlice.actions;
export default photoSlice.reducer;