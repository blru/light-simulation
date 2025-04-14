import { Vector2 } from "../math/vector-2";

export class BoundingBox {
    public readonly topLeft: Vector2;
    public readonly bottomRight: Vector2;

    constructor(point1: Vector2, point2: Vector2) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;

        this.topLeft = new Vector2(Math.min(x1, x2), Math.min(y1, y2));
        this.bottomRight = new Vector2(Math.max(x1, x2), Math.max(y1, y2));
    }

    get width() {
        return this.bottomRight.x - this.topLeft.x;
    }

    get height() {
        return this.bottomRight.y - this.topLeft.y;
    }

    get center() {
        return new Vector2(
            (this.topLeft.x + this.bottomRight.x) / 2,
            (this.topLeft.y + this.bottomRight.y) / 2,
        );
    }

    pad(paddingAmount: number) {
        const padding = new Vector2(paddingAmount, paddingAmount);

        this.topLeft.sub(padding);
        this.bottomRight.add(padding);

        return this;
    }

    getCorners(): Vector2[] {
        const { bottomRight, topLeft } = this;

        const xPositions = [topLeft.x, bottomRight.x];
        const yPositions = [topLeft.y, bottomRight.y];

        return xPositions
            .map((x) => yPositions.map((y) => new Vector2(x, y)))
            .flat();
    }

    isInside(point: Vector2) {
        return (
            point.x >= this.topLeft.x &&
            point.y >= this.topLeft.y &&
            point.x <= this.bottomRight.x &&
            point.y <= this.bottomRight.y
        );
    }
}
