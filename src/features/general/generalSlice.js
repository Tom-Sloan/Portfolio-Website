import { faSkiing } from "@fortawesome/free-solid-svg-icons";
import { createSlice } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
    name: "generalAboutItems",
    initialState: {
        items: {
            sports: {
                dan: [
                    {
                        name: "Skiing",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://cdn.onlinewebfonts.com/svg/img_350758.png"
                    },
                    {
                        name: "Sailing",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://www.pinclipart.com/picdir/big/1-17170_clip-art-free-stock-boat-svg-yacht-sailing.png"
                    },
                    {
                        name: "Biking",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "http://pngimg.com/uploads/cycling/cycling_PNG113.png"
                    },
                    {
                        name: "Golfing",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://www.sunnybraegolfclub.com/wp-content/uploads/2016/04/golf-ball-on-tee.png"
                    }
                ],
                tom: [
                    {
                        name: "Filler to see change",
                        description: "Lorem whatever stuff filler balh blah blah",
                        image: "https://picsum.photos/400/400",
                    },
                ]
            },
            personals: {
                dan: [
                    {
                        name: "D&D",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://cdn.pixabay.com/photo/2017/08/31/04/01/d20-2699387_1280.png"
                    },
                    {
                        name: "Brando Sando",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://vignette.wikia.nocookie.net/stormlightarchive/images/6/6f/Bridge4.png/revision/latest?cb=20140217190410",
                    },
                    {
                        name: "3D Modelling & Printing",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://image.flaticon.com/icons/png/512/150/150672.png"
                    }
                ],
                tom: [
                    {
                        name: "Filler to see change",
                        description: "Lorem whatever stuff filler balh blah blah",
                        image: "https://picsum.photos/400/400",
                    },
                    {
                        name: "Brando Sando",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://vignette.wikia.nocookie.net/stormlightarchive/images/6/6f/Bridge4.png/revision/latest?cb=20140217190410",
                    },
                    {
                        name: "3D Modelling & Printing",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
                        image: "https://image.flaticon.com/icons/png/512/150/150672.png"
                    }
                ]
            }
        }
    },
    reducers: {
        addGeneral: (state, action) => {
            state.items = [action.payload, ...state.items];
        },
    },
});

export const selectGeneralArray = (state) => state.general.items;
export const selectSportsArray = (state) => state.general.items.sports;
export const selectPersonalsArray = (state) => state.general.items.personals;
export const { addGeneral } = generalSlice.actions;
export default generalSlice.reducer;