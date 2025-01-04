import { simulation } from "../common";
import { button, speedInput } from "../components/time-controls";
import { TimeFlow } from "../lib/simulation";
import "./time-controls.scss";

export const timeControls = document.createElement("div");
timeControls.id = "time-controls";
timeControls.classList.add("island");

const lightSpeed = speedInput.create({
    initialValue: 1,
    handleSubmit: (value) => {},
});

const backward = button.create({ icon: "fa-backward" });
const forward = button.create({ icon: "fa-forward", isActive: true });

export function handleDirectionButtonClick(newTimeFlow: TimeFlow) {
    // If button is pressed again just pause time or else switch to the other time direction
    simulation.timeFlow =
        simulation.timeFlow === newTimeFlow ? "paused" : newTimeFlow;

    // Set corresponding buttons to active depending on state, buttons are naturally both ianctive in paused state
    button.setIsActive(forward, simulation.timeFlow === "forward");
    button.setIsActive(backward, simulation.timeFlow === "backward");
}

backward.addEventListener("click", () =>
    handleDirectionButtonClick("backward"),
);
forward.addEventListener("click", () => handleDirectionButtonClick("forward"));

timeControls.append(backward, lightSpeed, forward);
