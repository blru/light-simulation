import { tool } from "../components/toolbar";
import "./toolbar.scss";

export const toolbar = document.createElement("div");
toolbar.id = "toolbar";
toolbar.classList.add("island");

// TODO: Clear this up when an actual tool system is implemented
toolbar.append(
    tool.create({
        icon: "fa-arrow-pointer",
        shortcut: "1",
        isSelected: true,
        handleClick: () => {},
    }),
    tool.create({
        icon: "fa-bolt",
        shortcut: "2",
        handleClick: () => {},
    }),
    tool.create({
        icon: "fa-lightbulb",
        shortcut: "3",
        handleClick: () => {},
    }),
    tool.create({
        icon: "fa-square",
        shortcut: "4",
        handleClick: () => {},
    }),
    tool.create({
        icon: "fa-square-caret-right",
        shortcut: "5",
        handleClick: () => {},
    }),
);
