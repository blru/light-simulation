import { button, speedInput } from "../components/time-controls";
import "./time-controls.scss";

export type TimeFlow = "backward" | "forward" | "paused";

export const timeControls = document.createElement("div");
timeControls.id = "time-controls";
timeControls.classList.add("island");

const lightSpeed = speedInput.create({
    initialValue: 1,
    handleSubmit: (value) => {},
});

// TODO: Use the direction type used by the simulation once it's created
let timeFlow: TimeFlow = "forward";

const backward = button.create({ icon: "fa-backward" });
const forward = button.create({ icon: "fa-forward", isActive: true });

export function handleDirectionButtonClick(newTimeFlow: TimeFlow) {
    // If button is pressed again just pause time or else switch to the other time direction
    timeFlow = timeFlow === newTimeFlow ? "paused" : newTimeFlow;

    // Set corresponding buttons to active depending on state, buttons are naturally both ianctive in paused state
    button.setIsActive(forward, timeFlow === "forward");
    button.setIsActive(backward, timeFlow === "backward");
}

backward.addEventListener("click", () =>
    handleDirectionButtonClick("backward"),
);
forward.addEventListener("click", () => handleDirectionButtonClick("forward"));

timeControls.append(backward, lightSpeed, forward);
