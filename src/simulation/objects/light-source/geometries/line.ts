import { Vector2 } from "src/simulation/math/vector-2";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { Transform } from "src/simulation/transformable";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { SourceGeometry } from "../source-geometry";
import { InitialRay } from "../ray";
import { Property } from "src/elements/properties-pane/properties";
import { approximatelyEquals } from "src/simulation/math/utils";

export class LineSourceGeometry implements SourceGeometry {
    /** A number represting how much minimum distance between each ray. */
    public raySeparation: number = 50;

    distanceFrom(transform: Transform, point: Vector2): number {
        return this.closestPointTo(transform, point).distanceFrom(point);
    }

    isInside(transform: Transform, point: Vector2): boolean {
        return approximatelyEquals(this.distanceFrom(transform, point), 0);
    }

    getInitialRays(transform: Transform): InitialRay[] {
        const start = this.findStart(transform);
        const segment = this.findSegment(transform);

        const direction = segment
            .clone()
            .rotateBy(Math.PI / 2)
            .normalize();

        let currentPosition = (segment.magnitude % this.raySeparation) / 2;
        const initialRays: InitialRay[] = [];
        while (currentPosition <= segment.magnitude) {
            initialRays.push({
                origin: start
                    .clone()
                    .add(
                        segment
                            .clone()
                            .normalize()
                            .multiplyScalar(currentPosition),
                    ),
                direction,
            });

            currentPosition += this.raySeparation;
        }

        return initialRays;
    }

    render(transform: Transform, ctx: CanvasRenderingContext2D): void {
        const start = fromWorld(this.findStart(transform));
        const end = fromWorld(this.findEnd(transform));

        ctx.strokeStyle = Preferences.colors.source ?? "";

        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    shouldRender(transform: Transform): boolean {
        // TODO: Implement shouldRender for LineGeometery
        return true;
    }

    getBoundingBox(transform: Transform): BoundingBox {
        return new BoundingBox(
            this.findStart(transform),
            this.findEnd(transform),
        );
    }

    isTranslatable(): boolean {
        return true;
    }

    isScalable(): boolean {
        return true;
    }

    isRotatable(): boolean {
        return true;
    }

    getProperties(): Property[] {
        return [
            {
                kind: "number",
                label: "Ray Separation",
                get: () => this.raySeparation,
                set: (newValue) => (this.raySeparation = newValue),
            },
        ];
    }

    /* Utility functions */

    private findSegment({ scale, rotation }: Transform): Vector2 {
        return Vector2.fromDirectionalMagnitude(scale, rotation);
    }

    private findStart(transform: Transform): Vector2 {
        const segment = this.findSegment(transform);

        return transform.translation.clone().sub(segment.multiplyScalar(0.5));
    }

    private findEnd(transform: Transform): Vector2 {
        const segment = this.findSegment(transform);

        return transform.translation.clone().add(segment.multiplyScalar(0.5));
    }

    private closestPointTo(transform: Transform, point: Vector2) {
        const start = this.findStart(transform);
        const end = this.findEnd(transform);
        const segment = this.findSegment(transform);

        const pointLineStartVector = point.clone().sub(start);
        const t = pointLineStartVector.dot(segment) / segment.dot(segment);

        if (t < 0) {
            return start;
        } else if (t > 1) {
            return end;
        } else {
            return start.clone().add(segment.clone().multiplyScalar(t));
        }
    }
}
