import { Titlebar } from "./Components/Titlebar/Titlebar";
import { World } from "./Components/World/World";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Titlebar />
      <title></title>
      <canvas class="webgl"></canvas>

      <section class="section">
        <h1>My Portfolio</h1>
      </section>
      <section class="section">
        <h2>My projects</h2>
      </section>
      <section class="section">
        <h2>Contact me</h2>
      </section>
      <World />
    </div>
  );
}

export default App;
