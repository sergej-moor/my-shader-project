// components/AudioAnalyser.js
import { useState } from "react";

const AudioAnalyser = ({ onChange }) => {
  const [low, setLow] = useState(50); // Initial value for low
  const [mid, setMid] = useState(50); // Initial value for mid
  const [high, setHigh] = useState(50); // Initial value for high

  const handleLowChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setLow(value);
    onChange({ low: value, mid, high }); // Update parent component
  };

  const handleMidChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setMid(value);
    onChange({ low, mid: value, high }); // Update parent component
  };

  const handleHighChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setHigh(value);
    onChange({ low, mid, high: value }); // Update parent component
  };

  return (
    <div>
      <h2>Audio Analyser</h2>
      <div>
        <label>
          Low: {low}
          <input
            type="range"
            min="1"
            max="100"
            value={low}
            onChange={handleLowChange}
          />
        </label>
      </div>
      <div>
        <label>
          Mid: {mid}
          <input
            type="range"
            min="1"
            max="100"
            value={mid}
            onChange={handleMidChange}
          />
        </label>
      </div>
      <div>
        <label>
          High: {high}
          <input
            type="range"
            min="1"
            max="100"
            value={high}
            onChange={handleHighChange}
          />
        </label>
      </div>
    </div>
  );
};

export default AudioAnalyser;
