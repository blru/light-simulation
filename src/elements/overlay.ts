import "./overlay.scss";
import appContainer from "./app-container";

export const overlay = document.createElement("div");
overlay.id = "overlay";
overlay.classList.add("overlay");
appContainer.append(overlay);

export const overlayUpper = document.createElement("div");
overlayUpper.classList.add("upper");
overlay.append(overlayUpper);
