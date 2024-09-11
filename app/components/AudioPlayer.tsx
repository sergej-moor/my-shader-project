// components/AudioPlayer.js
import { useEffect, useRef, useState } from "react";

const AudioPlayer = ({ onFrequencyUpdate }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(new Uint8Array(512));
  const sourceRef = useRef(null);

  const startAudioContext = async () => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    console.log("Audio context and analyser initialized.");
  };

  const startAnalyzing = async () => {
    console.log("startAnalyzing called");
    if (audioRef.current) {
      if (!audioContextRef.current) {
        await startAudioContext(); // Initialize audio context on play
      }
      await audioContextRef.current.resume(); // Ensure the context is resumed

      // Create MediaElementSource only if not already created
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        console.log("Connected audio source to analyser.");
      }

      audioRef.current.play();
      setIsPlaying(true);
      setAudioInitialized(true); // Set audioInitialized to true
      analyzeAudio(); // Start analyzing immediately after play
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
      analyzeAudio(); // Resume analysis
    }
  };

  const togglePlayPause = () => {
    console.log("Toggle Play/Pause button clicked"); // Debug statement
    if (isPlaying) {
      pauseAudio();
    } else {
      if (audioInitialized) {
        resumeAudio();
      } else {
        startAnalyzing();
      }
    }
  };

  const analyzeAudio = () => {
    if (isPlaying) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const low =
        dataArrayRef.current.slice(0, 85).reduce((a, b) => a + b, 0) / 255 / 85; // Low frequencies
      const mid =
        dataArrayRef.current.slice(85, 170).reduce((a, b) => a + b, 0) /
        255 /
        85; // Mid frequencies
      const high =
        dataArrayRef.current.slice(170, 256).reduce((a, b) => a + b, 0) /
        255 /
        85; // High frequencies

      onFrequencyUpdate({ low, mid, high });

      requestAnimationFrame(analyzeAudio); // Repeat the analysis
    }
  };

  return (
    <div>
      <audio ref={audioRef} src="/song.wav" />
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};

export default AudioPlayer;
