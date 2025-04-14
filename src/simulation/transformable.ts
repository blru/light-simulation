import { HasProperties } from "src/elements/properties-pane/has-properties";
import { Vector2 } from "./math/vector-2";
import { Property } from "src/elements/properties-pane/properties";

export class Transform implements HasProperties {
    constructor(
        /* Translation of the object. Should be from the center */
        public translation: Vector2 = new Vector2(),

        /* Multiplicative object scale */
        public scale: number = 1,

        /* Rotation in radians */
        public rotation: number = 0,
    ) {}

    getProperties(): Property[] {
        return [
            {
                kind: "sub_property",
                label: "Translation",
                getProperties: () => this.translation.getProperties(),
            },
            {
                kind: "number",
                label: "Scale",
                set: (newValue: number) => {
                    this.scale = newValue;
                },
                get: () => this.scale,
            },
            {
                kind: "number",
                label: "Rotation (deg)",
                set: (newValue: number) => {
                    this.rotation = newValue * (Math.PI / 180);
                },
                get: () => this.rotation * (180 / Math.PI),
            },
        ];
    }
}

export interface Transformable {
    transform: Transform;
}

export function isTransformable(object: Object): object is Transformable {
    return (<Transformable>object).transform != null;
}

export interface PossibleTransformationsDeterminable {
    isTranslatable(): boolean;
    isScalable(): boolean;
    isRotatable(): boolean;
}

export function isPossibleTransformationsDeterminable(
    object: Object,
): object is PossibleTransformationsDeterminable {
    return (
        (<PossibleTransformationsDeterminable>object).isTranslatable != null &&
        (<PossibleTransformationsDeterminable>object).isScalable != null &&
        (<PossibleTransformationsDeterminable>object).isRotatable != null
    );
}
