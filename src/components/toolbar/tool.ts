import "./tool.scss";

type Options = {
    icon: string;
    shortcut: string;
    isSelected?: boolean;
    handleClick: () => void;
};

export function create(options: Options) {
    const tool = document.createElement("button");
    tool.classList.add("toolbar-tool");
    if (options.isSelected) tool.classList.add("selected");

    const icon = document.createElement("i");
    icon.classList.add("fa-fw", "fa-solid", options.icon);
    tool.append(icon);

    const shortcut = document.createElement("kbd");
    shortcut.innerText = options.shortcut;
    tool.append(shortcut);

    return tool;
}
