// pages/index.js
"use client";
import { useState } from "react";
import Shaderpark from "./components/Shaderpark";
import AudioAnalyser from "./components/AudioAnalyser";
import Editor from "./components/Editor";
import AudioPlayer from "./components/AudioPlayer";
export default function Home() {
  const [audioSettings, setAudioSettings] = useState({
    low: 50,
    mid: 50,
    high: 50,
  });

  // Create a string representation of the audio settings
  const audioSettingsStringified = `
let low = ${audioSettings.low.toFixed(2)};
let mid = ${audioSettings.mid.toFixed(2)};
let high = ${audioSettings.high.toFixed(2)};

  `;
  const handleAudioChange = (settings) => {
    setAudioSettings(settings);

    //console.log("Updated audio settings:", settings);
  };

  let code = `setMaxReflections(2)

setMaxIterations(1)
rotateX(PI/4)
let speedScale = input(16,1,100)
function gyroid(scale) {
  let s = getSpace();
  s = floor(s*3+time*(speedScale/100))* scale;
  return dot(sin(s), cos(vec3(s.z, s.x, s.y) +PI))/ scale ;
}
//setMaxIterations(100)
setStepSize(.1);
let noiseScale = input(20, 0, 200);
//let n = noise(getSpace()*3);
//backgroundColor(n, n, n);

shine(.4)
metal(.6);



let gyScale = input(16, 0, 200);
let gy = gyroid(gyScale);
let n = vectorContourNoise(getSpace()*5 + vec3(0, 0, time*.1), gy, 1.2);
n = pow(sin(n*2)*.5 +.5, vec3(4))
color(n)
reflectiveColor(n*4)
sphere(.6+n.x*.00);
difference();
setSDF(gy);


`;

  /*  let code = `const radialRepeat = (repeats) => {
  const s = getSpace()
  const p = vec3(s.x, 0, s.z)
  const angle = 2 * PI / repeats
  const a = atan(p.z, p.x) + angle / 2
  const r = length(p)
  let c = floor(a / angle)
  const ma = mod(a, angle) - angle / 2
  const px = cos(ma) * r
  const pz = sin(ma) * r
  setSpace(vec3(px, s.y, pz))
  const absC = abs(c)
  const diff = step(absC, (repeats/2))
  c = diff*absC + (1-diff)*c;
  return c;
}

const sz = 0.1

const s = getSpace()
const r = length(vec3(s.x, 0, s.z))
const rtp = getSpherical()
const rots = 80*nsin(time)+20
const i = radialRepeat(rots)
displace(3*sz, 0, 0)
rotateZ(rtp.z+time)
backgroundColor(vec3(100/1, 100/255, 100/255));
occlusion(-10);
let colorNoise = noise(getRayDirection()*500)*.5+.5;
let col1 = vec3((100/255), (100/255), (100/255));
color(col1 * colorNoise)
box(sz, sz, sz*0.2)`; */

  const handleFrequencyUpdate = (frequencies) => {
    setAudioSettings({
      low: frequencies.low * 100, // Scale to 0-100 if needed
      mid: frequencies.mid * 100,
      high: frequencies.high * 100,
    });
    console.log(frequencies);
  };
  const [startCode, setStartCode] = useState(code);

  const handleCodeChange = (newCode) => {
    console.log("Code changed:", newCode);
    setStartCode(newCode);
  };
  return (
    <div>
      <div>
        {/*        <CodeMirrorEditor
          startCode="// Start coding here..."
          onCodeChange={handleCodeChange}
        /> */}

        <Editor startCode={startCode} onCodeChange={handleCodeChange}></Editor>
      </div>

      <AudioPlayer onFrequencyUpdate={handleFrequencyUpdate} />
      <h1>Shader Park with Next.js</h1>
      <h1>Shader Audio Visualizer</h1>
      <AudioAnalyser onChange={handleAudioChange} />
      <div>
        <h2>Frequency Values</h2>
        <p>Low: {audioSettings.low.toFixed(2)}</p>
        <p>Mid: {audioSettings.mid.toFixed(2)}</p>
        <p>High: {audioSettings.high.toFixed(2)}</p>
      </div>
      {/* <Shader /> */}
      <Shaderpark startCode={audioSettingsStringified + startCode} />
    </div>
  );
}
