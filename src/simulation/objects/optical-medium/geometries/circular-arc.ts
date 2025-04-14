import { Property } from "src/elements/properties-pane/properties";
import { Vector2 } from "src/simulation/math/vector-2";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { Transform } from "src/simulation/transformable";
import { MediumGeometry } from "../medium-geometry";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { approximatelyEquals, wrapAngle } from "src/simulation/math/utils";
import { TAU } from "src/simulation/math/constants";

export class CircularArcMediumGeometry implements MediumGeometry {
    public angle: number = Math.PI / 2;
    public radius: number = 200;

    normalAt(transform: Transform, point: Vector2): Vector2 {
        const center = this.findCenter(transform);

        return point.sub(center).normalize();
    }

    distanceFrom(transform: Transform, point: Vector2): number {
        const center = this.findCenter(transform);
        const { start: startAngle, end: endAngle } =
            this.findCentralAngles(transform);

        const pointAngle = wrapAngle(point.clone().sub(center).angle);

        // TODO: Cleanup
        if (
            (startAngle < endAngle &&
                pointAngle >= startAngle &&
                pointAngle <= endAngle) ||
            (endAngle < startAngle &&
                (pointAngle >= startAngle || pointAngle >= endAngle))
        ) {
            // Is closest to point on arc
            return Math.abs(point.distanceFrom(center) - this.radius);
        } else {
            // Is closest to one of the end points
            const startPoint = center
                .clone()
                .add(Vector2.fromDirectionalMagnitude(this.radius, startAngle));
            const endPoint = center
                .clone()
                .add(Vector2.fromDirectionalMagnitude(this.radius, endAngle));

            return Math.min(
                startPoint.distanceFrom(point),
                endPoint.distanceFrom(point),
            );
        }
    }

    isInside(transform: Transform, point: Vector2): boolean {
        return approximatelyEquals(this.distanceFrom(transform, point), 0);
    }

    render(transform: Transform, ctx: CanvasRenderingContext2D): void {
        const center = fromWorld(this.findCenter(transform));
        const { start: startAngle, end: endAngle } =
            this.findCentralAngles(transform);

        ctx.strokeStyle = Preferences.colors.medium ?? "";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.arc(center.x, center.y, this.radius, startAngle, endAngle);
        ctx.stroke();
    }

    shouldRender(transform: Transform): boolean {
        return true;
    }

    getBoundingBox(transform: Transform): BoundingBox {
        const radius = this.radius;
        const centerCorner = new Vector2(radius, radius);

        const center = this.findCenter(transform);
        const topLeft = center.clone().sub(centerCorner);
        const bottomRight = center.clone().add(centerCorner);

        return new BoundingBox(topLeft, bottomRight);
    }

    isTranslatable(): boolean {
        return true;
    }

    isScalable(): boolean {
        return false;
    }

    isRotatable(): boolean {
        return true;
    }

    getProperties(): Property[] {
        return [
            {
                kind: "number",
                label: "Arc Angle (deg)",
                get: () => this.angle * (180 / Math.PI),
                set: (newValue) => {
                    const inputAngle = newValue * (Math.PI / 180);

                    // Clamp to [0, pi]
                    this.angle = Math.max(Math.min(Math.PI, inputAngle), 0);
                },
            },
            {
                kind: "number",
                label: "Radius",
                get: () => this.radius,
                set: (newValue) => {
                    this.radius = Math.abs(newValue);
                },
            },
        ];
    }

    /** Utility functions */

    private findCenter(transform: Transform) {
        return transform.translation.clone();
    }

    private findCentralAngles(transform: Transform): {
        start: number;
        end: number;
    } {
        // Rotation range is [-pi, pi], it needs to be [0, 2*pi]
        const halfArcAngle = this.angle / 2;
        const centralAngle = TAU + transform.rotation;
        const start = wrapAngle(centralAngle - halfArcAngle);
        const end = wrapAngle(centralAngle + halfArcAngle);

        return {
            start,
            end,
        };
    }
}
