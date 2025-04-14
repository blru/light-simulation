import { toWorld } from "src/simulation/renderer";
import { ToolDescriptor } from "../tool-descriptor";
import { LightSource } from "src/simulation/objects/light-source";
import { Transform } from "src/simulation/transformable";
import { LineSourceGeometry } from "src/simulation/objects/light-source/geometries/line";
import { Simulation } from "src/simulation";
import { PointSourceGeometry } from "src/simulation/objects/light-source/geometries/point";

export const LightSourceDescriptor: ToolDescriptor = {
    metadata: {
        name: "Light Source",
        icon: "fa-lightbulb",
        shortcut: { code: "Digit4" },
    },
    handleClick(event: MouseEvent) {
        const position = toWorld(event.x, event.y);

        const source = new LightSource(
            new Transform(position, 100, -Math.PI / 2),
            new LineSourceGeometry(),
        );
        source.recomputeRays(); // Initialize the rays

        Simulation.objects.add(source);
    },
} as const;
