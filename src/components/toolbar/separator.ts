import "./separator.scss";

export function create() {
    const separator = document.createElement("hr");
    separator.classList.add("separator");

    return separator;
}

export const Separator = { create } as const;
