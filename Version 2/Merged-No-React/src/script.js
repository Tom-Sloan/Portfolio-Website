import "./style.css";
import Experience from "./Experience/Experience.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

const labels = [
  { classes: ["label"], label: "Projects" },
  { classes: ["label", "centerLabel"], label: "Resume" },
  { classes: ["label"], label: "Contact Info" },
];

const clicked = (e, i) => {
  e.stopPropagation();
};
const loadTitleBar = () => {
  const titlebar = document.createElement("div");
  titlebar.classList.add("titleHeader");

  labels.forEach((n, i) => {
    const elm = document.createElement("div");
    n.classes.forEach((n) => elm.classList.add(n));
    const newContent = document.createTextNode(n.label);
    elm.appendChild(newContent);
    elm.onclick = (e) => clicked(e, i);
    titlebar.appendChild(elm);
  });
  document.body.appendChild(titlebar);
};
document.body.onload = loadTitleBar;

const experience = new Experience(canvas);
