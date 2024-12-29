import "./separator.scss";

export function create(): HTMLHRElement {
    const separator = document.createElement("hr");
    separator.classList.add("context-menu-separator");

    return separator;
}
