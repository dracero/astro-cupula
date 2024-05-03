import * as THREE from "three";
import { SphereDomeModel } from "../models/SphereDomeModel";
import { addDatListener, guiOptions } from "../components/DatGUI";
import { Clock } from "../utils/Clock";

export class SphereAnimation {
  static readonly name = "sphere-animation";

  readonly duration; // Seconds
  speed: number = guiOptions.speed;
  mixer: THREE.AnimationMixer;
  action: THREE.AnimationAction;

  private slider: HTMLInputElement;

  constructor(obj: THREE.Object3D, model: SphereDomeModel) {
    const positions: number[] = [];
    const rotations: number[] = [];
    const times: number[] = [];

    model.discretizedValues.forEach((instant) => {
      const { position, rotation, time } = instant;
      times.push(time);
      positions.push(position.x, position.y, 0);
      rotations.push(rotation);
    });

    this.duration = times[times.length - 1];

    const positionTrack = new THREE.VectorKeyframeTrack(".position", times, positions);
    const rotationTrack = new THREE.VectorKeyframeTrack(".rotation[z]", times, rotations);
    const clip = new THREE.AnimationClip(SphereAnimation.name, -1, [positionTrack, rotationTrack]);
    this.mixer = new THREE.AnimationMixer(obj);
    this.action = this.mixer.clipAction(clip);

    addDatListener("datgui-speed", (e) => (this.speed = e.value));
    addDatListener("datgui-togglePlay", () => this.togglePlay());

    addEventListener("togglePlay", () => this.togglePlay());

    this.slider = document.getElementById("time-slider") as HTMLInputElement;
    this.slider.addEventListener("input", this.onSliderUpdate.bind(this));

    addEventListener("keypress", (ev) => {
      if (ev.key == " ") this.togglePlay();
    });
  }

  get time(): number {
    return this.action.time;
  }

  get isPlaying(): boolean {
    return this.action.isRunning();
  }

  update() {
    this.mixer.update(Clock.delta * this.speed);
    this.slider.value = `${this.time / this.duration}`;
  }

  togglePlay(value = this.action.paused) {
    this.action.paused = !value;
  }

  private onSliderUpdate(ev: Event) {
    const time = parseFloat(this.slider.value) * this.duration;
    this.action.time = time;
    this.togglePlay(false);
  }
}
