import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [
      {
        title: "Reddit Client",
        subtitle: "Codecademy Full Stack Web Developer Porfolio Project",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "June 2020",
        enddate: "June 2020",
        category: [
          {
            tag: "Web Development",
            color: "#FB4D3D",
          },
        ],
        image:
          "./redditClient.png",
        link: "https://tomanddanredditclient.netlify.app/",
      },
      {
        title: "FPGA Prototype",
        subtitle: "Sensors, GPS, and Bluetooth",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "November 2019",
        enddate: "Ongoing",
        category: [
          {
            tag: "Hardware",
            color: "#66023C",
          },
          {
            tag: "Programming",
            color: "#149e5e",
          },
        ],
        image:
          "https://www.einfochips.com/wp-content/uploads/2018/06/fpga-offerings.png",
        link: "https://en.wikipedia.org/wiki/Field-programmable_gate_array",
      },
      {
        title: "Smart Pillbox",
        subtitle: "B. Eng Capstone Project: Tracking Pill Consumption",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "August 2020",
        enddate: "April 2021",
        category: [
          {
            tag: "Hardware",
            color: "#66023C",
          },
          {
            tag: "IoT",
            color: "#00ADCC",
          },
        ],
        image:
          "https://pluspng.com/img-png/pill-png-hd-pills-transparent-png-1600.png",
        link: "https://en.wikipedia.org/wiki/Smart_device",
      },
      {
        title: "Full stack dev course",
        subtitle: "Front End and Back End, including React and Redux",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "May 2021",
        enddate: "Ongoing",
        category: [
          {
            tag: "Web Development",
            color: "#FB4D3D",
          },
        ],
        image:
          "https://www.credibll.com/build/images/campaign/full-stack-icons/junior-icon.png",
        link: "https://www.codecademy.com/learn/paths/front-end-engineer-career-path",
      },
      {
        title: "Boat Refurbrishment",
        subtitle: "New Hardware Implementation and Restoration",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "July 2021",
        enddate: "May 2022",
        category: [
          {
            tag: "Hardware",
            color: "#66023C",
          },
          {
            tag: "IoT",
            color: "#00ADCC",
          },
        ],
        image:
          "https://pluspng.com/img-png/row-boat-png-hd-small-fishing-boat-1754.png",
      },
      {
        title: "Automated Hydroponics System",
        subtitle: "Sensors, Pumps, and Free Food",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "July 2021",
        enddate: "August 2021",
        category: [
          {
            tag: "Hardware",
            color: "#66023C",
          },
          {
            tag: "Embedded",
            color: "#042A2B",
          },
        ],
        image: "https://clipground.com/images/hydroponic-png-9.png",
        link: "https://en.wikipedia.org/wiki/Hydroponics",
      },
      {
        title: "Mimicing Robotic Arm",
        subtitle: "Computer Vision and Tracking",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
        date: "August 2021",
        enddate: "Ongoing",
        category: [
          {
            tag: "Hardware",
            color: "#66023C",
          },
          {
            tag: "Embedded",
            color: "#042A2B",
          },
          {
            tag: "Programming",
            color: "#149e5e",
          },
        ],
        image:
          "https://i.pinimg.com/originals/92/86/b3/9286b3892a1f1c21e004c9d3156b780e.png",
      },
    ],
  },
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
  },
});

export const selectProjectsArray = (state) => state.project.projects;
export const { addProject } = projectsSlice.actions;
export default projectsSlice.reducer;
