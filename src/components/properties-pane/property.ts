import { ValueProperty } from "src/elements/properties-pane/properties";
import "./property.scss";
import { select } from "src/elements/toolbar";

export function create({
    property,
    handleSubmit,
}: {
    property: ValueProperty;
    handleSubmit: () => void;
}) {
    const propertyElement = document.createElement("div");
    propertyElement.classList.add("property");

    const label = document.createElement("span");
    label.classList.add("label");
    label.innerText = property.label;
    propertyElement.append(label);

    // Utility function to create the input
    const appendInput = (
        value: string,
        onSubmit: (value: string) => void,
        type: string = "text",
    ) => {
        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.addEventListener("focus", () => {
            input.select();
        });
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                input.blur();
            }
        });
        input.addEventListener("change", () => {
            onSubmit(input.value);
            handleSubmit();
        });
        propertyElement.append(input);

        return input;
    };

    switch (property.kind) {
        case "number": {
            appendInput(property.get().toFixed(2), (newValue) => {
                const parsedNumber = parseFloat(newValue);

                if (!Number.isNaN(parsedNumber)) {
                    property.set(parsedNumber);
                }
            });

            break;
        }
        case "string_list": {
            const selectElement = document.createElement("select");
            selectElement.addEventListener("change", () => {
                property.set(selectElement.value);
                handleSubmit();
            });

            property.choices.forEach((choice, index) => {
                const optionElement = document.createElement("option");
                optionElement.value = choice;
                optionElement.innerText = choice;
                selectElement.append(optionElement);

                // If the current added choice is the selected one, select it
                if (choice === property.get()) {
                    selectElement.selectedIndex = index;
                }
            });

            propertyElement.append(selectElement);
        }
    }

    return propertyElement;
}

export const Property = { create } as const;
