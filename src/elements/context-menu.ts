import "./context-menu.scss";
import appContainer from "./app-container";
import { button, separator } from "../components/context-menu";

type ButtonContextItem = {
    kind: "button";
} & button.Options;
type SeparatorContextItem = { kind: "separator" };
type ContextItem = ButtonContextItem | SeparatorContextItem;

const contextMenuOverlay = document.createElement("div");
contextMenuOverlay.classList.add("overlay");
contextMenuOverlay.id = "context-menu-overlay";
contextMenuOverlay.tabIndex = -1;
appContainer.append(contextMenuOverlay);

let contextMenu: HTMLDivElement | null = null;

export function close() {
    contextMenu?.remove();
    contextMenu = null;
}

function createItemElement(item: ContextItem) {
    if (item.kind === "button")
        return button.create({
            ...item,
            handleClick: () => {
                close(); // close context menu when an item is clicked

                item.handleClick();
            },
        });

    // TODO: This is meant to be a fallback if the item is not of one of the above kinds
    // but it's really just bad design
    return separator.create();
}

export function open(position: { x: number; y: number }, items: ContextItem[]) {
    if (contextMenu != null) close();

    contextMenu = document.createElement("div");
    contextMenu.id = "context-menu";

    // populate with items
    contextMenu.append(...items.map(createItemElement));

    // append so it can be part of DOM for next step
    contextMenuOverlay.append(contextMenu);

    // position in such a way that it never goes out of bounds
    let boundingRect = contextMenu.getBoundingClientRect();
    contextMenu.style.left = `${Math.min(position.x, window.innerWidth - boundingRect.width)}px`;
    contextMenu.style.top = `${Math.min(position.y, window.innerHeight - boundingRect.height)}px`;
}

document.addEventListener("mousedown", (event) => {
    if (contextMenu == null) return;

    // PERF: This seems inefficient
    const isContextMenuClick = event.composedPath().includes(contextMenu);

    if (!isContextMenuClick) close();
});

// TODO: Update context menu if window is resized making it out of bounds
// window.addEventListener("resize", () => { ... })
