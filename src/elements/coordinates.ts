import { Vector2 } from "src/simulation/math/vector-2";
import "./coordinates.scss";
import { toastOverlay } from "./overlay";

const HIDDEN_ATTRIBUTE = "data-hidden";

export const coordinates = document.createElement("span");
coordinates.id = "coordinates";
toastOverlay.append(coordinates);

let hideTimeout: number;

export function hide() {
    coordinates.setAttribute(HIDDEN_ATTRIBUTE, "true");
}

export function show(position: Vector2) {
    if (hideTimeout != null) {
        clearTimeout(hideTimeout); // if show coordinates is called, hold off on hiding the coordinates
    }

    coordinates.setAttribute(HIDDEN_ATTRIBUTE, "false");
    hideTimeout = setTimeout(hide, 1000);

    coordinates.innerText = `Camera Pos: (${position.x}, ${position.y})`;
}

hide(); // Coordinates are hidden by default

export const Coordinates = { show, hide } as const;
