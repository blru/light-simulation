import "./separator.scss";

export function create() {
    const separator = document.createElement("hr");
    separator.classList.add("main-menu-separator");

    return separator;
}
