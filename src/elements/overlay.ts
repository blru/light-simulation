import "./overlay.scss";
import appContainer from "./app-container";

export const overlay = document.createElement("div");
overlay.id = "overlay";
overlay.classList.add("overlay");
appContainer.append(overlay);

export const overlayUpper = document.createElement("div");
overlayUpper.classList.add("upper");
overlay.append(overlayUpper);

export const header = document.createElement("div");
header.classList.add("header");
overlayUpper.append(header);

export const toastOverlay = document.createElement("div");
toastOverlay.classList.add("toast");
overlay.append(toastOverlay);
