import { Vector2 } from "src/simulation/math/vector-2";
import {
    PossibleTransformationsDeterminable,
    Transform,
} from "src/simulation/transformable";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { HasProperties } from "src/elements/properties-pane/has-properties";

export interface MediumGeometry
    extends PossibleTransformationsDeterminable,
        HasProperties {
    /** Returns the normalized normal at this point */
    normalAt(transform: Transform, point: Vector2): Vector2;

    /** Returns the closest distance from a point to this geometry. */
    distanceFrom(transform: Transform, point: Vector2): number;

    /** Returns true if the point is inside this medium */
    isInside(transform: Transform, point: Vector2): boolean;

    /** Renders this geometry to the provided context */
    render(transform: Transform, ctx: CanvasRenderingContext2D): void;

    /** Determines if this geometry should be rendered */
    shouldRender(transform: Transform): boolean;

    /** Gets the bounding box for this geometry */
    getBoundingBox(transform: Transform): BoundingBox;
}
