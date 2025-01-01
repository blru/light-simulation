import "./main-menu.scss";
import * as theming from "../theming";
import { button, linkButton, separator } from "../components/main-menu";

export const mainMenuContainer = document.createElement("div");
mainMenuContainer.id = "main-menu-container";

const mainMenu = document.createElement("div");
mainMenu.classList.add("island");

// Functions for manipulating menu
export const open = () => mainMenu.classList.add("open");
export const close = () => mainMenu.classList.remove("open");
export const isOpen = () => mainMenu.classList.contains("open");
export const toggle = () => (isOpen() ? close() : open());

const mainMenuButton = document.createElement("button");
mainMenuButton.classList.add("island");
mainMenuButton.innerHTML = `<i class="fa-solid fa-bars"></i>`;
mainMenuButton.addEventListener("click", toggle);
mainMenuButton.ariaLabel = "Open Main Menu";

mainMenuContainer.append(mainMenuButton, mainMenu); // append main menu after main menu button

const themeToggle = button.create({
    icon: "fa-solid fa-circle-half-stroke",
    label: "Toggle Theme",
    className: "theme-toggle",
    handleClick: () => {
        theming.togglePreference();

        return false;
    },
});
const githubLink = linkButton.create({
    icon: "fa-brands fa-github",
    label: "GitHub",
    href: "https://github.com/blru/light-simulation",
});

// Append all the menu items after creating them
mainMenu.append(themeToggle, separator.create(), githubLink);

document.addEventListener("mousedown", (event) => {
    if (!isOpen()) return;

    // PERF: This seems inefficient
    const isMainMenuClick = event.composedPath().includes(mainMenuContainer);

    if (!isMainMenuClick) close();
});
