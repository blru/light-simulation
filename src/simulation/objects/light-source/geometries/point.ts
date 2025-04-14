import { Vector2 } from "src/simulation/math/vector-2";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { Transform } from "src/simulation/transformable";
import { InitialRay } from "../ray";
import { SourceGeometry } from "../source-geometry";
import { Preferences } from "src/simulation/preferences";
import { fromWorld } from "src/simulation/renderer";
import { Property } from "src/elements/properties-pane/properties";

const VISIBLE_RADIUS = 6;

export class PointSourceGeometry implements SourceGeometry {
    public rayQuantity: number = 8;

    getInitialRays(transform: Transform): InitialRay[] {
        const center = this.findCenter(transform);

        const initialRays: InitialRay[] = [];
        const angleIncrement = (2 * Math.PI) / this.rayQuantity;
        for (let angle = 0; angle < Math.PI * 2; angle += angleIncrement) {
            initialRays.push({
                origin: center,
                direction: Vector2.fromDirectionalMagnitude(1, angle),
            });
        }

        return initialRays;
    }

    distanceFrom(transform: Transform, point: Vector2): number {
        const center = this.findCenter(transform);

        return Math.abs(center.distanceFrom(point) - VISIBLE_RADIUS);
    }

    isInside(transform: Transform, point: Vector2): boolean {
        return false; // it's a point
    }

    render(transform: Transform, ctx: CanvasRenderingContext2D): void {
        const { x, y } = fromWorld(this.findCenter(transform));

        ctx.strokeStyle = Preferences.colors.source ?? "";
        ctx.fillStyle = Preferences.colors.background ?? "";

        ctx.beginPath();
        ctx.ellipse(x, y, VISIBLE_RADIUS, VISIBLE_RADIUS, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    shouldRender(transform: Transform): boolean {
        return true;
    }

    getBoundingBox(transform: Transform): BoundingBox {
        // NOTE: This is NOT a radius
        const centerCorner = new Vector2(VISIBLE_RADIUS, VISIBLE_RADIUS);

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
        return false;
    }

    getProperties(): Property[] {
        return [
            {
                kind: "number",
                label: "Ray Quantity",
                get: () => this.rayQuantity,
                set: (newValue) => (this.rayQuantity = newValue),
            },
        ];
    }

    /* Utility functions */

    findCenter(transform: Transform) {
        return transform.translation;
    }
}
