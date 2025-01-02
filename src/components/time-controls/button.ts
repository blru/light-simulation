import "./button.scss";

export type Options = {
    icon: string;
    handleClick: () => void;
};

export function create(options: Options) {
    const button = document.createElement("button");
    button.classList.add("time-controls-button");
    button.addEventListener("click", options.handleClick);

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-fw", options.icon);
    button.append(icon);

    return button;
}

export function setIsActive(
    button: ReturnType<typeof create>,
    isActive: boolean,
) {
    if (isActive) button.classList.add("active");
    else button.classList.remove("active");
}
