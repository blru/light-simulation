import { Vector2 } from "src/simulation/math/vector-2";
import { ToolDescriptor } from "../tool-descriptor";
import { fromWorld, toWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { Simulation } from "src/simulation";
import { LightSource } from "src/simulation/objects/light-source";
import { Transform } from "src/simulation/transformable";
import { LineSourceGeometry } from "src/simulation/objects/light-source/geometries/line";

type RayData = { origin?: Vector2; end?: Vector2 };

const data: RayData = {};

function clear() {
    data.origin = undefined;
    data.end = undefined;
}

export const RayDescriptor: ToolDescriptor = {
    metadata: {
        name: "Ray",
        icon: "fa-bolt",
        shortcut: { code: "Digit3" },
    },

    handleSelect() {
        clear();
    },

    handleMouseDown(event: MouseEvent) {
        // Set the origin to where the mouse was pressed down
        data.origin = toWorld(event.x, event.y);
    },

    handleMouseUp(event: MouseEvent) {
        // Set the end to where the mouse was pressed down
        data.end = toWorld(event.x, event.y);

        // Make a source with a ray pointing in that direction
        const { origin, end } = data;
        if (origin != null && end != null && !origin.equals(end)) {
            const angle = end.clone().sub(origin).angle - Math.PI / 2;

            const geometry = new LineSourceGeometry();
            geometry.raySeparation = 50;

            const source = new LightSource(
                new Transform(origin, 45, angle),
                geometry,
            );
            source.recomputeRays(); // Initialize the rays

            Simulation.objects.add(source);
        }

        clear();
    },

    handleMouseMove(event: MouseEvent) {
        // If an origin has been set, set the end
        if (data.origin != null) {
            data.end = toWorld(event.x, event.y);
        }
    },

    render(ctx: CanvasRenderingContext2D) {
        // Don't render anaything if two points are not yet present
        if (data.origin == null || data.end == null) return;

        const origin = fromWorld(data.origin);
        const end = fromWorld(data.end);

        ctx.strokeStyle = Preferences.colors.rayToolPreview ?? "";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;

        // Tail
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Arrow
        const direction = end.clone().sub(origin).normalize();

        for (const sign of [-1, 1]) {
            const arrowSegment = end
                .clone()
                .sub(direction.clone().multiplyScalar(20))
                .sub(
                    direction
                        .clone()
                        .multiplyScalar(10)
                        .rotateBy((sign * Math.PI) / 2),
                );

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(arrowSegment.x, arrowSegment.y);
            ctx.stroke();
        }
    },
};
