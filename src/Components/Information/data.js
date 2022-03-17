export const projects = [
  {
    title: "Smart Band Project",
    subtitle: "Sensors, PCB, and Bluetooth",
    description: `The Smart Band project is the capstone project of the personal projects that I completed while attending university. 
      The goal of the project was to allow a user to control any smart device with gestures using a device like a Fitbit. 
      To do this, I designed and fabricated a small, printed circuit board (PCB) that could gather information, analyze a user’s motion, and determine what the gesture was. 
      The band would then relay this information to the device to which it was connected. To ensure only desired gestures were captured, a button was added to trigger the detection.
      The smart band also had the ability to connect to the smart home app below, giving it additional capabilities such as heart rate tracking and plotting, tracking exercises (including steps), and alarms. `,
    date: "November 2019",
    enddate: "May 2021",
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
    title: "Smart Home Project",
    subtitle: "Sensors, iOS, and Bluetooth",
    description: `The Smart home project is a culmination of various projects that I completed throughout my time at Carleton University. 
      I created an iOS smartphone app to control the various physical devices which I built. 
      The devices range from smart lights to smart switches, to smart blinds.  
      To connect a device to the app was as simple as touching the device's NFC tag to the phone, at which point the device could be completely controlled over BLE. 
      The app could also connect to the smart band I built.`,
    date: "November 2019",
    enddate: "May 2021",
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
    title: "Twitter Quote Bot",
    subtitle: "Automated quote plagerism from my favourite authors",
    description:
      "The Twitter Bot I built connected to an online quote repository (https://www.quotes.net/) which contains many of quotes from authors I admire (such as Marcus Aurelius and Seneca). The goal of the bot was to posts quotes to my Twitter timeline once a day. This was written in Python and deployed on Heroku. This bot was disabled to not spam my feed; however, the source code can be seen on my GitHub.",
    date: "April 2021",
    enddate: "April 2021",
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
    image: "./projectImages/twitterBot.png",
    link: "https://github.com/Tom-Sloan/TwitterBot",
  },
  {
    title: "Smart Pillbox",
    subtitle: "B. Eng Capstone Project: Tracking Pill Consumption",
    description:
      "The Smart Pillbox was the capstone project of my university degree. The goal of The Smart Pillbox project was to design and construct a medication storage device that will allow medical practitioners the ability to monitor consumption of medications, set reminders and alarms, and enable a locking mechanism, if required, for that given patient. This device was designed to help improve the lifestyles of patients and their caregivers who have memory loss illnesses. The device is now under the perview of Dr. Bruce Wallace, the proffersor who over saw the project. He is now attempting to produce commerical versions of the project to test its effectiveness.",
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
    title: "Reddit Client",
    subtitle: "Codecademy Full Stack Web Developer Porfolio Project",
    description: `Created a Reddit Client using the Reddit API and react. 
      Based the layout off of Pinterest, we decided to implement a version of reddit where new posts are displayed in columns, to allow quicker and more engaging viewing. There is a black diamond toggle button in the corner to change the number of columns, as well as some preloaded subreddits. 
      The search bar provides the user a method to display whatever reddit content they wish. The number of posts loaded is intentionally limited to a maximum 100 per subreddit to improve general performance`,
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
    title: "Automated Hydroponics System",
    subtitle: "Sensors, Pumps, and Free Food",
    description: `In an attempt to grow coffee hydroponically and locally in Ottawa, a drip automated hydroponic system was built. the system is currently in the 'alpha' stage and is being tested with several smaller plants that are easier to set up such as lettuce, and basil.
    The end result of the system will be for it to be contain Arbica coffee and green tea plants.`,
    date: "July 2021",
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
    ],
    image: "https://clipground.com/images/hydroponic-png-9.png",
    link: "https://en.wikipedia.org/wiki/Hydroponics",
  },
  {
    title: "Full stack development course",
    subtitle: "Front End and Back End, including React and Redux",
    description: `The Full Stack Development course by Codecademy was very useful at transitioning my development interests to more web-based projects. 
      This course was completed over the course of summer 2021. In total, I spent hundreds of hours improving my web development skills. 
      Throughout doing this course I took breaks to build extensive projects (such as my previous portfolio website! This site can be visited at: )`,
    date: "May 2021",
    enddate: "July 2021",
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
    description: `Transforming an antique wooden speed boat with rotted wood and various parts missing by my cousin and myself. 
    The boat is being remade with many technology improvement and include new smart devices. 
    The motor has been repaired, the wood replaces and the vessel is seaworthy again after decades of sitting around and wasting away.`,
    date: "July 2021",
    enddate: "Ongoing",
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
];

export const experience = [
  {
    workplace: "Telesat",
    title: "Satellite Engineering Co-op Student",
    tasks: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
    ],
    date: "May 2020",
    enddate: "December 2020",
    image: "./workPlaces/Tom/telesat.jpg",
  },
  {
    workplace: "Carleton University",
    title: "Researcher",
    tasks: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
    ],
    date: "May 2018",
    enddate: "April 2021",
    image: "./workPlaces/Tom/carletonUniversity.png",
  },
  {
    workplace: "City of Ottawa",
    title: "Lifeguard and Swimming Instructor",
    tasks: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.",
    ],
    date: "September 2015",
    enddate: "December 2017",
    image: "./workPlaces/Tom/cityOfOttawa.jfif",
  },
];
