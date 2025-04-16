import { Vector2 } from "src/simulation/math/vector-2";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { Transform } from "src/simulation/transformable";
import { MediumGeometry } from "../medium-geometry";
import { fromWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { Property } from "src/elements/properties-pane/properties";
import { approximatelyEquals } from "src/simulation/math/utils";

export class RectangleMediumGeometry implements MediumGeometry {
    public width: number = 1;
    public height: number = 1;

    normalAt(transform: Transform, point: Vector2): Vector2 {
        const { topLeft, bottomRight } = this.getBoundingBox(transform);

        // TODO: Fix bad logic

        // Point is either on the top side or the bottom side
        const isOnHorizontalAxis =
            approximatelyEquals(point.y, topLeft.y) ||
            approximatelyEquals(point.y, bottomRight.y);
        if (
            point.x >= topLeft.x &&
            point.x <= bottomRight.x &&
            isOnHorizontalAxis
        ) {
            return Vector2.fromDirectionalMagnitude(1, Math.PI / 2);
        } else {
            return Vector2.fromDirectionalMagnitude(1, 0);
        }
    }

    distanceFrom(transform: Transform, point: Vector2): number {
        const boundingBox = this.getBoundingBox(transform);

        const { x: x1, y: y1 } = boundingBox.topLeft;
        const { x: x2, y: y2 } = boundingBox.bottomRight;

        if (boundingBox.isInside(point)) {
            return Math.min(
                point.x - x1,
                x2 - point.x,
                point.y - y1,
                y2 - point.y,
            );
        } else {
            const cx = Math.max(x1, Math.min(point.x, x2));
            const cy = Math.max(y1, Math.min(point.y, y2));
            const dx = point.x - cx;
            const dy = point.y - cy;

            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    isInside(transform: Transform, point: Vector2): boolean {
        return this.getBoundingBox(transform).isInside(point);
    }

    render(transform: Transform, ctx: CanvasRenderingContext2D): void {
        const boundingBox = this.getBoundingBox(transform);
        const { x, y } = fromWorld(boundingBox.topLeft);

        ctx.fillStyle = Preferences.colors.medium ?? "";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.roundRect(x, y, boundingBox.width, boundingBox.height, [4]);
        ctx.fill();
    }

    shouldRender(transform: Transform): boolean {
        // TODO: Implement shouldRender for LineGeometery
        return true;
    }

    // NOTE: This method is also used in other methods for performing calculations
    getBoundingBox({ translation, scale }: Transform): BoundingBox {
        const ratio = this.width / this.height;
        const halfWidth = (scale * ratio) / 2;
        const halfHeight = (scale * (1 / ratio)) / 2;

        return new BoundingBox(
            new Vector2(translation.x - halfWidth, translation.y - halfHeight),
            new Vector2(translation.x + halfWidth, translation.y + halfHeight),
        );
    }

    isTranslatable(): boolean {
        return true;
    }

    isScalable(): boolean {
        return true;
    }

    isRotatable(): boolean {
        return false;
    }

    getProperties(): Property[] {
        return [
            {
                kind: "number",
                label: "Width",
                get: () => this.width,
                set: (newValue) => {
                    this.width = Math.abs(newValue);
                },
            },
            {
                kind: "number",
                label: "Height",
                get: () => this.height,
                set: (newValue) => {
                    this.height = Math.abs(newValue);
                },
            },
        ];
    }

    /* Utility functions */
}
