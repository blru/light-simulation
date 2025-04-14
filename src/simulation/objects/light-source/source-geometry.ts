import { Vector2 } from "src/simulation/math/vector-2";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import {
    PossibleTransformationsDeterminable,
    Transform,
} from "src/simulation/transformable";
import { InitialRay } from "./ray";
import { HasProperties } from "src/elements/properties-pane/has-properties";

export interface SourceGeometry
    extends PossibleTransformationsDeterminable,
        HasProperties {
    /** Returns an array of initial rays along this geometry. */
    getInitialRays(transform: Transform): InitialRay[];

    /** Returns the closest distance from a point to this geometry. */
    distanceFrom(transform: Transform, point: Vector2): number;

    /** Returns true if the point is inside this geometry */
    isInside(transform: Transform, point: Vector2): boolean;

    /** Renders this geometry to the provided context */
    render(transform: Transform, ctx: CanvasRenderingContext2D): void;

    /** Custom renderer while this object is selected */
    renderSelection?(transform: Transform, ctx: CanvasRenderingContext2D): void;

    /** Determines if this geometry should be rendered */
    shouldRender(transform: Transform): boolean;

    /** Gets the bounding box for this geometry */
    getBoundingBox(transform: Transform): BoundingBox;
}
