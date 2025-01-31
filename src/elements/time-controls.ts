import { simulation } from "./simulation-view.ts";
import { button, speedInput } from "../components/time-controls";
import { TimeFlow } from "../simulation";
import "./time-controls.scss";
import * as shortcuts from "../shortcuts";

export const timeControls = document.createElement("div");
timeControls.id = "time-controls";
timeControls.classList.add("island");

const lightSpeed = speedInput.create({
    initialValue: 1,
    handleSubmit: (value) => {},
});

const backward = button.create({ icon: "fa-backward" });
const forward = button.create({ icon: "fa-forward", isActive: true });

export function handleTimeFlowButtonPress(newTimeFlow: TimeFlow) {
    // If button is pressed again just pause time or else switch to the other time direction
    updateTimeFlow(
        simulation.timeFlow === newTimeFlow ? "paused" : newTimeFlow,
    );
}

export function updateTimeFlow(newTimeFlow: TimeFlow) {
    simulation.timeFlow = newTimeFlow;

    // Set corresponding buttons to active depending on state, buttons are naturally both ianctive in paused state
    button.setIsActive(forward, simulation.timeFlow === "forward");
    button.setIsActive(backward, simulation.timeFlow === "backward");
}

backward.addEventListener("click", () => handleTimeFlowButtonPress("backward"));
forward.addEventListener("click", () => handleTimeFlowButtonPress("forward"));
shortcuts.bind({ code: "Space" }, () =>
    simulation.timeFlow === "paused"
        ? updateTimeFlow("forward")
        : updateTimeFlow("paused"),
); // key binding to toggle time flow direction

timeControls.append(backward, lightSpeed, forward);
