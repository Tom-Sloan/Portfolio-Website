import { Titlebar } from "./Components/Titlebar/Titlebar";
import { World } from "./Components/World/World";
import "./App.css";

function App() {
  const destinations = [
    {
      path: "",
      name: "Projects",
      description: "asdasdasd",
      index: 0,
    },
    {
      path: "",
      name: "Resume",
      description: "asdasdasd",
      index: 1,
    },
    {
      path: "",
      name: "Contact",
      description: "asdasdasd",
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
