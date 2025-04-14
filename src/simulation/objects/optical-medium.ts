import { Vector2 } from "../math/vector-2";
import { MediumGeometry } from "./optical-medium/medium-geometry";
import { SimulationObject } from "../simulation-object";
import { BoundingBox } from "../selectable/bounding-box";
import { Transform } from "../transformable";
import { Property } from "src/elements/properties-pane/properties";
import { LineMediumGeometry } from "./optical-medium/geometries/line";
import { CircularArcMediumGeometry } from "./optical-medium/geometries/circular-arc";
import { RectangleMediumGeometry } from "./optical-medium/geometries/rectangle";

export type Behavior = "reflective" | "refractive";

export class OpticalMedium extends SimulationObject {
    public behavior: Behavior = "reflective";
    public refractiveIndex: number = 1;

    constructor(
        transform: Transform,
        public geometry: MediumGeometry,
    ) {
        super();

        this.transform = transform;
    }

    isTranslatable(): boolean {
        return this.geometry.isTranslatable();
    }

    isScalable(): boolean {
        return this.geometry.isScalable();
    }

    isRotatable(): boolean {
        return this.geometry.isRotatable();
    }

    getBoundingBox(): BoundingBox {
        return this.geometry.getBoundingBox(this.transform);
    }

    distanceFrom(point: Vector2): number {
        return this.geometry.distanceFrom(this.transform, point);
    }

    isInside(point: Vector2): boolean {
        return this.geometry.isInside(this.transform, point);
    }

    normalAt(point: Vector2): Vector2 {
        return this.geometry.normalAt(this.transform, point);
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.geometry.render(this.transform, ctx);
    }

    shouldRender(): boolean {
        return this.geometry.shouldRender(this.transform);
    }

    getProperties(): Property[] {
        return [
            // Common object properties
            ...super.getProperties(),

            // Own properties
            {
                kind: "sub_property",
                label: "Medium",
                getProperties: () => [
                    {
                        kind: "string_list",
                        label: "Type",
                        choices: ["Line", "Rectangle", "Circular Arc"],
                        set: (newValue) => {
                            switch (newValue) {
                                case "Line":
                                    this.geometry = new LineMediumGeometry();
                                    break;
                                case "Rectangle":
                                    this.geometry =
                                        new RectangleMediumGeometry();
                                    break;
                                case "Circular Arc":
                                    this.geometry =
                                        new CircularArcMediumGeometry();
                                    break;
                            }
                        },
                        get: () => {
                            if (this.geometry instanceof LineMediumGeometry)
                                return "Line";

                            if (
                                this.geometry instanceof RectangleMediumGeometry
                            )
                                return "Rectangle";

                            if (
                                this.geometry instanceof
                                CircularArcMediumGeometry
                            )
                                return "Circular Arc";

                            return ""; // fallback, bad design :(
                        },
                    },
                    {
                        kind: "string_list",
                        label: "Behavior",
                        get: () => this.behavior,
                        set: (newValue) => {
                            this.behavior = <Behavior>newValue;
                        },
                        choices: <Behavior[]>["reflective", "refractive"], // Ensures only a valid behavior can be selected
                    },
                    {
                        kind: "number",
                        label: "Refractive Index",
                        get: () => this.refractiveIndex,
                        set: (newValue) => (this.refractiveIndex = newValue),
                    },
                ],
            },

            // Geometry properties
            {
                kind: "sub_property",
                label: "Geometry",
                getProperties: () => this.geometry.getProperties(),
            },
        ];
    }
}
