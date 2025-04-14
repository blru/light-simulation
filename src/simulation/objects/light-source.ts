import { Vector2 } from "../math/vector-2";
import { BoundingBox } from "../selectable/bounding-box";
import { SimulationObject } from "../simulation-object";
import { Transform } from "../transformable";
import { SourceGeometry } from "./light-source/source-geometry";
import { InitialRay, Ray } from "./light-source/ray";
import { isSelectionRenderable, SelectionRenderable } from "../selectable";
import { ComputationIndicator } from "src/elements/computation-indicator";
import { fromWorld } from "../renderer";
import { Preferences } from "../preferences";
import { Property } from "src/elements/properties-pane/properties";
import { LineSourceGeometry } from "./light-source/geometries/line";
import { PointSourceGeometry } from "./light-source/geometries/point";

const RAY_PREVIEW_LENGTH = 30;

export class LightSource
    extends SimulationObject
    implements SelectionRenderable
{
    public maxRayLength: number = 10000;
    private readonly rays: Set<Ray> = new Set();

    constructor(
        transform: Transform,
        public geometry: SourceGeometry,
    ) {
        super();

        this.transform = transform;
    }

    /** Clears all rays and creates new rays that will be recomputed. */
    recomputeRays() {
        ComputationIndicator.show();

        setTimeout(() => {
            this.rays.clear();

            // Create new rays
            for (const initialRay of this.getInitialRays()) {
                const ray = new Ray(this, initialRay);

                ray.computePath();

                this.rays.add(ray);
            }
        }, 0);
    }

    getInitialRays(): InitialRay[] {
        return this.geometry.getInitialRays(this.transform);
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

    isTranslatable(): boolean {
        return this.geometry.isTranslatable();
    }

    isScalable(): boolean {
        return this.geometry.isScalable();
    }

    isRotatable(): boolean {
        return this.geometry.isRotatable();
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Render all the rays
        for (const ray of this.rays) {
            ray.render(ctx);
        }

        this.geometry.render(this.transform, ctx);
    }

    renderSelection(ctx: CanvasRenderingContext2D): void {
        for (const initialRay of this.geometry.getInitialRays(this.transform)) {
            const origin = fromWorld(initialRay.origin);
            const end = fromWorld(
                initialRay.origin
                    .clone()
                    .add(
                        initialRay.direction
                            .clone()
                            .multiplyScalar(RAY_PREVIEW_LENGTH),
                    ),
            );

            ctx.strokeStyle = Preferences.colors.sourceRayPreview ?? "";

            ctx.lineWidth = 1;
            ctx.lineCap = "square";

            ctx.beginPath();
            ctx.moveTo(origin.x, origin.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

        if (isSelectionRenderable(this.geometry)) {
            this.geometry.renderSelection(this.transform, ctx);
        }
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
                label: "Source",
                getProperties: () => [
                    {
                        kind: "string_list",
                        label: "Type",
                        choices: ["Line", "Point"],
                        set: (newValue) => {
                            switch (newValue) {
                                case "Line":
                                    this.geometry = new LineSourceGeometry();
                                    break;
                                case "Point":
                                    this.geometry = new PointSourceGeometry();
                                    break;
                            }
                        },
                        get: () => {
                            if (this.geometry instanceof LineSourceGeometry)
                                return "Line";

                            if (this.geometry instanceof PointSourceGeometry)
                                return "Point";

                            return ""; // fallback, bad design :(
                        },
                    },
                    {
                        kind: "number",
                        label: "Maximum Ray Length",
                        get: () => this.maxRayLength,
                        set: (newValue) => (this.maxRayLength = newValue),
                    },
                ],
            },

            // Geometry properties
            {
                kind: "sub_property",
                label: "Geometery",
                getProperties: () => this.geometry.getProperties(),
            },
        ];
    }
}
