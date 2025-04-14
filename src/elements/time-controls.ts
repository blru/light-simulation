import { button, speedInput } from "src/components/time-controls";
import "./time-controls.scss";
import * as shortcuts from "../shortcuts";
import { header } from "./overlay";
import { Simulation } from "src/simulation";
import { Preferences } from "src/simulation/preferences";

export const timeControls = document.createElement("div");
timeControls.id = "time-controls";
timeControls.classList.add("island");
header.append(timeControls);

const lightSpeed = speedInput.create({
    initialValue: Preferences.parameters.lightSpeed,
    handleSubmit: (value) => {
        Preferences.parameters.lightSpeed = value;
    },
});

const toggleRunning = button.create({ icon: "fa-forward", isActive: true });

function toggleIsRunning() {
    const isNowRunning = !Simulation.getIsRunning();
    Simulation.setIsRunning(isNowRunning);

    button.setIsActive(toggleRunning, isNowRunning);
}

toggleRunning.addEventListener("click", toggleIsRunning);
shortcuts.bind({ code: "Space" }, () => {
    toggleIsRunning();

    // HACK: Prevent pressing space again from pressing the button instead of triggering this shortcut
    toggleRunning.blur();
}); // key binding to toggle time flow direction

shortcuts.bind({ code: "F1" }, () => {
    Simulation.step();
}); // key binding to toggle time flow direction

timeControls.append(lightSpeed, toggleRunning);
