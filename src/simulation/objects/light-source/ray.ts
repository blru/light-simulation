import { Vector2 } from "src/simulation/math/vector-2";
import { Renderable } from "src/simulation/renderer/renderable";
import { LightSource } from "../light-source";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { OpticalMedium } from "../optical-medium";
import { Simulation } from "src/simulation";
import { EPSILON } from "src/simulation/math/constants";
import { approximatelyEquals } from "src/simulation/math/utils";

export type PartialMedium = { refractiveIndex: number };
export type Movement = {
    vector: Vector2;
    medium: PartialMedium;
};

export type InitialRay = {
    origin: Vector2;
    direction: Vector2;
};

export class Ray implements Renderable {
    public readonly origin: Vector2;
    public end: Vector2;
    public direction!: Vector2; /** Normalized direction vector for the current direction */
    public length: number = 0;
    public movements: Movement[] = [];

    constructor(
        public readonly source: LightSource,
        { origin, direction }: InitialRay,
    ) {
        this.origin = origin.clone();
        this.end = origin.clone();

        const { into } = this.findTouchingMedia();
        this.changeDirection(direction.clone().normalize(), into);
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

    computePath(): void {
        // TODO: Make angles near the critical angle work

        // Advance until the maximum length has been reached
        while (!this.hasReachedMaximumLength()) {
            const { distance: advanceableDistance, medium: closestMedium } =
                this.computeAdvanceableDistance();

            const hasCollided = advanceableDistance <= EPSILON;
            if (hasCollided && closestMedium != null) {
                const { from, into } = this.findTouchingMedia();
                console.log({
                    n1: from.refractiveIndex,
                    n2: into.refractiveIndex,
                });

                // if (this.lastMovement.medium === into) {
                //     const farPoint = this.direction
                //         .clone()
                //         .multiplyScalar(this.source.maxRayLength)
                //         .add(this.end);
                //
                //     // Find the distance after the advancement
                //     const distance = closestMedium.distanceFrom(farPoint);
                //
                //     this.advance(this.source.maxRayLength - distance);
                //
                //     continue;
                // }

                const normal = closestMedium
                    .normalAt(this.end)
                    .alignOppositeWith(this.direction); // Faces away from plane

                switch (closestMedium.behavior) {
                    case "reflective": {
                        this.reflect(normal, from);
                        break;
                    }
                    case "refractive": {
                        this.refract(normal, from, into);
                        break;
                    }
                }
            } else {
                this.advance(advanceableDistance);
            }
        }
    }

    /** Utility methods for computing path */

    private refract(normal: Vector2, from: PartialMedium, into: PartialMedium) {
        // Source: https://en.wikipedia.org/wiki/Snell%27s_law
        const n1 = from.refractiveIndex;
        const n2 = into.refractiveIndex;

        const r = n1 / n2;
        const l = this.direction.clone();
        const c = normal.clone().multiplyScalar(-1).dot(l);
        const n = normal;

        const radical = 1 - r * r * (1 - c * c);

        const isTotalInternalRefraction = radical <= 1e-6;
        if (isTotalInternalRefraction) {
            this.reflect(normal, from);
        } else {
            // No need to clone l, it will change anyways
            this.changeDirection(
                l
                    .multiplyScalar(r)
                    .add(n.clone().multiplyScalar(r * c - Math.sqrt(radical))),
                into,
            );
        }
    }

    private reflect(normal: Vector2, from: PartialMedium) {
        // No need to clone since direction will be updated anyways
        this.changeDirection(this.direction.reflect(normal), from);
    }

    /**
     * @param direction - Normalized direction vector
     */
    private changeDirection(direction: Vector2, into: PartialMedium) {
        this.direction = direction;

        this.movements.push({
            medium: into,
            vector: new Vector2(),
        });

        // Prevent same medium from being touched twice
        this.advance(EPSILON * 2);
    }

    private advance(distance: number) {
        const translation = this.direction.clone().multiplyScalar(distance);

        this.end.add(translation);
        this.lastMovement.vector.add(translation);
        this.length += distance;
    }

    private computeAdvanceableDistance(): {
        distance: number;
        medium?: OpticalMedium;
    } {
        const closest = Simulation.closestObjectTo<OpticalMedium>(
            this.end,
            (object) => object instanceof OpticalMedium,
        );

        // NOTE: Maybe this should be an explicit if statement
        const distance = Math.min(
            closest?.distance ?? this.remainingDistance,
            this.remainingDistance,
        );

        return { distance, medium: closest?.object };
    }

    private findTouchingMedia(): Record<"from" | "into", PartialMedium> {
        const from = this.lastMovement?.medium ?? { refractiveIndex: 1 };
        let into = { refractiveIndex: 1 };

        for (const object of Simulation.objects) {
            if (
                object instanceof OpticalMedium &&
                object.behavior === "refractive" &&
                object.distanceFrom(this.end) <= EPSILON &&
                object !== from
            ) {
                into = object;
                break;
            }
        }

        return { from, into };
    }

    private hasReachedMaximumLength(): boolean {
        return this.length >= this.source.maxRayLength - EPSILON;
    }

    private get lastMovement(): Movement {
        return this.movements[this.movements.length - 1];
    }

    private get remainingDistance(): number {
        return this.source.maxRayLength - this.length;
    }
}
