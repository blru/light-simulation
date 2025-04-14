import { Renderer } from "src/simulation/renderer";
import { ToolDescriptor } from "../tool-descriptor";
import { Coordinates } from "src/elements/coordinates";

export const DragDescriptor: ToolDescriptor = {
    metadata: {
        name: "Drag",
        icon: "fa-hand",
        shortcut: { code: "Digit1" },
    } as const,
    handleSelect() {},
    handleDeselect() {},
    handleMouseMove(event: MouseEvent) {
        // event.buttons is a bitfield
        const isHoldingLeftMouseButton = (event.buttons & 1) === 1;
        if (!isHoldingLeftMouseButton) return;

        let camera = Renderer.camera;
        camera.position.x += event.movementX;
        camera.position.y += event.movementY;

        Coordinates.show(camera.position);
    },
} as const;
