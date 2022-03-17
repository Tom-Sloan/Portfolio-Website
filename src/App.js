import { Titlebar } from "./Components/Titlebar/Titlebar";
import { World } from "./Components/World/World";
import "./App.css";
import { useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
  const opacity = isLoading ? { opacity: 1 } : { transform: "scale(0)" };

  return (
    <div className="App">
      <div className="loadingPlane" style={opacity}></div>
      <Titlebar destinations={destinations} />
      <World
        destinations={destinations}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default App;
