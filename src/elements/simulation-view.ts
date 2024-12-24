import "./simulation-view.scss";
import appContainer from "./app-container";

const simulationView = document.createElement("canvas");
simulationView.id = "simulation-view";
appContainer.appendChild(simulationView);

function updateDimensions() {
    simulationView.width = window.innerWidth;
    simulationView.height = window.innerHeight;
}

window.addEventListener("load", updateDimensions);
window.addEventListener("resize", updateDimensions);
