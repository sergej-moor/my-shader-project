"use client";
// pages/three-scene.js
import { useEffect, useRef } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  createSculptureWithGeometry,
  sculptToThreeJSMaterial,
} from "shader-park-core/dist/shader-park-core.esm.js";

const Shaderpark = ({ startCode }) => {
  const meshRef = useRef(null); // Use ref to store the mesh
  const rendererRef = useRef(null); // Use ref to store the renderer
  const timeRef = useRef(0); // Use ref to store the time variable
  const canvasRef = useRef(null);
  const initializeScene = () => {
    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new WebGLRenderer({ antialias: true, transparent: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new Color(1, 1, 1), 0);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer; // Store the renderer in the ref

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;

    // Create initial mesh
    meshRef.current = createMesh(startCode);
    scene.add(meshRef.current);

    window.addEventListener("resize", () => onResize(camera, renderer));
    render(scene, camera, renderer, controls);
  };

  const createMesh = (code) => {
    const geometry = new SphereGeometry(2, 45, 45);
    return createSculptureWithGeometry(geometry, code, () => ({
      time: timeRef.current, // Pass the time variable to the shader
    }));
  };

  const updateShader = (code) => {
    if (meshRef.current) {
      try {
        meshRef.current.material = sculptToThreeJSMaterial(code);
        //console.log("Updated shader with new code.");
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("Mesh is not initialized.");
    }
  };

  const onResize = (camera, renderer) => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
  };

  const render = (scene, camera, renderer, controls) => {
    requestAnimationFrame(() => render(scene, camera, renderer, controls));
    timeRef.current += 0.01; // Increment the time variable
    controls.update();
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = timeRef.current; // Update the time uniform in the shader
    }
    renderer.render(scene, camera);
  };

  useEffect(() => {
    initializeScene(); // Initialize the scene
    updateShader(startCode); // Set the initial shader code

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (
          canvasRef.current &&
          canvasRef.current.contains(rendererRef.current.domElement)
        ) {
          canvasRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      window.removeEventListener("resize", () => onResize(camera, renderer));
    };
  }, []); // Run once on mount

  useEffect(() => {
    updateShader(startCode); // Update shader whenever startCode changes
  }, [startCode]); // Re-run effect when startCode changes

  return (
    <div>
      <div ref={canvasRef} className="code-container"></div>
    </div>
  );
};

export default Shaderpark;
