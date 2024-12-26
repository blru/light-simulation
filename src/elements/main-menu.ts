import "./main-menu.scss";
import { overlayUpper } from "./overlay";
import * as theming from "../theming";

type BaseButtonOptions = { icon: string; label: string; className?: string };
type ButtonOptions = BaseButtonOptions & { handleClick: () => boolean };
type LinkButtonOptions = BaseButtonOptions & { href: string };

const mainMenuContainer = document.createElement("div");
mainMenuContainer.id = "main-menu-container";
overlayUpper.append(mainMenuContainer);

const mainMenu = document.createElement("div");
mainMenu.classList.add("island");

// Functions for manipulating menu
export const toggle = () => mainMenu.classList.toggle("open");
export const open = () => mainMenu.classList.add("open");
export const close = () => mainMenu.classList.remove("open");
export const isOpen = () => mainMenu.classList.contains("open");

const mainMenuButton = document.createElement("button");
mainMenuButton.classList.add("island");
mainMenuButton.innerHTML = `<i class="fa-solid fa-bars"></i>`;
mainMenuButton.addEventListener("click", toggle);

mainMenuContainer.append(mainMenuButton, mainMenu); // append main menu after main menu button

function createBaseButton(options: BaseButtonOptions, isAnchor: boolean) {
    const button = document.createElement(isAnchor ? "a" : "button");
    button.classList.add("button", "button-like");
    if (options.className)
        button.classList.add(...options.className.split(" ")); // add any custom classes
    mainMenu.append(button);

    const icon = document.createElement("i");
    icon.classList.add("fa-fw", ...options.icon.split(" "));
    button.append(icon);

    const label = document.createElement("span");
    label.innerText = options.label;
    button.append(label);

    return button;
}

function createButton(options: ButtonOptions) {
    const button = <HTMLButtonElement>createBaseButton(options, false);
    button.addEventListener("click", () => {
        const shouldCloseMenu = options.handleClick(); // Call click handler and use return value to determine if menu should be closed

        if (shouldCloseMenu) close();
    });

    return button;
}

function createLinkButton(options: LinkButtonOptions) {
    const button = <HTMLAnchorElement>createBaseButton(options, true);
    button.href = options.href;
    button.target = "_blank";

    return button;
}

function createSeparator() {
    const separator = document.createElement("hr");
    separator.classList.add("separator");
    mainMenu.append(separator);

    return separator;
}

createButton({
    icon: "fa-solid",
    label: "Toggle Theme",
    className: "theme-toggle",
    handleClick: () => {
        theming.togglePreference();

        return false;
    },
});
createSeparator();
createLinkButton({
    icon: "fa-brands fa-github",
    label: "GitHub",
    href: "https://github.com/blru/light-simulation",
});

document.addEventListener("mousedown", (event) => {
    if (!isOpen()) return;

    // PERF: This seems inefficient
    const isMainMenuClick = event.composedPath().includes(mainMenuContainer);

    if (!isMainMenuClick) close();
});
