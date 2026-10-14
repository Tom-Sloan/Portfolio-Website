// Portfolio Data - Single source of truth
// Update this file to change the website content

const portfolioData = {
	profile: {
		name: "Tom Sloan",
		headline: "Payload Sensor Specialist at NRC Aerospace",
		location: "Nepean, Ontario, Canada",
		about: [
			"I integrate sensors into autonomous systems and build the software that makes their data usable. At the National Research Council Canada's Aerospace Research Centre, I integrate and test sensor payloads on aircraft, including drones.",
			"I finished my MASc at Carleton, where I built a drone-based indoor mapping system using neural SLAM.",
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
			field: "Artificial Intelligence",
			startDate: "January 2024",
			endDate: "November 2025",
			description: "Indoor 3D modeling with consumer drones and neural SLAM.",
		},
		{
			school: "Carleton University",
			degree: "Bachelor of Engineering - BE",
			field: "Computer Systems Engineering",
			startDate: "September 2017",
			endDate: "December 2021",
			description: "Graduated with distinction.",
		},
	],

	experience: [
		{
			company: "National Research Council Canada",
			title: "Payload Sensor Specialist",
			location: "Ottawa, Ontario, Canada",
			startDate: "July 2026",
			endDate: "Present",
			current: true,
			description:
				"I integrate and test sensor payloads on NRC aircraft, including drones.",
			skills: ["Flight Test", "UAV", "Sensor Integration", "Georeferencing"],
		},
		{
			company: "SAM3",
			title: "Machine Learning Researcher",
			location: "Ottawa, Ontario, Canada",
			startDate: "November 2025",
			endDate: "July 2026",
			description:
				"Calibrated multi-modal sensors and built time-series pipelines for health monitoring.",
			skills: ["PyTorch", "Time-Series Analysis", "IoT Sensors", "Python"],
		},
		{
			company: "Carleton University",
			title: "Research Assistant",
			location: "Ottawa, Ontario, Canada",
			startDate: "October 2023",
			endDate: "November 2025",
			description:
				"Flight-tested a DJI Mini 3 sensor payload and built a cloud SLAM pipeline.",
			skills: ["Docker", "RabbitMQ", "SLAM", "Camera Calibration", "Python"],
		},
		{
			company: "Magnet Forensics",
			title: "DevOps Engineer",
			location: "Ottawa, Ontario, Canada",
			startDate: "April 2022",
			endDate: "June 2023",
			description:
				"Maintained CI/CD at 2,000+ builds a day and helped migrate build systems to AWS.",
			skills: ["Jenkins", "AWS", "CloudFormation", "Python"],
		},
		{
			company: "Carleton University",
			title: "Researcher",
			location: "Ottawa, Ontario, Canada",
			startDate: "May 2018",
			endDate: "December 2021",
			description:
				"Built PCB sensor arrays for non-invasive health monitoring of older adults.",
			skills: ["Hardware Design", "Sensors", "MATLAB", "C/C++"],
		},
		{
			company: "Telesat",
			title: "Spectrum Engineering Intern",
			location: "Ottawa/Kanata, Ontario",
			startDate: "May 2020",
			endDate: "December 2020",
			description:
				"Built a Python interface to MATLAB for satellite spectrum data and ITU compliance checks.",
			skills: ["Python", "MATLAB", "Satellite"],
		},
	],

	projects: [
		{
			title: "MASc Thesis: Neural SLAM for Indoor 3D Mapping",
			description:
				"A cloud-assisted SLAM framework for autonomous indoor mapping with a DJI Mini 3. I compared ORB-SLAM3 with neural SLAM (SLAM3R) and reached 6.61 cm RMSE at 21 FPS on Replica. The WorldSystem platform streams live drone video through Docker, RabbitMQ and React into real-time 3D reconstructions for AR headsets.",
			category: [{ tag: "AI Research", color: "#38BDF8" }],
			technologies: ["Python", "PyTorch", "Docker", "RabbitMQ", "C++/CUDA"],
			link: "https://github.com/Tom-Sloan/WorldSystem",
		},
		{
			title: "LeRobot SO-101",
			description:
				"A 6-DOF robotic arm with leader-follower teleoperation. I collect demonstrations, train imitation learning policies on a Jetson Orin Nano, and am now training in NVIDIA Isaac Sim for sim-to-real transfer.",
			category: [{ tag: "Robotics", color: "#38BDF8" }],
			technologies: ["Python", "LeRobot", "PyTorch", "Isaac Sim"],
			link: "https://huggingface.co/docs/lerobot/so101",
		},
		{
			title: "drone-ai",
			description:
				"A ROS 2 drone that flies indoors without GPS, using monocular visual SLAM and a SegNeXt network that estimates 6-DOF velocity from motion blur. It runs on a Jetson Orin Nano.",
			category: [{ tag: "Robotics", color: "#38BDF8" }],
			technologies: ["ROS 2", "Python", "PyTorch", "Jetson Orin Nano"],
			link: null,
		},
		{
			title: "Portfolio MCP Server",
			description:
				"An MCP server on a Netlify serverless function so AI assistants can query this portfolio's data directly instead of relying on stale training data.",
			category: [{ tag: "AI Integration", color: "#8b5cf6" }],
			technologies: ["TypeScript", "Node.js", "MCP SDK", "Zod"],
			link: "https://github.com/Tom-Sloan/Portfolio-Website",
		},
	],

	certifications: [
		{
			name: "Transport Canada Small RPAS (VLOS) Basic Operations",
			organization: "Transport Canada",
			issueDate: "March 2026",
			description: "Pilot certificate for basic operations of small RPAS in visual line-of-sight",
		},
		{
			name: "AWS Certified Machine Learning Engineer - Associate",
			organization: "Amazon Web Services (AWS)",
			issueDate: "November 2025",
			description: "Implementing ML workloads in production on AWS",
			credentialUrl:
				"https://www.credly.com/badges/9ae1b780-1c2c-4b5a-b25f-c9fad4707140",
		},
		{
			name: "AWS Certified Security - Specialty",
			organization: "Amazon Web Services",
		},
		{
			name: "AWS Certified SysOps Administrator - Associate",
			organization: "Amazon Web Services",
		},
		{
			name: "AWS Certified Developer - Associate",
			organization: "Amazon Web Services",
		},
		{
			name: "AWS Certified Solutions Architect - Associate",
			organization: "Amazon Web Services",
		},
		{
			name: "AWS Certified Cloud Practitioner",
			organization: "Amazon Web Services",
		},
		{
			name: "Canadian Securities Course",
			organization: "Canadian Securities Institute (CSI)",
			issueDate: "August 2018",
			description: "Canadian capital markets, securities, and investment products",
			credentialUrl:
				"https://www.credly.com/earner/earned/badge/565999ea-75d7-4ad5-996c-e33ca6f0e8e1",
		},
	],

	skills: {
		"Sensors & Autonomy": [
			{ name: "Sensor Integration" },
			{ name: "Camera Calibration" },
			{ name: "Georeferencing" },
			{ name: "SLAM" },
			{ name: "ROS 2" },
		],
		"Languages": [
			{ name: "Python" },
			{ name: "C/C++" },
			{ name: "MATLAB" },
			{ name: "TypeScript" },
		],
		"AI & Cloud": [
			{ name: "PyTorch" },
			{ name: "OpenCV" },
			{ name: "AWS" },
			{ name: "Docker" },
			{ name: "Linux" },
		],
	},

	publications: [
		{
			title: "Drone-Based Indoor Mapping for Augmented Indoor 3D Modeling Using Neural Simultaneous Localization and Mapping (SLAM)",
			authors: ["T. Sloan", "B. Wallace", "R. Goubran"],
			conference:
				"2026 IEEE 44th International Conference on Consumer Electronics (ICCE)",
			location: "Dubai, UAE",
			year: 2026,
			keywords: ["Neural SLAM", "Indoor mapping", "Drones"],
		},
		{
			title: "System for Drone-Based Indoor Mapping for Augmented Reality",
			authors: ["T. Sloan", "B. Wallace", "R. Goubran"],
			conference:
				"2025 IEEE International Instrumentation and Measurement Technology Conference (I2MTC)",
			location: "Chemnitz, Germany",
			year: 2025,
			url: "https://doi.org/10.1109/I2MTC62753.2025.11079049",
			keywords: ["SLAM", "Indoor mapping", "Augmented reality"],
		},
		{
			title: "Impact of Image Resolution on Controlling Drones Using Remote VR Headset Visualization and a Cloud Architecture",
			authors: ["T. Sloan", "B. Wallace", "R. Goubran"],
			conference: "2025 IEEE Sensors Applications Symposium (SAS)",
			location: "Newcastle, United Kingdom",
			year: 2025,
			url: "https://doi.org/10.1109/SAS65169.2025.11105183",
			keywords: ["Virtual reality", "Teleoperation", "Drones"],
		},
	],
};

// Export for use in HTML
if (typeof module !== "undefined" && module.exports) {
	module.exports = portfolioData;
}
