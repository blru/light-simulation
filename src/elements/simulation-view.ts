import "./simulation-view.scss";
import appContainer from "./app-container";
import { contextMenu } from ".";

export const simulationView: HTMLCanvasElement =
    document.createElement("canvas");
simulationView.id = "simulation-view";
appContainer.appendChild(simulationView);

function updateDimensions() {
    simulationView.width = window.innerWidth;
    simulationView.height = window.innerHeight;
}

window.addEventListener("load", updateDimensions);
window.addEventListener("resize", updateDimensions);

simulationView.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    contextMenu.open({ x: event.x, y: event.y }, [
        {
            kind: "button",
            label: "Cut",
            shortcut: "Ctrl + X",
            handleClick: () => {},
        },
        {
            kind: "button",
            label: "Copy",
            shortcut: "Ctrl + C",
            handleClick: () => {},
        },
        {
            kind: "button",
            label: "Paste",
            shortcut: "Ctrl + V",
            handleClick: () => {},
        },
        { kind: "separator" },
        {
            kind: "button",
            label: "Select All",
            shortcut: "Ctrl + A",
            handleClick: () => {},
        },
    ]);
});
