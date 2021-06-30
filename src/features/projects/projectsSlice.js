import { createSlice } from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {
      tom: [
        {
          title: "Reddit Client",
          subtitle: "Codecademy Full Stack Web Developer Porfolio Project",
          description:
            "While completing the Codecademy Full stack developer course, Dan and I decided to test our skills by completing a desktop Reddit Client. Based off Pinterest, we decided to implement a version of reddit where new posts are displayed in columns, to allow quicker and more engaging viewing. There is a black diamond toggle button in the corner to change the number of columns, as well as some preloaded subreddits. The search bar provides the user a method to display whatever reddit content they wish. The number of posts loaded is intentionally limited to a maximum 100 per subreddit.",
          date: "June 2020",
          enddate: "June 2020",
          category: [
            {
              tag: "Web Development",
              color: "#FB4D3D",
            },
          ],
          image: "./projectImages/redditClient.png",
          link: "https://tomanddanredditclient.netlify.app/",
        },
        {
          title: "Smart Home Project",
          subtitle: "Sensors, iOS, and Bluetooth",
          description:
            "The Smart home project is a culmination of various projects that I completed throughout my time at Carleton University. There is an iOS smartphone app, and various physical devises that I built that could be controlled by it. The devices range from smart lights to smart switches, to smart blinds.  To connect the device to the app was as simple as touching the devices NFC tag to the phone, at which point the device could be completely controlled over BLE. The app could also connect to the smart band I built. With the smart band, the app also had the ability for heart rate tracking and plotting, tracking exercises (including steps), and alarms.",
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
            {
              tag: "IoT",
              color: "#00ADCC",
            },
          ],
          image: "./projectImages/smartHome.gif",
          link: "https://github.com/Tom-Sloan/Smart-Home-Project",
        },
        {
          title: "Smart Band Project",
          subtitle: "Sensors, PCB, and Bluetooth",
          description:
            "The Smart Band project is the capstone project of the personal projects that I completed while attending university. The goal of the project was to allow a user to control any smart device with gestures using a device like a Fitbit. To do this, designed and fabricated a small, printed circuit board (PCB) that could gather information analyses a user’s motion and figure out what the gesture. The band would then relay this information to the device it was connected to. To make sure only desired gestures were captured, a button was added to trigger the detection. ",
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
            {
              tag: "IoT",
              color: "#00ADCC",
            },
          ],
          image: "./projectImages/smartBand.gif",
          link: "https://github.com/Tom-Sloan/Smart-Home-Project/tree/master/SmartBand",
        },
        {
          title: "Twitter Quote Bot",
          subtitle: "Automated quote plagerism from my favorite authors",
          description:
            "The Twitter Bot I built connected to an online quote repository (https://www.quotes.net/) that contains lots of quotes from authors I like (such as Marcus Aurelius and Seneca). The goal of the bot was to posts quotes to my Twitter timeline once a day. This was written in python and deployed on Heroku. This bot was disabled to not spam my feed; however, the source code can be seen on my GitHub.",
          date: "April 2021",
          enddate: "Ongoing",
          category: [
            {
              tag: "Web Development",
              color: "#FB4D3D",
            },
            {
              tag: "IoT",
              color: "#00ADCC",
            },
          ],
          image:
            "./projectImages/twitterBot.png",
          link: "https://github.com/Tom-Sloan/TwitterBot",
        },
        {
          title: "Smart Pillbox",
          subtitle: "B. Eng Capstone Project: Tracking Pill Consumption",
          description:
            "The smart pillbox was the capstone project of my university degree. The goal of The Smart Pillbox project was to design and construct a medication storage device that will allow medical practitioners the ability to monitor consumption of medications, set reminders and alarms, and enable a locking mechanism, if required, for that given patient. This device was designed to help improve the lifestyles of patients and their caregivers who have memory loss illnesses. ",
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
          image: "./projectImages/pillbox1.jpg",
          link: "https://en.wikipedia.org/wiki/Smart_device",
        },
        {
          title: "Full stack development course",
          subtitle: "Front End and Back End, including React and Redux",
          description:
            "The Full Stack Development course by Codecademy was very useful at transitioning my development interests to more web-based projects. This course was completed over the course of summer 2021. In total, I spent hundreds of hours improving my web development skills. Throughout doing this course I took breaks to build extensive projects (such as this website!). This was done to engrain the proper coding patterns into me.",
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
      ],
      dan: [
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
          image: "./projectImages/redditClient.png",
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
          image: "./projectImages/pillbox1.jpg",
          link: "https://en.wikipedia.org/wiki/Smart_device",
        },
        {
          title: "Full stack development course",
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
