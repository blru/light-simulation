import "./toolbar.scss";
import { getHumanReadableDefinition, Shortcuts } from "../shortcuts";
import { Separator as SeparatorComponent } from "src/components/toolbar/separator";
import { Tool as ToolComponent } from "../components/toolbar/tool";
import { ToolDescriptor } from "./toolbar/tool-descriptor";
import { DragDescriptor } from "./toolbar/tool-descriptors/drag";
import { SelectDescriptor } from "./toolbar/tool-descriptors/select";
import { RayDescriptor } from "./toolbar/tool-descriptors/ray";
import { LightSourceDescriptor } from "./toolbar/tool-descriptors/light-source";
import { MediumDescriptor } from "./toolbar/tool-descriptors/medium";
import { header } from "./overlay";

type ToolbarItem =
    | { kind: "tool"; descriptor: ToolDescriptor }
    | { kind: "separator" };

type Tool = {
    descriptor: ToolDescriptor;
    element: HTMLElement;
};

export const toolbar = document.createElement("div");
toolbar.id = "toolbar";
toolbar.classList.add("island");
header.append(toolbar);

const toolbarItems: ToolbarItem[] = [
    { kind: "tool", descriptor: DragDescriptor },
    { kind: "tool", descriptor: SelectDescriptor },
    { kind: "separator" },
    { kind: "tool", descriptor: RayDescriptor },
    { kind: "tool", descriptor: LightSourceDescriptor },
    { kind: "tool", descriptor: MediumDescriptor },
];
export const tools: Tool[] = [];
let currentTool: Tool;

export function select(newTool: Tool) {
    if (currentTool != null) {
        currentTool.descriptor.handleDeselect?.();

        ToolComponent.setIsSelected(currentTool.element, false);
    }

    newTool.descriptor.handleSelect?.();

    ToolComponent.setIsSelected(newTool.element, true);
    currentTool = newTool;
}

export function getCurrentTool() {
    return currentTool;
}

// Populate toolbar with the toolbarItems
for (const item of toolbarItems) {
    switch (item.kind) {
        case "separator":
            toolbar.append(SeparatorComponent.create());
            break;
        case "tool":
            const descriptor = item.descriptor;
            const element = ToolComponent.create({
                shortcut: getHumanReadableDefinition(
                    descriptor.metadata.shortcut,
                ),
                icon: descriptor.metadata.icon,
            });

            const tool: Tool = { element, descriptor };
            toolbar.append(element);
            tools.push(tool);

            element.addEventListener("click", () => select(tool));
            Shortcuts.bind(descriptor.metadata.shortcut, () => select(tool));
            break;
    }
}

// Select the first tool to be the initial tool
select(tools[0]);

export const Toolbar = { select, getCurrentTool } as const;
