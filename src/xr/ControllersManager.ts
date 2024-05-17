import * as THREE from "three";
import { XRController, XRControllerEvents } from "./XRController";
import type { XRControllerEvent } from "./types";

export enum ControllersManagerEvents {
  onConnected = "onConnected",
}

export class ControllersManager extends THREE.EventDispatcher<XRControllerEvent> {
  protected static _instance: ControllersManager;
  protected static xr: THREE.WebXRManager;

  protected controllers: XRController[] = [];

  static setup(xrManager: THREE.WebXRManager) {
    if (this._instance) return;

    ControllersManager.xr = xrManager;
    this._instance = new ControllersManager();
  }

  private constructor() {
    super();
  }

  static get instance() {
    return this._instance;
  }

  get left(): XRController {
    return this.controllers.find((ctrl) => ctrl.handedness == "left");
  }

  get right(): XRController {
    return this.controllers.find((ctrl) => ctrl.handedness == "right");
  }

  static update() {
    this.instance?.update();
  }

  // get ray() {}

  connect() {
    this.controllers = [new XRController(ControllersManager.xr, 0), new XRController(ControllersManager.xr, 1)];
    this.controllers.forEach((ctrl) => ctrl.on(XRControllerEvents.connected, this.checkConnected.bind(this)));
  }

  onConnected(listener: () => void) {
    this.addEventListener(ControllersManagerEvents.onConnected, listener);
  }

  private checkConnected() {
    // Check that all controllers are connected
    for (const controller of this.controllers) if (!controller.connected) return;

    this.dispatchEvent({ type: ControllersManagerEvents.onConnected });
  }

  private update() {
    this.controllers.forEach((c) => c.update());
  }
}
