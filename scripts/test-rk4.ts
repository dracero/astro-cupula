import { RK4, type RKResult } from "../src/math/runge-kutta";

const { log } = console;
const { cos, sin } = Math;

function maxDiff(results: RKResult, y: (t: number) => number): number {
  const { max, abs } = Math;
  let diff = 0;

  for (let result of results) {
    const [t, computed] = result;
    const real = y(t);
    diff = max(diff, abs(real - computed));
  }

  return diff;
}

log("Runge-Kutta implementation test");

const y1 = (t: number) => 3 * cos(t / 2 + 1) - t ** 2;
const f1 = (t: number, yt: number) => (-3 / 2) * sin(t / 2 + 1) - 2 * t;
log("Testing dy/dt = -3/2 sin(t/2 + 1) - 2t");
let results = RK4(f1, 0, y1(0), 1);
log("Max diff:", maxDiff(results, y1));
log();

const y2 = (t: number) => (5 * cos(t)) / t;
const f2 = (t: number, yt: number) => -(5 * (t * sin(t) + cos(t))) / t ** 2;
log("Testing dy/dt = -5 (t sin(t) + cos(t)) / t^2 ");
results = RK4(f2, 1, y2(1), 2);
log("Max diff:", maxDiff(results, y2));
log();
