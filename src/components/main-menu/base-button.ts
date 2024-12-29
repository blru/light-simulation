import "./base-button.scss";

export type Options = {
    icon: string;
    label: string;
    className?: string;
};

export function create(options: Options, isAnchor: boolean) {
    const button = document.createElement(isAnchor ? "a" : "button");
    button.classList.add("main-menu-button", "button-like");
    if (options.className)
        button.classList.add(...options.className.split(" ")); // add any custom classes

    const icon = document.createElement("i");
    icon.classList.add("fa-fw", ...options.icon.split(" "));
    button.append(icon);

    const label = document.createElement("span");
    label.innerText = options.label;
    button.append(label);

    return button;
}
