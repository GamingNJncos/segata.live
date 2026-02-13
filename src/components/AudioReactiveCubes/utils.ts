/* eslint-disable no-param-reassign */
import { Color, Mesh, Vector3 } from "three";
import { logarithmic } from "../../utilities/helpers";

const COLOR_TWEENING_SCALE = 0.75;
const MAX_ACTIVE_ROTATION = 0.03;
const MIN_ACTIVE_ROTATION = 0.01;
const IDLE_ROTATION = 0.0025;

const randomRange = (max: number, min: number) =>
  Math.random() * (max - min) + min;

// Pre-allocated objects to avoid per-frame allocations
const _targetColor = new Color();
const _targetScale = new Vector3();
const COLOR_LERP_FACTOR = 0.15;
const SCALE_LERP_FACTOR = 0.2;

const updateColor = (target: Mesh, channelFFT: number) => {
  const logVal = logarithmic(channelFFT * COLOR_TWEENING_SCALE);
  const hue = 142.5 - logVal;
  // setHSL expects hue in 0..1 range
  _targetColor.setHSL(Math.max(hue, 0) / 360, 1.0, 0.48);
  (target.material as any).color.lerp(_targetColor, COLOR_LERP_FACTOR);
};

export const updateScaleAndColor = (cube: Mesh, averageFFT: number) => {
  updateColor(cube, averageFFT);

  const derivedInfluence = averageFFT * 0.007 > 1 ? 1 : averageFFT * 0.007;
  cube.morphTargetInfluences[0] = derivedInfluence;

  const derivedSize = averageFFT * 0.008 + 0.5;
  const m = derivedSize < 1.65 ? derivedSize : 1.65;

  _targetScale.set(m, m, m);
  cube.scale.lerp(_targetScale, SCALE_LERP_FACTOR);
};

export const activeRotation = (cube: Mesh, modifier?: number) => {
  // TODO: At random interval, flip directions
  const derivedMax = modifier
    ? -Math.abs(MAX_ACTIVE_ROTATION)
    : MAX_ACTIVE_ROTATION;
  const derivedMin = modifier
    ? -Math.abs(MIN_ACTIVE_ROTATION)
    : MIN_ACTIVE_ROTATION;

  cube.rotateX(randomRange(derivedMax, derivedMin));
  cube.rotateY(randomRange(derivedMax, derivedMin));
};

export const idleRotation = (
  cube: Mesh,
  modifier = 1,
  down: boolean,
  up: boolean
) => {
  if (up) {
    cube.position.y += 0.0075;
  } else if (down) {
    cube.position.y -= 0.0075;
  }
  // cube.rotateX(IDLE_ROTATION * modifier);
  cube.rotateY(IDLE_ROTATION * modifier);
};
