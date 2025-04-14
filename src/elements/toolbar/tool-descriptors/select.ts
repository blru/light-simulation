import { ToolDescriptor } from "../tool-descriptor";
import { Simulation } from "src/simulation";
import { fromWorld, toWorld } from "src/simulation/renderer";
import { Preferences } from "src/simulation/preferences";
import { BoundingBox } from "src/simulation/selectable/bounding-box";
import { Vector2 } from "src/simulation/math/vector-2";
import { ContextMenu } from "src/elements/context-menu";
import { Shortcuts } from "src/shortcuts";
import { SimulationObject } from "src/simulation/simulation-object";
import { isSelectionRenderable, Selectable } from "src/simulation/selectable";
import { LightSource } from "src/simulation/objects/light-source";
import { OpticalMedium } from "src/simulation/objects/optical-medium";
import { PropertiesPane } from "src/elements/properties-pane";

type Action = "translate" | "scale" | "rotate";
type Selection = {
    object: SimulationObject & Selectable;
    action: Action | null;
};

const MINIMUM_SELECTION_DISTANCE = 6;
const SELECTION_BOX_PADDING = 4;
const CORNER_SIZE = 8;
const ROTATOR_OFFSET = 8;
const ROTATOR_SIZE = 12;

export let selection: Selection | null = null;

function clear() {
    selection = null;
    PropertiesPane.hide();
    Simulation.recomputeLightRays();
}

function padBoundingBox(boundingBox: BoundingBox) {
    return boundingBox.pad(SELECTION_BOX_PADDING);
}

function isInTranslationRegion(point: Vector2, boundingBox: BoundingBox) {
    return boundingBox.isInside(point);
}

function isInScaleRegion(point: Vector2, boundingBox: BoundingBox) {
    const shortestCornerDistance = boundingBox
        .getCorners()
        .map((corner) => corner.distanceFrom(point)) // Map all the corners to their distance from the point
        .sort((a, b) => a - b)[0]; // sort the corners in ascending order. The first element is the closest.

    return shortestCornerDistance <= CORNER_SIZE;
}

function isInRotatorRegion(point: Vector2, boundingBox: BoundingBox) {
    const rotatorPosition = findRotatorPosition(boundingBox);

    return rotatorPosition.distanceFrom(point) <= ROTATOR_SIZE;
}

function findRotatorPosition(boundingBox: BoundingBox) {
    return new Vector2(
        boundingBox.center.x,
        boundingBox.topLeft.y - ROTATOR_OFFSET,
    );
}

/* Has the side-effect of modifying the selection */
function selectAt(position: Vector2) {
    if (selection != null) {
        const boundingBox = padBoundingBox(selection.object.getBoundingBox());

        // If clicking on any part of the bounding box, corners or angler don't reset the selection
        if (
            isInTranslationRegion(position, boundingBox) ||
            isInScaleRegion(position, boundingBox) ||
            isInRotatorRegion(position, boundingBox)
        ) {
            return;
        }
    } else {
        const closest = Simulation.closestObjectTo(position);

        if (
            closest != null &&
            (closest.distance <= MINIMUM_SELECTION_DISTANCE ||
                closest.object.isInside(position))
        ) {
            // A new selection is possible
            selection = {
                object: closest.object,
                action: null,
            };

            // Show the properties pane
            PropertiesPane.show(closest.object);

            return;
        }
    }

    // Nothing to select, the selection is cleared
    clear();
}

// Shortcut and context menu actions
function deleteSelection() {
    if (selection != null) {
        Simulation.objects.delete(selection.object);
        clear();
    }
}

