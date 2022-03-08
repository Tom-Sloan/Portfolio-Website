import { Titlebar } from "./Components/Titlebar/Titlebar";
import { World } from "./Components/World/World";
import "./App.css";

function App() {
  const destinations = [
    {
      path: "",
      name: "Projects",
      emoji: "⚒️",
      description: "asdasdasd",
      angle: 0,
      index: 0,
    },
    {
      path: "",
      name: "Resume",
      emoji: "📜",
      description: "asdasdasd",
      angle: -Math.PI / 3,
      index: 1,
    },
    {
      path: "",
      name: "Contact",
      emoji: "👨‍🔬",
      description: "asdasdasd",
      angle: Math.PI / 6,
      index: 2,
    },
  ];
  return (
    <div className="App">
      <Titlebar destinations={destinations} />
      <World destinations={destinations} />
    </div>
  );
}

export default App;
