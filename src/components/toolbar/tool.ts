import "./tool.scss";

type Options = {
    icon: string;
    shortcut: string;
    handleClick: () => void;
};

export function create(options: Options) {
    const tool = document.createElement("button");
    tool.classList.add("toolbar-tool");
    tool.addEventListener("click", options.handleClick);

    const icon = document.createElement("i");
    icon.classList.add("fa-fw", "fa-solid", options.icon);
    tool.append(icon);

    const shortcut = document.createElement("kbd");
    shortcut.innerText = options.shortcut;
    tool.append(shortcut);

    return tool;
}

export function setIsSelected(
    button: ReturnType<typeof create>,
    isSelected: boolean,
) {
    if (isSelected) button.classList.add("selected");
    else button.classList.remove("selected");
}
