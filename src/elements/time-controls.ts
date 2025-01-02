import { button, speedInput } from "../components/time-controls";
import "./time-controls.scss";

export const timeControls = document.createElement("div");
timeControls.id = "time-controls";
timeControls.classList.add("island");

const lightSpeed = speedInput.create({
    initialValue: 1,
    handleSubmit: (value) => {},
});
const backward = button.create({ icon: "fa-backward", handleClick: () => {} });
const forward = button.create({ icon: "fa-forward", handleClick: () => {} });

timeControls.append(backward, lightSpeed, forward);
