import * as THREE from "three";
import { useRef, useState } from "react";
import { useGLTF, OrbitControls, PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import { DomeObject } from "../objects/DomeObject";
import { useFrame, useThree } from "@react-three/fiber";
import { addDatListener } from "./DatGUI";
import { ControllersManager } from "../xr/ControllersManager";

const DOME_GLB = 'cupula_jml-test.glb'

export const DomeCanvas = (props) => {
  const w = window as any // For debugging
  
  const perspectiveCamRef = useRef<THREE.PerspectiveCamera>();
  const orthoCamRef = useRef<THREE.OrthographicCamera>();
  const [show2d, setShow2d] = useState(false)
  const perspControlsRef = useRef<any>();
  const orthoControlsRef = useRef<any>();
  
  const { set: setThree, scene } = useThree()
  
  const gltf = useGLTF(DOME_GLB);
  const dome = w.dome = new DomeObject(gltf.scene);

  scene.background = new THREE.Color(0xffffff)

  addDatListener('datgui-2D', (e) => {
    setShow2d(e.value);
    setThree({ camera: (e.value ? orthoCamRef : perspectiveCamRef).current });
  })

  useFrame(() => {
    dome.update()
    ControllersManager.update()
  })

  return (
    <>
      {/* GLB content */}
      <primitive object={dome} />

      {/* Custom stuff we add to the scene */}
      <group>
        <primitive object={new THREE.GridHelper(50, 30)} position={[0, 0, 0]} />
      </group>

      {/* Mouse controls */}
      <OrbitControls ref={perspControlsRef} camera={perspectiveCamRef.current} enabled={!show2d} />
      <OrbitControls ref={orthoControlsRef} camera={orthoCamRef.current} enableRotate={false} enabled={show2d} />

      <PerspectiveCamera ref={perspectiveCamRef} makeDefault position={[15, 15, 30]} />
      <OrthographicCamera ref={orthoCamRef} position={[0, 0, 15]} zoom={40} />

      {/* Some custom lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={100} />
    </>
  );
};

useGLTF.preload(DOME_GLB);

export default DomeCanvas;
