import * as THREE from 'three'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Clock } from "../utils/Clock";
import { AnimationsManager } from "../animations/AnimationsManager";

export const ThreeCanvas = (props) => {
  Clock.start()

  function FrameLoop() {
    useFrame(() => {
      Clock.update();
      AnimationsManager.update()
    })
    return null
  }

  function ThreeHook() {
    const w = window as any;
    const { scene } = useThree();
    w.scene = scene;
    w.THREE = THREE;
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