import { tool } from "../components/toolbar";
import * as shortcuts from "../shortcuts";
import "./toolbar.scss";

export type ToolDescriptor = {
    id: string;
    shortcut: string;
    readableShortcut: string;
    icon: string;
};

const toolDescriptors = [
    {
        id: "select",
        shortcut: "Digit1",
        readableShortcut: "1",
        icon: "fa-arrow-pointer",
    },
    {
        id: "light_ray",
        shortcut: "Digit2",
        readableShortcut: "2",
        icon: "fa-bolt",
    },
    {
        id: "light_source",
        shortcut: "Digit3",
        readableShortcut: "3",
        icon: "fa-lightbulb",
    },
    {
        id: "mirror",
        shortcut: "Digit4",
        readableShortcut: "4",
        icon: "fa-square",
    },
    {
        id: "lens",
        shortcut: "Digit5",
        readableShortcut: "5",
        icon: "fa-square-caret-right",
    },
] as const satisfies ToolDescriptor[];

export type ToolIdentifier = (typeof toolDescriptors)[number]["id"];

export const toolbar = document.createElement("div");
toolbar.id = "toolbar";
toolbar.classList.add("island");

let currentTool: ToolIdentifier | null = null;
let toolToElement: { [K in ToolIdentifier]?: HTMLButtonElement } = {};

export function select(identifier: ToolIdentifier) {
    // Deselect old tool
    if (currentTool != null) {
        let currentToolElement = toolToElement[currentTool]!;
        tool.setIsSelected(currentToolElement, false);
    }

    // Select new tool
    let newToolElement = toolToElement[identifier]!;
    tool.setIsSelected(newToolElement, true);

    currentTool = identifier;
}

for (const descriptor of toolDescriptors) {
    const toolElement = tool.create({
        icon: descriptor.icon,
        shortcut: descriptor.readableShortcut,
        handleClick: () => select(descriptor.id),
    });

    // Bind tool to element in the toolbar
    toolToElement[descriptor.id] = toolElement;

    // Bind tool to a keyboard shortcut
    shortcuts.bind({ code: descriptor.shortcut }, () => select(descriptor.id));

    // Bind to shortcut

    toolbar.append(toolElement);
}

// Initialize by selecting the select tool
select("select");