export const SelectDescriptor: ToolDescriptor = {
    metadata: {
        name: "Select",
        icon: "fa-mouse-pointer",
        shortcut: { code: "Digit2" },
    },
    handleDeselect() {
        clear();
    },
    handleMouseMove(event) {
        const position = toWorld(event.x, event.y);

        // event.buttons is a bitfield
        const isHoldingLeftMouseButton = (event.buttons & 1) === 1;
        if (!isHoldingLeftMouseButton || selection?.action == null) return;

        // A vector from the center of the object to the mouse
        const outward = position
            .clone()
            .sub(selection.object.transform.translation);
        const isHoldingCtrl = event.ctrlKey;
        const { action, object } = selection;

        switch (action) {
            case "translate": {
                const movement = new Vector2(event.movementX, event.movementY);
                object.transform.translation.add(movement);

                break;
            }
            case "scale": {
                const increment = Preferences.snappings.scaling;
                let clampedScale = Math.max(increment, outward.magnitude * 2);

                // Grid snapping
                if (isHoldingCtrl) {
                    clampedScale =
                        Math.floor(clampedScale / increment) * increment;
                }

                object.transform.scale = clampedScale;

                break;
            }
            case "rotate": {
                // Snapping
                const increment = Preferences.snappings.angling;
                if (isHoldingCtrl) {
                    object.transform.rotation =
                        Math.floor(outward.angle / increment) * increment;
                } else {
                    object.transform.rotation = outward.angle;
                }

                break;
            }
        }
    },
    handleMouseDown(event) {
        const position = toWorld(event.x, event.y);

        // Selection logic
        selectAt(position);
        if (selection == null) {
            return;
        }

        const boundingBox = padBoundingBox(selection.object.getBoundingBox());

        if (isInRotatorRegion(position, boundingBox)) {
            selection.action = "rotate";
        } else if (isInScaleRegion(position, boundingBox)) {
            selection.action = "scale";
        } else if (isInTranslationRegion(position, boundingBox)) {
            selection.action = "translate";
        }
    },
    handleMouseUp(event) {
        const isRightMouseButton = (event.buttons & 2) === 2;
        if (selection != null && !isRightMouseButton) {
            selection.action = null;

            PropertiesPane.handlePropertyUpdate(selection.object);
        }
    },
    handleContextMenu(event) {
        if (selection == null) return;

        event.preventDefault();

        const shortcuts = Preferences.shortcuts;
        ContextMenu.open({ x: event.x, y: event.y }, [
            {
                kind: "button",
                label: "Cut",
                shortcut: shortcuts.cut,
                isDisabled: true,
                handleClick: () => {},
            },
            {
                kind: "button",
                label: "Copy",
                shortcut: shortcuts.copy,
                isDisabled: true,
                handleClick: () => {},
            },
            {
                kind: "button",
                label: "Paste",
                shortcut: shortcuts.paste,
                isDisabled: true,
                handleClick: () => {},
            },
            {
                kind: "button",
                label: "Delete",
                shortcut: shortcuts.delete,
                handleClick: deleteSelection,
            },
            { kind: "separator" },
            {
                kind: "button",
                label: "Select All",
                shortcut: shortcuts.selectAll,
                isDisabled: true,
                handleClick: () => {},
            },
        ]);
    },
    render(ctx) {
        if (selection == null) return;

        ctx.strokeStyle = Preferences.colors.selection ?? "";
        ctx.fillStyle = Preferences.colors.selection ?? "";
        ctx.lineWidth = 2;

        const boundingBox = padBoundingBox(selection.object.getBoundingBox());

        // Bounding Box
        {
            const { x, y } = fromWorld(boundingBox.topLeft);
            ctx.strokeRect(x, y, boundingBox.width, boundingBox.height);
        }

        // Scale Corners
        if (selection.object.isScalable()) {
            const size = new Vector2(CORNER_SIZE, CORNER_SIZE);

            for (const corner of boundingBox.getCorners()) {
                const cornerOffset = size.clone().multiplyScalar(-0.5);
                const { x, y } = fromWorld(corner.add(cornerOffset));

                ctx.fillRect(x, y, CORNER_SIZE, CORNER_SIZE);
            }
        }

        // Rotator
        if (selection.object.isRotatable()) {
            const { x, y } = fromWorld(findRotatorPosition(boundingBox));

            ctx.font = `normal 900 ${ROTATOR_SIZE}px 'Font Awesome 6 Free'`;
            ctx.textAlign = "center";
            ctx.fillText("\uf2f9", x, y);
        }

        // Selection Rendering
        if (isSelectionRenderable(selection.object)) {
            selection.object.renderSelection(ctx);
        }
    },
};

// Binding shorcuts
Shortcuts.bind(Preferences.shortcuts.delete, deleteSelection);
