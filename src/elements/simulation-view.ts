import "./simulation-view.scss";
import appContainer from "./app-container";
import * as contextMenu from "./context-menu";
import { Renderer } from "src/simulation/renderer";
import { Toolbar } from "./toolbar";
import { ToolDescriptor } from "./toolbar/tool-descriptor";

export const simulationView: HTMLCanvasElement =
    document.createElement("canvas");
simulationView.id = "simulation-view";
appContainer.appendChild(simulationView);

// Attempt to get the context from the simulation view
const ctx = simulationView.getContext("2d");
if (ctx == null) throw new Error("Unable to get context from canvas.");
Renderer.setContext(ctx);

function updateDimensions() {
    simulationView.width = window.innerWidth;
    simulationView.height = window.innerHeight;
}

function createHandler(handler: keyof ToolDescriptor) {
    return (event: MouseEvent) => {
        const tool = Toolbar.getCurrentTool().descriptor;

        // Some tools do not have some event listeners
        const handle = tool[handler];
        if (typeof handle === "function") {
            // TODO: Replace this <any> with something less hacky
            (<any>handle)(event);
        }
    };
}

window.addEventListener("load", updateDimensions);
window.addEventListener("resize", updateDimensions);
// window.addEventListener("beforeunload", (event) => event.preventDefault());
simulationView.addEventListener("click", createHandler("handleClick"));
simulationView.addEventListener("mousemove", createHandler("handleMouseMove"));
simulationView.addEventListener("mousedown", createHandler("handleMouseDown"));
simulationView.addEventListener("mouseup", createHandler("handleMouseUp"));
simulationView.addEventListener(
    "contextmenu",
    createHandler("handleContextMenu"),
);
