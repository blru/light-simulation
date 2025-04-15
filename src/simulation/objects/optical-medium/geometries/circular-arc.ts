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
    public deltaTheta: number = Math.PI / 2;
    public radius: number = 200;

    normalAt(transform: Transform, point: Vector2): Vector2 {
        const center = this.findCenter(transform);

        return point.sub(center).normalize();
    }

    distanceFrom(transform: Transform, point: Vector2): number {
        const { start: startAngle, end: endAngle } =
            this.findCentralAngles(transform);
        const center = this.findCenter(transform);

        const centerDistance = center.distanceFrom(point);
        const pointAngle = point.clone().sub(center).angle;

        if (this.isAngleBetween(transform, pointAngle)) {
            // Closest point lies on the arc's curve
            return Math.abs(centerDistance - this.radius);
        } else {
            const start = Vector2.fromDirectionalMagnitude(
                startAngle,
                this.radius,
            );
            const end = Vector2.fromDirectionalMagnitude(endAngle, this.radius);

            return Math.min(
                point.distanceFrom(start.add(center)),
                point.distanceFrom(end.add(center)),
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
                get: () => this.deltaTheta * (180 / Math.PI),
                set: (newValue) => {
                    const inputAngle = newValue * (Math.PI / 180);

                    // Clamp to [0, pi]
                    this.deltaTheta = Math.max(
                        Math.min(Math.PI, inputAngle),
                        0,
                    );
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
        const start = this.normAngle(transform.rotation - this.deltaTheta / 2);
        const end = this.normAngle(transform.rotation + this.deltaTheta / 2);

        return {
            start,
            end,
        };
    }

    private isAngleBetween(transform: Transform, theta: number) {
        const { start, end } = this.findCentralAngles(transform);

        theta = this.normAngle(theta);

        if (start < end) {
            return start <= theta && theta <= end;
        } else {
            return theta >= start || theta <= end;
        }
    }

    private normAngle(angle: number) {
        return ((angle % TAU) + TAU) % TAU;
    }
}
