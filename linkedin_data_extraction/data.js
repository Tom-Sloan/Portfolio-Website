// Portfolio Data - Single source of truth
// Update this file to change the website content

const portfolioData = {
	profile: {
		name: "Tom Sloan",
		headline: "Robot Vision Engineer & AI Researcher",
		location: "Ottawa, Ontario, Canada",
		image: "images/profile/tom-sloan-profile.png",
		about: [
			"Robot Vision Engineer specializing in SLAM, computer vision, and drone-based 3D mapping systems. Expertise in AWS, Docker, Python, and embedded systems. Constantly working on projects to push the boundaries of autonomous systems and AI.",
			"Carleton University Computer Systems Engineering graduate with distinction, I'll be defending my Master's of Applied Science in Electrical and Computer Engineering with focus on Neural SLAM and augmented reality applications in November 2025.",
			"Currently working as a Researcher at Carleton University developing real-time indoor 3D mapping systems using consumer drones, cloud-based SLAM, and AR visualization. Previous experience includes DevOps engineering at Magnet Forensics and spectrum engineering at Telesat.",
		],
		links: {
			linkedin: "https://www.linkedin.com/in/tom-sloan",
			portfolio: "https://tom-sloan.com",
			github: "https://github.com/Tom-Sloan",
		},
	},

	education: [
		{
			school: "Carleton University",
			degree: "Master of Applied Science - MASc",
			field: "Electrical and Computer Engineering",
			startDate: "January 2024",
			endDate: "November 2025",
			current: true,
			grade: null,
			description:
				"Thesis: Indoor 3D Modeling Using Consumer Drones and Neural Simultaneous Localization and Mapping (SLAM) for Virtual Reality and a Cloud Architecture. Defending November 2025.",
			logo: "images/companies/carleton-university.png",
		},
		{
			school: "Carleton University",
			degree: "Bachelor of Engineering - BE",
			field: "Computer Systems",
			startDate: "September 2017",
			endDate: "December 2021",
			current: false,
			grade: "Graduated with distinction",
			description:
				"Computer Systems Engineering covering hardware, software, and systems design with strong foundation in embedded systems and circuit design.",
			logo: "images/companies/carleton-university.png",
		},
	],

	experience: [
		{
			company: "Carleton University",
			title: "Researcher",
			employmentType: "Full-time",
			location: "Ottawa, Ontario, Canada",
			startDate: "October 2023",
			endDate: "Present",
			current: true,
			description:
				"Led the design and testing of a real-time indoor 3D mapping system using a consumer drone (DJI Mini 3), integrating monocular camera and IMU with cloud-based SLAM framework for AR applications. Implemented modular software architecture using Docker, RabbitMQ, and React.js to offload high-computation tasks to remote server, enabling real-time visualization on desktop and AR headsets.",
			skills: [
				"Docker",
				"RabbitMQ",
				"React.js",
				"Unity",
				"SLAM",
				"AR",
				"Computer Vision",
				"Python",
			],
			logo: "images/companies/carleton-university.png",
		},
		{
			company: "Magnet Forensics",
			title: "DevOps Engineer",
			employmentType: "Permanent Full-time",
			location: "Ottawa, Ontario, Canada",
			startDate: "April 2022",
			endDate: "June 2023",
			current: false,
			description:
				"Worked in a small team environment using DevOps tools including Jenkins, Linux, Python and PowerShell to help manage thousands of software builds a day on dozens of on-premise servers. Helped with the migration from on-premise to AWS cloud using CloudFormation and EC2.",
			skills: [
				"Jenkins",
				"Linux",
				"Python",
				"PowerShell",
				"AWS",
				"CloudFormation",
				"EC2",
			],
			logo: "images/companies/magnet-forensics.png",
		},
		{
			company: "Telesat",
			title: "Spectrum Engineering Co-Op",
			employmentType: "Full-time Internship",
			location: "Ottawa/Kanata, Ontario",
			startDate: "May 2020",
			endDate: "December 2021",
			current: false,
			description:
				"Made an alternative user interface and API in Python to interact with MATLAB giving the ability to directly use satellite XML data without requiring expensive MATLAB add-ons. Wrote extensive tests and code to analyze satellite spectrum use for international telecommunications regulations.",
			skills: ["Python", "MATLAB", "Telecommunications", "Satellite"],
			logo: "images/companies/telesat.jpg",
		},
		{
			company: "Carleton University",
			title: "Research/Teaching Assistant",
			employmentType: "Part-time",
			location: "Ottawa, Canada",
			startDate: "May 2018",
			endDate: "December 2021",
			current: false,
			description:
				"Designed and built prototype hardware systems for non-invasive monitoring of key health markers (heart rate, respiration rate, body fluid flow) in older adults. Collaborated with faculty and graduate students on health-monitoring research projects while providing teaching assistance and laboratory instruction for computer engineering courses.",
			skills: [
				"Hardware Design",
				"Sensors",
				"Data Acquisition",
				"Python",
				"C/C++",
				"Teaching",
				"Research",
			],
			logo: "images/companies/carleton-university.png",
		},
	],

	projects: [
		{
			title: "Master's Thesis in Artificial Intelligence",
			subtitle: "AI Research",
			description:
				"Current research in advanced AI and machine learning at Carleton University. Exploring novel approaches to intelligent systems with focus on practical applications and theoretical foundations. Expected completion: October 2025.",
			startDate: "January 2024",
			endDate: "October 2025",
			current: true,
			category: [
				{ tag: "AI Research", color: "#0077B5" },
				{ tag: "In Progress", color: "#22c55e" },
			],
			image: "images/thesis/thesis-main-visualization.png",
			link: "https://github.com/Tom-Sloan/WorldSystem",
			featured: true,
		},
		{
			title: "Smart Band Project",
			subtitle: "Sensors, PCB, and Bluetooth",
			description:
				"The Smart Band project is the personal projects that I completed while attending university. The goal of the project was to allow a user to control any smart device with gestures using a device like a Fitbit. To do this, I designed and fabricated a small, printed circuit board (PCB) that could gather information, analyze a user's motion, and determine what the gesture was. The band would then relay this information to the device to which it was connected.",
			startDate: "November 2019",
			endDate: "May 2021",
			current: false,
			category: [
				{ tag: "Hardware", color: "#66023C" },
				{ tag: "Programming", color: "#149e5e" },
				{ tag: "IoT", color: "#00ADCC" },
			],
			image: "images/projects/smartBand.gif",
			link: "https://github.com/Tom-Sloan/Smart-Home-Project/tree/master/SmartBand",
			featured: true,
		},
		{
			title: "Smart Home Project",
			subtitle: "Sensors, iOS, and Bluetooth",
			description:
				"The Smart home project is a culmination of various projects that I completed throughout my time at Carleton University. I created an iOS smartphone app to control the various physical devices which I built. The devices range from smart lights to smart switches, to smart blinds. To connect a device to the app was as simple as touching the device's NFC tag to the phone, at which point the device could be completely controlled over BLE.",
			startDate: "November 2019",
			endDate: "May 2021",
			current: false,
			category: [
				{ tag: "Hardware", color: "#66023C" },
				{ tag: "Programming", color: "#149e5e" },
				{ tag: "IoT", color: "#00ADCC" },
			],
			image: "images/projects/smartHome.gif",
			link: "https://github.com/Tom-Sloan/Smart-Home-Project",
			featured: true,
		},
		{
			title: "Smart Pillbox",
			subtitle: "Medical Device",
			description:
				"A medication storage device designed as a product mockup for adults with dementia and their caregivers. The system allows medical practitioners to monitor medication consumption, set reminders and alarms, and enable a locking mechanism if required. This device was designed to help improve the lifestyles of patients and their caregivers.",
			startDate: "August 2020",
			endDate: "April 2021",
			current: false,
			category: [
				{ tag: "Hardware", color: "#66023C" },
				{ tag: "IoT", color: "#00ADCC" },
			],
			image: "images/projects/pillbox1.jpg",
			link: null,
			featured: true,
		},
		{
			title: "LidarWorld",
			subtitle: "Interactive 3D LiDAR Sensor Simulation",
			description:
				"Built an interactive 3D LiDAR sensor simulation using React Three Fiber and Three.js to enable real-time visualization and testing of LiDAR sensors in customizable room environments. The application features procedurally generated room layouts with randomized geometry and furniture placement, real-time raycasting for object detection visualization, and multiple configurable sensor types with adjustable positioning. Implemented a grid-based spatial analysis system for sensor coverage evaluation, interactive 3D controls with 360-degree rotation, and a Leva control panel for real-time parameter adjustments.",
			startDate: "December 2023",
			endDate: "November 2025",
			current: true,
			category: [
				{ tag: "Web Development", color: "#FB4D3D" },
				{ tag: "3D Graphics", color: "#8b5cf6" },
				{ tag: "Programming", color: "#149e5e" },
			],
			image: "images/projects/lidarworld.png",
			link: null,
			featured: true,
		},
		{
			title: "Hound Dog - Family Card Game",
			subtitle: "Cross-Platform Mobile Card Game",
			description:
				"Brought a beloved family card game from my childhood to digital life using React Native and Expo. The application features real-time multiplayer gameplay with Socket.io, AI opponents with configurable difficulty levels, and a polished user interface supporting both iOS and Android platforms. Implemented with TypeScript, Zustand for state management, and Expo Router for navigation, delivering a comprehensive gaming experience with full rule support and special card mechanics.",
			startDate: "April 2025",
			endDate: "July 2025",
			current: false,
			category: [
				{ tag: "Mobile Dev", color: "#10b981" },
				{ tag: "Programming", color: "#149e5e" },
				{ tag: "Web Development", color: "#FB4D3D" },
			],
			image: "https://cdn-icons-png.flaticon.com/512/3159/3159310.png",
			link: null,
			featured: false,
		},
		{
			title: "Speakeasy - AI-Enhanced Social Podcast Platform",
			subtitle: "Full-Stack Mobile Podcast Application",
			description:
				"Built a full-stack mobile podcast platform using React Native and Expo with AI-powered conversational features. The application integrates the PodcastIndex API with a FastAPI backend, PostgreSQL database via Supabase, and Redis caching to deliver real-time audio streaming with background playback support. Implemented JWT authentication for both registered and anonymous users, with Row-Level Security policies for secure multi-tenant data access. The platform features podcast discovery, personalized subscriptions, listening progress tracking, and social interactions, with a multi-layer caching system reducing API calls by 70%.",
			startDate: "April 2025",
			endDate: "November 2025",
			current: false,
			category: [
				{ tag: "Mobile Dev", color: "#10b981" },
				{ tag: "Programming", color: "#149e5e" },
				{ tag: "Web Development", color: "#FB4D3D" },
			],
			image: "https://cdn-icons-png.flaticon.com/512/3845/3845874.png",
			link: null,
			featured: false,
		},
		{
			title: "Algorithmic Trading in Python",
			subtitle: "Quantitative Trading Strategies",
			description:
				"Developed three algorithmic trading strategies in Python using quantitative analysis techniques. Built equal-weight portfolio rebalancing, momentum-based investing, and value investing calculators that pull real-time market data via the IEX Cloud API. The system uses pandas and numpy to calculate optimal stock portfolio allocations and generates formatted Excel reports with purchase recommendations for S&P 500 securities.",
			startDate: "July 2020",
			endDate: "December 2020",
			current: false,
			category: [
				{ tag: "Programming", color: "#149e5e" },
				{ tag: "Data Science", color: "#8b5cf6" },
			],
			image: "https://cdn-icons-png.flaticon.com/512/2962/2962818.png",
			link: null,
			featured: false,
		},
		{
			title: "Reddit Client",
			subtitle: "Codecademy Full Stack Web Developer Portfolio Project",
			description:
				"Created a Reddit Client using the Reddit API and react. Based the layout off of Pinterest, we decided to implement a version of reddit where new posts are displayed in columns, to allow quicker and more engaging viewing. There is a black diamond toggle button in the corner to change the number of columns, as well as some preloaded subreddits. The search bar provides the user a method to display whatever reddit content they wish.",
			startDate: "June 2020",
			endDate: "June 2020",
			current: false,
			category: [{ tag: "Web Development", color: "#FB4D3D" }],
			image: "images/projects/redditClient.png",
			link: null,
			featured: false,
		},
		{
			title: "Twitter Quote Bot",
			subtitle: "Automated quote plagiarism from my favourite authors",
			description:
				"The Twitter Bot I built connected to an online quote repository (https://www.quotes.net/) which contains many of quotes from authors I admire (such as Marcus Aurelius and Seneca). The goal of the bot was to posts quotes to my Twitter timeline once a day. This was written in Python and deployed on Heroku. This bot was disabled to not spam my feed; however, the source code can be seen on my GitHub.",
			startDate: "April 2021",
			endDate: "April 2021",
			current: false,
			category: [
				{ tag: "Web Development", color: "#FB4D3D" },
				{ tag: "IoT", color: "#00ADCC" },
			],
			image: "images/projects/twitterBot.png",
			link: "https://github.com/Tom-Sloan/TwitterBot",
			featured: true,
		},
		{
			title: "Automated Hydroponics System",
			subtitle: "Sensors, Pumps, and Free Food",
			description:
				"In an attempt to grow coffee hydroponically and locally in Ottawa, a drip automated hydroponic system was built. The system is currently in the 'alpha' stage and is being tested with several smaller plants that are easier to set up such as lettuce, and basil. The end result of the system will be for it to contain Arabica coffee and green tea plants.",
			startDate: "July 2021",
			endDate: "Ongoing",
			current: false,
			category: [
				{ tag: "Hardware", color: "#66023C" },
				{ tag: "Embedded", color: "#042A2B" },
			],
			image: "https://clipground.com/images/hydroponic-png-9.png",
			link: null,
			featured: false,
		},
		{
			title: "Full Stack Development Course",
			subtitle: "Front End and Back End, including React and Redux",
			description:
				"The Full Stack Development course by Codecademy was very useful at transitioning my development interests to more web-based projects. This course was completed over the course of summer 2021. In total, I spent hundreds of hours improving my web development skills. Throughout doing this course I took breaks to build extensive projects (such as my previous portfolio website!).",
			startDate: "May 2021",
			endDate: "July 2021",
			current: false,
			category: [{ tag: "Web Development", color: "#FB4D3D" }],
			image: "https://www.credibll.com/build/images/campaign/full-stack-icons/junior-icon.png",
			link: null,
			featured: false,
		},
		{
			title: "Boat Refurbishment",
			subtitle: "New Hardware Implementation and Restoration",
			description:
				"Transforming an antique wooden speed boat with rotted wood and various parts missing by my cousin and myself. The boat is being remade with many technology improvement and include new smart devices. The motor has been repaired, the wood replaced and the vessel is seaworthy again after decades of sitting around and wasting away.",
			startDate: "July 2021",
			endDate: "Ongoing",
			current: false,
			category: [
				{ tag: "Hardware", color: "#66023C" },
				{ tag: "IoT", color: "#00ADCC" },
			],
			image: "https://pluspng.com/img-png/row-boat-png-hd-small-fishing-boat-1754.png",
			link: null,
			featured: false,
		},
	],

	skills: {
		"Programming Languages": [
			{ name: "Python", icon: "images/skills/python.png" },
			{ name: "C/C++", icon: "images/skills/c-language.png" },
			{ name: "JavaScript", icon: "images/skills/javascript.png" },
			{ name: "MATLAB", icon: "images/skills/matlab.png" },
		],
		"AI & Computer Vision": [
			{ name: "PyTorch", icon: "images/skills/pytorch.png" },
			{ name: "SLAM", icon: "images/skills/slam.png" },
			{ name: "Unity", icon: "images/skills/unity.png" },
			{
				name: "Computer Vision",
				icon: "images/skills/computer-vision.png",
			},
		],
		"Cloud & DevOps": [
			{ name: "AWS", icon: "images/skills/aws.png" },
			{ name: "Docker", icon: "images/skills/docker.png" },
			{ name: "Jenkins", icon: "images/skills/jenkins.png" },
			{ name: "Linux", icon: "images/skills/linux.png" },
			{ name: "RabbitMQ", icon: "images/skills/rabbitmq.png" },
		],
		"Web Development": [
			{ name: "React", icon: "images/skills/react.png" },
			{ name: "Node.js", icon: "images/skills/nodejs.png" },
			{ name: "Redux", icon: "images/skills/redux.png" },
			{ name: "HTML/CSS", icon: "images/skills/html.png" },
			{ name: "Sass", icon: "images/skills/sass.png" },
		],
		"Databases & Backend": [
			{ name: "PostgreSQL", icon: "images/skills/postgresql.png" },
			{ name: "MySQL", icon: "images/skills/mysql.png" },
			{ name: "Firebase", icon: "images/skills/firebase.png" },
			{ name: "Git/GitHub", icon: "images/skills/github.png" },
		],
		"Hardware & Embedded": [
			{ name: "PCB Design", icon: "images/skills/pcb-design.png" },
			{ name: "MCU", icon: "images/skills/microcontroller.png" },
			{ name: "Arduino", icon: "images/skills/arduino.png" },
			{ name: "FPGA", icon: "images/skills/fpga.png" },
			{ name: "Circuits", icon: "images/skills/circuit-design.png" },
		],
	},

	certifications: [
		{
			name: "AWS Security Specialty",
			organization: "Amazon Web Services (AWS)",
			issueDate: "October 2022",
			expirationDate: "October 2025",
			description: "Validates expertise in AWS security solutions",
			credentialUrl:
				"https://www.credly.com/badges/c5e97a97-e61e-41b4-aa37-e03b6d62a3fa",
			badgeImage: "images/certifications/aws-security-specialty.png",
		},
		{
			name: "AWS Certified SysOps Administrator – Associate",
			organization: "Amazon Web Services (AWS)",
			issueDate: "May 2022",
			expirationDate: "May 2025",
			description:
				"Validates technical expertise in deployment, management, and operations on AWS",
			credentialUrl: "https://www.credly.com/badges/",
			badgeImage: "images/certifications/aws-sysops-administrator.png",
		},
		{
			name: "AWS Certified Solutions Architect – Associate",
			organization: "Amazon Web Services (AWS)",
			issueDate: "January 2022",
			expirationDate: "January 2025",
			description:
				"Validates ability to design and implement distributed systems on AWS",
			credentialUrl: "https://www.credly.com/badges/",
			badgeImage: "images/certifications/aws-solutions-architect.png",
		},
		{
			name: "AWS Certified Developer – Associate",
			organization: "Amazon Web Services (AWS)",
			issueDate: "February 2022",
			expirationDate: "February 2025",
			description:
				"Validates expertise in developing and maintaining AWS-based applications",
			credentialUrl: "https://www.credly.com/badges/",
			badgeImage: "images/certifications/aws-developer.png",
		},
		{
			name: "AWS Cloud Practitioner",
			organization: "Amazon Web Services (AWS)",
			issueDate: "July 2020",
			expirationDate: "May 2025",
			description: "Fundamental AWS Cloud knowledge",
			credentialUrl:
				"https://www.credly.com/badges/c9afdb1e-f344-459e-b580-4534fae732d3",
			badgeImage: "images/certifications/aws-cloud-practitioner.png",
		},
	],

	resume: {
		path: "resume/Tom Sloan CV Oct 2025 - Website.pdf",
		title: "Tom Sloan - Resume",
		description:
			"Download my complete resume for detailed information about my education, experience, and skills.",
	},
};

// Export for use in HTML
if (typeof module !== "undefined" && module.exports) {
	module.exports = portfolioData;
}
