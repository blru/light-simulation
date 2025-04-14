import { toWorld } from "src/simulation/renderer";
import { ToolDescriptor } from "../tool-descriptor";
import { OpticalMedium } from "src/simulation/objects/optical-medium";
import { Simulation } from "src/simulation";
import { Transform } from "src/simulation/transformable";
import { LineMediumGeometry } from "src/simulation/objects/optical-medium/geometries/line";

export const MediumDescriptor: ToolDescriptor = {
    metadata: {
        name: "Medium",
        icon: "fa-square",
        shortcut: { code: "Digit5" },
    },
    handleClick(event: MouseEvent) {
        const position = toWorld(event.x, event.y);

        const medium = new OpticalMedium(
            new Transform(position, 200, Math.PI / 2),
            new LineMediumGeometry(),
        );

        // Since a medium was placed, recompute all the light rays
        Simulation.recomputeLightRays();

        Simulation.objects.add(medium);
    },
} as const;
