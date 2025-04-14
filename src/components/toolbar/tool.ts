import "./tool.scss";

type Options = {
    icon: string;
    shortcut: string;
};

export function create(options: Options) {
    const tool = document.createElement("button");
    tool.classList.add("toolbar-tool");

    const icon = document.createElement("i");
    icon.classList.add("fa-fw", "fa-solid", options.icon);
    tool.append(icon);

    const shortcut = document.createElement("kbd");
    shortcut.innerText = options.shortcut;
    tool.append(shortcut);

    return tool;
}

export function setIsSelected(button: HTMLElement, isSelected: boolean) {
    if (isSelected) button.classList.add("selected");
    else button.classList.remove("selected");
}

export const Tool = { create, setIsSelected } as const;
