import { HasProperties } from "src/elements/properties-pane/has-properties";
import { Vector2 } from "./math/vector-2";
import { Renderable } from "./renderer/renderable";
import { Selectable } from "./selectable";
import { BoundingBox } from "./selectable/bounding-box";
import {
    PossibleTransformationsDeterminable,
    Transform,
    Transformable,
} from "./transformable";
import { Property } from "src/elements/properties-pane/properties";

export interface DistanceMeasurable {
    /** Returns the shortest distance between this point and the geometry */
    distanceFrom(point: Vector2): number;
}

export function isDistanceMeasurable(
    object: Object,
): object is DistanceMeasurable {
    return (<DistanceMeasurable>object).distanceFrom != null;
}

export abstract class SimulationObject
    implements
        Renderable,
        Transformable,
        PossibleTransformationsDeterminable,
        Selectable,
        HasProperties
{
    public transform: Transform = new Transform();

    abstract getBoundingBox(): BoundingBox;
    abstract distanceFrom(point: Vector2): number;
    abstract distanceFrom(point: Vector2): number;
    abstract isInside(point: Vector2): boolean;

    abstract isTranslatable(): boolean;
    abstract isScalable(): boolean;
    abstract isRotatable(): boolean;

    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract shouldRender(): boolean;

    public getProperties(): Property[] {
        return [
            {
                kind: "sub_property",
                label: "Transformation",
                getProperties: () => this.transform.getProperties(),
            },
        ];
    }
}
