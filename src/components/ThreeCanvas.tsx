import * as THREE from 'three'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Clock } from "../utils/Clock";
import { XRManager } from '../utils/XRManager';

export const ThreeCanvas = (props) => {
  Clock.start()

  function FrameLoop() {
    useFrame(() => {
      Clock.update();
    })
    return null
  }

  function ThreeHook() {
    const w = window as any;
    const { scene, gl: renderer } = useThree();
    XRManager.init(renderer)

    w.scene = scene;
    w.THREE = THREE;
    w.renderer = renderer;
    return null
  }

  return (
    <div className="boardCanvas" style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ThreeHook />
        <FrameLoop />

        {props.children}
      </Canvas>
    </div>
  )
}