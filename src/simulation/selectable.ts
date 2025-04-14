import { BoundingBox } from "./selectable/bounding-box";
import { DistanceMeasurable, isDistanceMeasurable } from "./simulation-object";
import {
    isTransformable,
    PossibleTransformationsDeterminable,
    Transformable,
} from "./transformable";

export interface Selectable
    extends DistanceMeasurable,
        Transformable,
        PossibleTransformationsDeterminable {
    getBoundingBox(): BoundingBox;
}

export function isSelectable(object: Object): object is Selectable {
    return (
        (<Selectable>object).getBoundingBox != null &&
        isDistanceMeasurable(object) &&
        isTransformable(object) &&
        isDistanceMeasurable(object)
    );
}

export interface SelectionRenderable {
    renderSelection(ctx: CanvasRenderingContext2D): void;
}

export function isSelectionRenderable(
    object: Object,
): object is SelectionRenderable {
    return (<SelectionRenderable>object).renderSelection != null;
}
