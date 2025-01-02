import "./overlay.scss";
import appContainer from "./app-container";
import { mainMenuContainer } from "./main-menu";
import { toolbar } from "./toolbar";
import { timeControls } from "./time-controls";

export const overlay = document.createElement("div");
overlay.id = "overlay";
overlay.classList.add("overlay");
appContainer.append(overlay);

export const overlayUpper = document.createElement("div");
overlayUpper.classList.add("upper");
overlay.append(overlayUpper);
overlayUpper.append(mainMenuContainer, toolbar, timeControls);
