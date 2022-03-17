import { createSlice } from "@reduxjs/toolkit";

export const experienceSlice = createSlice({
  name: "experiences",
  initialState: {
    experiences: {
      tom: [
        {
          workplace: "Telesat",
          title: "Satellite Engineering Co-op Student",
          keywords: ["tKinter", "MATLAB", "Python"],
          tasks: [
            "Made a python GUI using tKinter and connected GUI to MATLAB using MATLAB’s python application programming interface. This allowed an easier to use input interface for many MATLAB functions. This system was also able to receive and analyses all data that is returned to it using a very customizable plotting system. ",
            "Wrote a MATLAB interface to connect to a Python server that allowed for a variety of MATLAB functions (both native and user defined) to be called and returned all data in a proper format. This system contained extensive error checking and reliable feedback mechanisms. This system also was able to get around the native MATLAB deployment issue of requiring a MATLAB production server to have external GUIs running, allowing web applications and native apps to communicate easily with MATLAB.",
            "Wrote extensive amounts of tests and code to analysis satellite spectrum use. This allowed the further analysis of various international regulations tests such as regulation 1503 from the International Telecommunication Union. This code is vital for Telesat to operate its satellites within the bound of regulators and to ensure that various satellite operators are doing the same. ",
            "Analyzed the work of co-workers and created presentations of the impact of their work to be used in negotiations with other satellite operators.",
          ],
          date: "May 2020",
          enddate: "December 2020",
          image: "./workPlaces/Tom/telesat.jpg",
        },
        {
          workplace: "Carleton University",
          title: "Researcher",
          keywords: [
            "python",
            "MATLAB",
            "AWS",
            "Internet of Things",
            "Qt",
            "demonstrate",
          ],
          tasks: [
            "Designed and built the hardware for systems using custom components for non-invasive monitoring of key health markers of older adults, such as heart rate monitoring, respiration rate, and body fluid flow",
            "Wrote software to analyze the effectiveness of said hardware using MATLAB and python",
            "Integrated above device Samsung Smarthings using AWS",
            "Operated independently to find applications of using Arduino and the Internet of Things to improve the lifestyles of seniors. Focusing on usability and dependability, this resulted in automated devices that can be controlled by Bluetooth or over Wi-Fi",
            "Wrote the software that allows for easy control of those devices for iPhone and android application built with Qt",
            "Analyzed the work of co-workers and created presentations of their technology, allowing the laboratory to demonstrate the technology to many interested parties",
          ],
          date: "May 2018",
          enddate: "December 2021",
          image: "./workPlaces/Tom/carletonUniversity.png",
        },
        {
          workplace: "City of Ottawa",
          title: "Lifeguard and Swimming Instructor",
          // tasks: [
          //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
          //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
          //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
          // ],
          date: "September 2015",
          enddate: "December 2017",
          image: "./workPlaces/Tom/cityOfOttawa.jfif",
        },
      ],
      dan: [
        {
          workplace: "Flex Ltd.",
          title: "Hardware Engineer",
          keywords: [
            "Robotics",
            "Embedded",
            " C ",
            "ROS2",
            "Schematic",
            "Layout",
          ],
          tasks: [
            "Robotics embedded software development with C using the ROS2.",
            "Schematic and PCB Layout Verification.",
          ],
          date: "July 2021",
          enddate: "Ongoing",
          image:
            "https://media-exp1.licdn.com/dms/image/C560BAQG-uC0kKRx9og/company-logo_100_100/0/1622557482171?e=1632355200&v=beta&t=SmrjF92KJzW6iPUx_EfF4tncuvPSlCXcq4mfzqOJZuk",
        },
        {
          workplace: "Telesat",
          title: "Satellite Engineering Co-op Student",
          keywords: ["Python", "Javascript", "PHP", "HTML", "MySQL"],
          tasks: [
            "Wrote several Python scripts used for a variety of functions such as transferring data collected at ground sites onto a database using MySQL and pandas and generating perform scripts.",
            "Designed a webpage with PHP, Javascript, and HTML along with the HighChart and JQWidget libraries to display satellite datasets in pre-determined templates.",
            "Began the development of a machine learning algorithm to correlate satellite datasets for operator use.",
          ],
          date: "January 2021",
          enddate: "May 2021",
          image:
            "https://media-exp1.licdn.com/dms/image/C4D0BAQEmShEVT95NkA/company-logo_100_100/0/1620856752076?e=1632355200&v=beta&t=8i3YrA2o_G31QALzAW09KF1EOgDKQ7O3xj_deG_LTrM",
        },
        {
          workplace: "Flex Ltd.",
          title: "Electrical Engineering Student",
          keywords: ["Schematic", "Layout", "Verilog", "Python"],
          tasks: [
            "Designed and developed the schematic, PCB layout, and Verilog code for a device which uses multiple communication techniques to relay a select set of data from chosen sensors to a user.",
            "Organized a team to perform a testing subset for a physical media processing solution worth several million dollars which included verification of specifications, multidisciplinary testing, and part management.",
            "Wrote several Python scripts used to verify specifications and operability of a complex interconnection of PCBs and circuitry for a major site project.",
            "Completed power distribution tests in a student team for a PCB utilizing thermal chambers, oscilloscopes, and multimeters while communicating with on-board microcontrollers through a terminal emulator to a Linux system.",
            "Verified the schematic symbols and PCB footprints for several hundred components for a major site project.",
          ],
          date: "May 2019",
          enddate: "September 2020",
          image:
            "https://media-exp1.licdn.com/dms/image/C560BAQG-uC0kKRx9og/company-logo_100_100/0/1622557482171?e=1632355200&v=beta&t=SmrjF92KJzW6iPUx_EfF4tncuvPSlCXcq4mfzqOJZuk",
        },
        {
          workplace: "Canadian Armed Forces",
          title: "Private in the Primary Reserve",
          tasks: [
            "Regularly contribute to a variety of military exercises to train in basic military practices and in information and communication technology as an Army Communication and Information System Specialist (ACISS).",
          ],
          date: "September 2018",
          enddate: "Ongoing",
          image:
            "https://media-exp1.licdn.com/dms/image/C4D0BAQHcJHtgg_SYpA/company-logo_100_100/0/1519855866269?e=1632355200&v=beta&t=Alp1t1RTYHf4AbkojTiUPmbAeDdyf3KFtNVUw9agKEw",
        },
      ],
    },
  },
  reducers: {
    addExperience: (state, action) => {
      state.experiences.push(action.payload);
    },
  },
});

export const selectExperienceArray = (state) => state.experience.experiences;
export const { addExperience } = experienceSlice.actions;
export default experienceSlice.reducer;
