import "./context-menu.scss";
import appContainer from "./app-container";

type ButtonContextItem = {
    kind: "button";
    label: string;
    shortcut?: string;
    handleClick: () => void;
};
type SeparatorContextItem = { kind: "separator" };
type ContextItem = ButtonContextItem | SeparatorContextItem;

const contextMenuOverlay = document.createElement("div");
contextMenuOverlay.classList.add("overlay");
contextMenuOverlay.id = "context-menu-overlay";
contextMenuOverlay.tabIndex = -1;
appContainer.append(contextMenuOverlay);

let contextMenu: HTMLDivElement | null = null;

function createSeparator(): HTMLHRElement {
    const separator = document.createElement("hr");
    separator.classList.add("separator");

    return separator;
}

function createButton(options: ButtonContextItem): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add("button");
    button.addEventListener("click", () => {
        close(); // close dialog after an option is clicked
        options.handleClick();
    });

    const label = document.createElement("span");
    label.innerText = options.label;
    button.append(label);

    if (options.shortcut != null) {
        const shortcut = document.createElement("kbd");
        shortcut.innerText = options.shortcut;
        button.append(shortcut);
    }

    return button;
}

function createItemElement(item: ContextItem) {
    if (item.kind === "button") return createButton(item);

    // TODO: This is meant to be a fallback if the item is not of one of the above kinds
    // but it's really just bad design
    return createSeparator();
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

export function close() {
    contextMenu?.remove();
    contextMenu = null;
}

document.addEventListener("mousedown", (event) => {
    if (contextMenu == null) return;

    // PERF: This seems inefficient
    const isContextMenuClick = event.composedPath().includes(contextMenu);

    if (!isContextMenuClick) close();
});

// TODO: Update context menu if window is resized making it out of bounds
