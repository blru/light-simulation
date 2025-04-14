import {
    computationIndicator,
    ComputationIndicator,
} from "./elements/computation-indicator";
import { Vector2 } from "./simulation/math/vector-2";
import { LightSource } from "./simulation/objects/light-source";
import { Renderer } from "./simulation/renderer";
import { Renderable } from "./simulation/renderer/renderable";
import {
    DistanceMeasurable,
    isDistanceMeasurable,
    SimulationObject,
} from "./simulation/simulation-object";
import { isSteppable } from "./simulation/steppable";

export type ClosestResult<T extends SimulationObject> = {
    object: T;
    distance: number;
};

export const objects = new Set<SimulationObject>();
let isRunning = true;

// Start simulation loop
let lastTime: number | undefined;
function loop(currentTime: number) {
    const deltaTime = (currentTime - (lastTime ?? currentTime)) / 1000;
    lastTime = currentTime;

    if (isRunning) {
        step(deltaTime);
    }
    Renderer.render(objects);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/** Steps the simulation forward */
export function step(deltaTime: number = 5 / 60) {
    // Step all the objects that can be stepped
    for (const object of objects) {
        if (isSteppable(object)) {
            object.step(deltaTime);
        }
    }
}

// TODO: Refactor this ugly code
export function closestObjectTo<T extends SimulationObject = SimulationObject>(
    point: Vector2,
    filter?: (object: SimulationObject) => boolean,
): ClosestResult<T> | null {
    let shortestDistance: number | undefined;
    let closestObject: T | undefined;
    for (const object of objects) {
        if (
            !isDistanceMeasurable(object) ||
            (filter != null && !filter(object))
        )
            continue;

        const distance = object.distanceFrom(point);

        if (shortestDistance == null || distance < shortestDistance) {
            shortestDistance = distance;
            closestObject = <T>object;
        }
    }

    if (closestObject != null && shortestDistance != null) {
        return {
            object: <T>closestObject,
            distance: shortestDistance,
        };
    }

    return null;
}

export function recomputeLightRays() {
    for (const object of objects) {
        if (object instanceof LightSource) {
            object.recomputeRays();
        }
    }
}

export function setIsRunning(newIsRunning: boolean) {
    isRunning = newIsRunning;
}

export function getIsRunning() {
    return isRunning;
}

export const Simulation = {
    objects,
    step,
    closestObjectTo,
    setIsRunning,
    getIsRunning,
    recomputeLightRays,
} as const;
