import { ShortcutDefinition } from "src/shortcuts";

export type ToolMetadata = {
    icon: string;
    name: string;
    shortcut: ShortcutDefinition;
};

export type ToolDescriptor = {
    metadata: ToolMetadata;

    handleSelect?(): void;
    handleDeselect?(): void;
    handleClick?(event: MouseEvent): void;
    handleMouseMove?(event: MouseEvent): void;
    handleMouseDown?(event: MouseEvent): void;
    handleMouseUp?(event: MouseEvent): void;
    handleContextMenu?(event: PointerEvent): void;

    render?(ctx: CanvasRenderingContext2D): void;
};
