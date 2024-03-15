import * as THREE from "three";
import type { InstantValues, SphereDomeModel } from "../models/SphereDomeModel";

const ARROWS_SCALE = 0.4;

export class DomeModelDiagrams extends THREE.Group {
  private sphereLine: THREE.Line<THREE.BufferGeometry, THREE.Material>;
  private contactArrow: THREE.ArrowHelper;
  private frictionArrow: THREE.ArrowHelper;
  private angleArc: THREE.Line<THREE.BufferGeometry, THREE.Material>;

  private model: SphereDomeModel;

  private weightSpan: HTMLSpanElement;
  private contactSpan: HTMLSpanElement;
  private frictionSpan: HTMLSpanElement;
  private thetaSpan: HTMLSpanElement;

  constructor(model: SphereDomeModel) {
    super();

    this.name = "diagrams";
    this.model = model;

    // Axes helper
    const axes = new THREE.AxesHelper(20);
    (axes.material as THREE.Material).depthTest = false;
    axes.renderOrder = 1;
    this.add(axes);

    // Line to sphere
    const sphereLineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.sphereLine = new THREE.Line(sphereLineGeom);
    this.sphereLine.material.depthTest = false;
    this.sphereLine.renderOrder = 1;
    this.add(this.sphereLine);

    // Contact (normal) force
    this.contactArrow = new THREE.ArrowHelper();
    this.contactArrow.name = "contact";
    this.contactArrow.setColor(0xff00ff);
    (this.contactArrow.line.material as THREE.Material).depthTest = false;
    (this.contactArrow.cone.material as THREE.Material).depthTest = false;
    this.add(this.contactArrow);

    // Friction force
    this.frictionArrow = new THREE.ArrowHelper();
    this.frictionArrow.name = "friction";
    this.frictionArrow.setColor(0x0000ff);
    (this.frictionArrow.line.material as THREE.Material).depthTest = false;
    (this.frictionArrow.cone.material as THREE.Material).depthTest = false;
    this.add(this.frictionArrow);

    // Angle arc
    this.angleArc = new THREE.Line();
    this.angleArc.material.depthTest = false;
    this.angleArc.renderOrder = 1;
    this.add(this.angleArc);

    // HTML text boxes
    this.weightSpan = document.getElementById("weight-force");
    this.contactSpan = document.getElementById("contact-force");
    this.frictionSpan = document.getElementById("friction-force");
    this.thetaSpan = document.getElementById("theta-value");

    // Weight span
    const g = 9.806;
    const weight = this.model.conditions.mass * g;
    this.weightSpan.innerText = `|| P || = ${weight.toFixed(2)}`;
  }

  update(values: InstantValues) {
    const { PI, atan } = Math;
    const { position, contactForce, frictionForce } = values;
    const { sphereRadius: r } = this.model.conditions;

    // Line to sphere
    const lineAttr = this.sphereLine.geometry.getAttribute("position");
    lineAttr.setXYZ(1, position.x, position.y, 0);
    lineAttr.needsUpdate = true;

    // Angle arc
    let theta = atan(position.x / position.y);
    if (theta < 0) theta = PI + theta;
    const arc = new THREE.ArcCurve(0, 0, 3, PI / 2, PI / 2 - theta, true);
    this.angleArc.geometry.setFromPoints(arc.getPoints(16));

    this.thetaSpan.innerText = `θ = ${theta.toFixed(4)}`;

    // Contact arrow
    if (contactForce.lengthSq() == 0) {
      this.contactArrow.visible = false;
      this.contactSpan.innerText = "|| N || = 0";
    } else {
      const contactDir = new THREE.Vector3(contactForce.x, contactForce.y, 0).normalize();
      this.contactArrow.visible = true;
      this.contactArrow.setDirection(contactDir);
      this.contactArrow.position.set(position.x, position.y, 0);
      this.contactArrow.scale.setScalar(contactForce.length() * ARROWS_SCALE);
      this.contactSpan.innerText = `|| N || = ${contactForce.length().toFixed(2)}`;
    }

    // Friction arrow
    if (frictionForce.lengthSq() == 0) {
      this.frictionArrow.visible = false;
      this.frictionSpan.innerText = "|| Froz || = 0";
    } else {
      const frictionDir = new THREE.Vector3(frictionForce.x, frictionForce.y, 0).normalize();
      this.frictionArrow.visible = true;
      this.frictionArrow.setDirection(frictionDir);

      this.frictionArrow.position.set(position.x, position.y, 0);
      const offset = this.frictionArrow.position.clone().negate().setLength(r);
      this.frictionArrow.position.add(offset);
      this.frictionArrow.scale.setScalar(frictionForce.length() * ARROWS_SCALE);

      this.frictionSpan.innerText = `|| Froz || = ${frictionForce.length().toFixed(2)}`;
    }
  }
}
