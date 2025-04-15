import { Vector2 } from "src/simulation/math/vector-2";
import { Renderable } from "src/simulation/renderer/renderable";
import { LightSource } from "../light-source";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { OpticalMedium } from "../optical-medium";
import { Simulation } from "src/simulation";
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
    public direction!: Vector2; /** Normalized direction vector for the current direction */
    public length: number = 0;
    public movements: Movement[] = [];

    constructor(
        public readonly source: LightSource,
        { origin, direction }: InitialRay,
    ) {
        this.origin = origin.clone();
        this.end = origin.clone();
        this.changeDirection(direction.clone().normalize());
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
        // Advance until the maximum length has been reached
        while (!this.hasReachedMaximumLength()) {
            const { distance: advanceableDistance, medium: closestMedium } =
                this.computeAdvanceableDistance();

            const hasCollided = advanceableDistance <= EPSILON;
            if (hasCollided && closestMedium != null) {
                const normal = closestMedium
                    .normalAt(this.end)
                    .alignOppositeWith(this.direction); // Faces away from plane

                switch (closestMedium.behavior) {
                    case "reflective": {
                        this.reflect(normal);
                        break;
                    }
                    case "refractive": {
                        throw new Error("Unimplemented");
                        break;
                    }
                }
            } else {
                this.advance(advanceableDistance);
            }
        }
    }

    /** Utility methods for computing path */

    private reflect(normal: Vector2) {
        // No need to clone since direction will be updated anyways
        this.changeDirection(this.direction.reflect(normal));
    }

    /**
     * @param direction - Normalized direction vector
     */
    private changeDirection(direction: Vector2) {
        this.direction = direction;

        // Determine the refractive index
        const refractiveIndex1 = this.lastMovement?.refractiveIndex ?? 1;
        const refractiveIndex2 =
            this.findTouchingMedia()
                .map((medium) => medium.refractiveIndex)
                .filter(
                    (mediumIndex) =>
                        !approximatelyEquals(mediumIndex, refractiveIndex1),
                )[0] ?? refractiveIndex1;

        this.movements.push({
            refractiveIndex: refractiveIndex2,
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

    private findTouchingMedia(): OpticalMedium[] {
        const touchingMedia: OpticalMedium[] = [];

        for (const object of Simulation.objects) {
            if (
                object instanceof OpticalMedium &&
                object.distanceFrom(this.end) <= EPSILON
            ) {
                touchingMedia.push(object);
            }
        }

        return touchingMedia;
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
