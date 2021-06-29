import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: "projects",
  initialState: {
    persons: {
      tom: {
        experiences: [
          {
            imageUrl: "./experienceImages/react.png",
            title: "React",
          },
          {
            imageUrl: "./experienceImages/circuit.png",
            title: "PCB Design",
            addedClasses: "invert",
          },
          {
            imageUrl: "./experienceImages/redux.png",
            title: "Redux",
          },
          {
            imageUrl: "./experienceImages/microcontroller.png",
            title: "Microcontroller",
          },

          {
            imageUrl: "./experienceImages/c2.png",
            title: "C",
          },
          {
            imageUrl: "./experienceImages/css.png",
            title: "CSS3",
          },
          {
            imageUrl: "./experienceImages/js.png",
            title: "JavaScript",
          },
          {
            imageUrl: "./experienceImages/node.png",
            title: "Node JS",
          },
          {
            imageUrl: "./experienceImages/github.png",
            title: "Github",
            addedClasses: "invert",
          },
          {
            imageUrl: "./experienceImages/sass.png",
            title: "Sass",
          },

          {
            imageUrl: "./experienceImages/postgres.png",
            title: "Postgress SQL",
          },
          {
            imageUrl: "./experienceImages/p2.png",
            title: "Python",
          },
          {
            imageUrl: "./experienceImages/arduino.png",
            title: "Arduino",
          },
        ],

        quotes: [
          {
            quote:
              "A journey will have pain and failure. It is not only the steps forward that we must accept. It is the stumbles... But if we stop, if we accept the person we are when we fall, the journey ends. That failure becomes our destination.",
            quoteAuthor: "Brandon Sanderson",
          },
          {
            quote: "Would you have a great empire? Rule over yourself",
            quoteAuthor: "Pubilius Syrus",
          },
          {
            quote:
              "I do not fear death. I had been dead for billions and billions of years before I was born, and had not suffered the slightest inconvenience from it.",
            quoteAuthor: "Mark Twain",
          },
          {
            quote: "We are dying every day.",
            quoteAuthor: "Seneca the Younger",
          },
          {
            quote:
              "Waste no more time arguing what a good man should be. Be One.",
            quoteAuthor: "Marcus Aurelius",
          },
          {
            quote:
              "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
            quoteAuthor: "Marcus Aurelius",
          },
        ],
      },
      dan: {
        experiences: [
          {
            imageUrl: "./experienceImages/react.png",
            title: "React",
          },
          {
            imageUrl: "./experienceImages/circuit.png",
            title: "PCB Design",
            addedClasses: "invert",
          },
          {
            imageUrl: "./experienceImages/redux.png",
            title: "Redux",
          },
          {
            imageUrl: "./experienceImages/microcontroller.png",
            title: "Microcontroller",
          },

          {
            imageUrl: "./experienceImages/c2.png",
            title: "C",
          },
          {
            imageUrl: "./experienceImages/css.png",
            title: "CSS3",
          },
          {
            imageUrl: "./experienceImages/js.png",
            title: "JavaScript",
          },
          {
            imageUrl: "./experienceImages/node.png",
            title: "Node JS",
          },
          {
            imageUrl: "./experienceImages/github.png",
            title: "Github",
            addedClasses: "invert",
          },
          {
            imageUrl: "./experienceImages/sass.png",
            title: "Sass",
          },

          {
            imageUrl: "./experienceImages/postgres.png",
            title: "Postgress SQL",
          },
          {
            imageUrl: "./experienceImages/p2.png",
            title: "Python",
          },
          {
            imageUrl: "./experienceImages/arduino.png",
            title: "Arduino",
          },
        ],

        quotes: [
          {
            quote:
              "A journey will have pain and failure. It is not only the steps forward that we must accept. It is the stumbles... But if we stop, if we accept the person we are when we fall, the journey ends. That failure becomes our destination.",
            quoteAuthor: "Brandon Sanderson",
          },
          {
            quote: "Would you have a great empire? Rule over yourself",
            quoteAuthor: "Pubilius Syrus",
          },
          {
            quote:
              "I do not fear death. I had been dead for billions and billions of years before I was born, and had not suffered the slightest inconvenience from it.",
            quoteAuthor: "Mark Twain",
          },
          {
            quote: "We are dying every day.",
            quoteAuthor: "Seneca the Younger",
          },
          {
            quote:
              "Waste no more time arguing what a good man should be. Be One.",
            quoteAuthor: "Marcus Aurelius",
          },
          {
            quote:
              "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
            quoteAuthor: "Marcus Aurelius",
          },
        ],
      },
    },
  },
  reducers: {
    addPersons: (state, action) => {
      state.projects.push(action.payload);
    },
  },
});

export const selectPersonInformation = (state) => state.home.persons;
export const { addPerson } = homeSlice.actions;
export default homeSlice.reducer;
