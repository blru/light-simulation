import "./speed-input.scss";
import * as shortcuts from "src/shortcuts";

export type Options = {
    initialValue: number;
    handleSubmit: (value: number) => void;
};

// TODO: Make this implementation of an input with units only visible when focused more ideal
export function create(options: Options) {
    const speedInput = document.createElement("input");
    speedInput.type = "text";
    speedInput.classList.add("time-controls-speed-input");

    let value = 0;
    const updateValue = (newValue: number) => {
        const isNewValueValid =
            !Number.isNaN(newValue) &&
            Number.isFinite(newValue) &&
            newValue >= 0;

        value = isNewValueValid ? newValue : value;
        speedInput.value = `${value} cm/s`;
    };
    updateValue(options.initialValue); // set value to inital value

    const handleSubmit = () => {
        const newValue = parseFloat(speedInput.value);
        updateValue(newValue);

        options.handleSubmit(value);
    };

    speedInput.addEventListener("focus", () => {
        speedInput.value = value.toString(); // make sure focused text input has actual value
        speedInput.select(); // select text inside for easy replacing
    });
    speedInput.addEventListener("blur", handleSubmit);
    speedInput.addEventListener("keypress", (event) => {
        if (event.key !== "Enter") return;

        speedInput.blur();
        handleSubmit();
    });

    return speedInput;
}
