import { EPSILON, TAU } from "./constants";

export const wrapAngle = (angle: number) => ((angle % TAU) + TAU) % TAU;

export function approximatelyEquals(
    a: number,
    b: number,
    epsilon: number = EPSILON,
) {
    return Math.abs(a - b) <= epsilon;
}

export const MathUtils = { wrapAngle, approximatelyEquals } as const;
