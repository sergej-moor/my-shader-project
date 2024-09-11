// pages/index.js
"use client";
import { useState } from "react";
import Shaderpark from "./components/Shaderpark";
import AudioAnalyser from "./components/AudioAnalyser";
import Editor from "./components/Editor";
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

  let code = `rotateY(-0.1 * time);
let n = noise(getSpace() * 2 + time );
color(vec3(0, 0, .5) + normal * .5);
metal(n);
shine(n);
sphere(0.5 + n * sin(time/10));`;

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
      <h1>Shader Park with Next.js</h1>
      <h1>Shader Audio Visualizer</h1>
      <AudioAnalyser onChange={handleAudioChange} />
      {/* <Shader /> */}
      <Shaderpark startCode={audioSettingsStringified + startCode} />
    </div>
  );
}
