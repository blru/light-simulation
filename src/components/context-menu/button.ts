import "./button.scss";

export type Options = {
    label: string;
    shortcut?: string;
    handleClick: () => void;
};

export function create(options: Options): HTMLButtonElement {
    const button = document.createElement("button");
    button.classList.add("context-menu-button");
    button.addEventListener("click", options.handleClick);

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
