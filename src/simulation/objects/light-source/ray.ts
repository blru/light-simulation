import { Vector2 } from "src/simulation/math/vector-2";
import { Renderable } from "src/simulation/renderer/renderable";
import { LightSource } from "../light-source";
import { Steppable } from "src/simulation/steppable";
import { Simulation } from "src/simulation";
import { OpticalMedium } from "../optical-medium";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { EPSILON } from "src/simulation/math/constants";
import { approximatelyEquals } from "src/simulation/math/utils";

export type Movement = {
    vector: Vector2;
    refractiveIndex: number;
};

export type InitialRay = {
    origin: Vector2;
    direction: Vector2;
};

export class Ray implements Renderable {
    public readonly origin: Vector2;
    public end: Vector2;
    public endDirection: Vector2; /** Normalized direction vector */
    public length: number = 0;
    public movements: Movement[] = [];

    constructor(
        public readonly source: LightSource,
        { origin, direction }: InitialRay,
    ) {
        this.origin = origin.clone();
        this.end = origin.clone();
        this.endDirection = direction.clone().normalize();
        this.movements.push({ refractiveIndex: 1, vector: new Vector2() });
    }

    // TODO: Make this code nicer
    computePath(): void {
        while (this.length < this.source.maxRayLength) {
            const lastMovement = this.movements[this.movements.length - 1];
            const remainingDistance = this.source.maxRayLength - this.length;
            const closest = Simulation.closestObjectTo<OpticalMedium>(
                this.end,
                (object) => object instanceof OpticalMedium,
            );

            // Utility function to advance the lastMovement forward
            const advance = (distance: number) => {
                const advancement = this.endDirection
                    .clone()
                    .multiplyScalar(distance);

                lastMovement.vector.add(advancement);

                this.end.add(advancement);
                this.length += advancement.magnitude;
            };

            if (closest == null) {
                //  There are no objects can impede the path, travel the maximum distance
                advance(remainingDistance);
            } else if (
                closest.distance > EPSILON // If there isn't a collision
            ) {
                // There are objects, but there is no collision or the collision is within the current medium
                const travelableDistance = Math.min(
                    remainingDistance,
                    closest.distance,
                );

                advance(travelableDistance);
            } else {
                // There has been a collision, handle it
                const medium = closest.object;
                const normal = medium
                    .normalAt(this.end)
                    .alignWith(lastMovement.vector);

                const reflect = () => {
                    // Source: https://en.wikipedia.org/wiki/Specular_reflection
                    this.endDirection = lastMovement.vector
                        .clone()
                        .normalize()
                        .reflect(normal);

                    this.movements.push({
                        vector: new Vector2(),
                        refractiveIndex: lastMovement.refractiveIndex,
                    });
                };

                switch (medium.behavior) {
                    case "reflective": {
                        reflect();
                        break;
                    }
                    case "refractive": {
                        // BUG: Critical angle does not work because the refracted light ray coincides with the edges of media meaning a constant distance of 0

                        // Source: https://en.wikipedia.org/wiki/Snell%27s_law
                        const l = lastMovement.vector.clone().normalize();
                        const n = normal.clone().multiplyScalar(-1);

                        // Find the next closest medium
                        const nextClosest =
                            Simulation.closestObjectTo<OpticalMedium>(
                                this.end,
                                (object) =>
                                    object instanceof OpticalMedium &&
                                    object !== closest.object,
                            );

                        const incidentIndex = lastMovement.refractiveIndex;
                        const refractedIndex =
                            nextClosest != null && closest.distance < EPSILON
                                ? nextClosest.object.refractiveIndex
                                : 1;
                        const r = incidentIndex / refractedIndex;

                        const c = n.clone().multiplyScalar(-1).dot(l);
                        const radicand = 1 - r * r * (1 - c * c);

                        if (radicand < 0) {
                            // Total internal refraction
                            reflect();
                            break;
                        }

                        this.endDirection = l
                            .clone()
                            .multiplyScalar(r)
                            .add(
                                n
                                    .clone()
                                    .multiplyScalar(
                                        r * c - Math.sqrt(radicand),
                                    ),
                            );

                        this.movements.push({
                            vector: new Vector2(),
                            refractiveIndex: medium.refractiveIndex,
                        });

                        break;
                    }
                }

                advance(EPSILON * 2);
            }
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        const currentPosition = fromWorld(this.origin);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = Preferences.colors.ray ?? "";

        ctx.beginPath();
        ctx.moveTo(currentPosition.x, currentPosition.y);

        for (const movement of this.movements) {
            // TODO: Draw an arrow to show ray direction
            // const midpoint = currentPosition
            //     .clone()
            //     .add(movement.vector.clone().multiplyScalar(0.5));

            currentPosition.add(movement.vector);
            ctx.lineTo(currentPosition.x, currentPosition.y);
        }

        ctx.stroke();
    }

    shouldRender(): boolean {
        return true;
    }
}
