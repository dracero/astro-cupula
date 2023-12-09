import * as THREE from "three";
import { SphereAnimation } from "../animations/SphereAnimation";
import { DomeModelDiagrams } from "./DomeModelDiagrams";
import { SphereDomeModel } from "../models/SphereDomeModel";

const ObjectsIndex = {
  directionArrow: "tobedefined",
  sphereMesh: "Sphere",
  normalArrow: "tobedefined",
  domeMesh: "Dome",
};

export class DomeObject extends THREE.Object3D {
  directionArrow: THREE.Object3D;
  normalArrow: THREE.Object3D;
  sphereMesh: THREE.Mesh;
  domeMesh: THREE.Mesh;

  private animation: SphereAnimation;
  private diagrams: DomeModelDiagrams;
  private model: SphereDomeModel;

  constructor(scene: THREE.Object3D) {
    super();

    this.add(scene);
    this.traverse((child: THREE.Mesh) => {
      switch (child.name) {
        case ObjectsIndex.directionArrow:
          this.directionArrow = child;
          this.initArrow(child);
          return;
        case ObjectsIndex.normalArrow:
          this.normalArrow = child;
          this.initArrow(child);
          return;
        case ObjectsIndex.sphereMesh:
          this.initSphere(child);
          return;
        case ObjectsIndex.domeMesh:
          this.initDome(child);
          return;
      }
    });

    this.diagrams = new DomeModelDiagrams(this.model);
    this.add(this.diagrams);
  }

  update() {
    this.animation.update();

    const instant = this.model.getValuesAt(this.animation.time);
    this.diagrams.update(instant);
  }

  private initSphere(mesh: THREE.Mesh) {
    this.sphereMesh = mesh;

    this.model = new SphereDomeModel({
      mass: 1.2,
      domeRadius: 10,
      sphereRadius: 1,
      friction: 0.1,
      thetaStart: 0.01,
    });

    this.animation = new SphereAnimation(mesh, this.model);
    this.animation.action.play();
  }

  private initArrow(mesh: THREE.Mesh) {
    (mesh.material as THREE.Material).depthTest = false;
    mesh.renderOrder = 1;
  }

  private initDome(mesh: THREE.Mesh) {
    this.domeMesh = mesh;
    const glbMaterial = mesh.material as THREE.MeshStandardMaterial;
    this.domeMesh.material = new THREE.MeshPhongMaterial({ color: glbMaterial.color, side: THREE.DoubleSide });
  }
}
