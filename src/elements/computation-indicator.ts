import "./computation-indicator.scss";
import { toastOverlay } from "./overlay";

const HIDDEN_ATTRIBUTE = "data-hidden";

export const computationIndicator = document.createElement("div");
computationIndicator.id = "computation-indicator";
toastOverlay.append(computationIndicator);

const loadingIcon = document.createElement("i");
loadingIcon.classList.add("fa-solid", "fa-circle-notch", "fa-spin");
computationIndicator.append(loadingIcon);

const loadingText = document.createElement("span");
loadingText.innerText = "Computing light path...";
computationIndicator.append(loadingText);

let hideTimeout: number;

export function hide() {
    computationIndicator.setAttribute(HIDDEN_ATTRIBUTE, "true");
}

export function show() {
    if (hideTimeout != null) {
        clearTimeout(hideTimeout);
    }

    hideTimeout = setTimeout(hide, 200);

    computationIndicator.setAttribute(HIDDEN_ATTRIBUTE, "false");
}

hide(); // Coordinates are hidden by default

export const ComputationIndicator = { show, hide } as const;

// TODO: Make this entire thing DRY with `coordinates` element
