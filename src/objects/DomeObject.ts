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

  static readonly DOME_RADIUS = 1.5;
  static readonly SPHERE_RADIUS = 0.15;

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
    // Rescale ball
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    const glbRadius = (box.max.x - box.min.x) / 2;
    const ballScale = DomeObject.SPHERE_RADIUS / glbRadius;
    this.sphereMesh = mesh;
    this.sphereMesh.scale.setScalar(ballScale);

    // And setup model & animation
    this.model = new SphereDomeModel({
      mass: 1,
      domeRadius: DomeObject.DOME_RADIUS,
      sphereRadius: DomeObject.SPHERE_RADIUS,
      friction: 0.1,
      thetaStart: 1e-2,
    });

    this.animation = new SphereAnimation(this.sphereMesh, this.model);
    this.animation.action.play();
  }

  private initArrow(mesh: THREE.Mesh) {
    (mesh.material as THREE.Material).depthTest = false;
    mesh.renderOrder = 1;
  }

  private initDome(mesh: THREE.Mesh) {
    // Rescale dome
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    const glbRadius = (box.max.x - box.min.x) / 2;
    const domeScale = DomeObject.DOME_RADIUS / glbRadius;
    this.domeMesh = mesh;
    this.domeMesh.scale.setScalar(domeScale);

    // Also add wireframe dome
    const wireframeMat = new THREE.MeshPhongMaterial({ color: 0x0, wireframe: true });
    const wireframeMesh = new THREE.Mesh(this.domeMesh.geometry, wireframeMat);
    wireframeMesh.scale.setScalar(domeScale);
    this.add(wireframeMesh);
  }
}
