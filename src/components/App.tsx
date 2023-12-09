import './App.css'
import { DatGUI } from './DatGUI';
import { DomeCanvas } from "./DomeCanvas";
import { ThreeCanvas } from "./ThreeCanvas";

const App = () => {
  return (
    <>
    <div id="page">
      <ThreeCanvas>
        <DomeCanvas/>
      </ThreeCanvas>

      <DatGUI />

      <div className="text-overlay">
        <span id="weight-force">|| P || = </span>
        <span id="contact-force">|| N || = </span>
        <span id="friction-force">|| Froz || = </span>
        <span id="theta-value"></span>
      </div>

      <div className="slider-container">
        <input id="time-slider" type="range" min="0" max="1" step="0.005" />
      </div>
    </div>
    </>
  );
};

export default App;
