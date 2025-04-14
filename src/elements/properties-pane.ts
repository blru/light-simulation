import { Property as PropertyComponent } from "src/components/properties-pane/property";
import { overlayUpper } from "./overlay";
import "./properties-pane.scss";
import { HasProperties } from "./properties-pane/has-properties";
import { Property } from "./properties-pane/properties";
import { SubProperties as SubPropertiesComponent } from "src/components/properties-pane/sub-properties";
import { Simulation } from "src/simulation";
import { SimulationObject } from "src/simulation/simulation-object";
import { LightSource } from "src/simulation/objects/light-source";
import { OpticalMedium } from "src/simulation/objects/optical-medium";

export const propertiesPane = document.createElement("div");
propertiesPane.id = "properties-pane";
propertiesPane.classList.add("island");
overlayUpper.appendChild(propertiesPane);

// Title section
const titleContainer = document.createElement("div");
titleContainer.classList.add("title-container");
propertiesPane.append(titleContainer);

const icon = document.createElement("i");
icon.classList.add("fa-solid", "fa-list");
titleContainer.appendChild(icon);

const title = document.createElement("span");
title.classList.add("tite");
title.innerText = "Properties";
titleContainer.append(title);

// Separator
const separator = document.createElement("hr");
propertiesPane.append(separator);

// Properties container
const propertiesContainer = document.createElement("div");
propertiesContainer.classList.add("property-container");
propertiesPane.append(propertiesContainer);

export function show(object: HasProperties) {
    propertiesPane.classList.add("visible");

    // Creating the elements
    const createPropertyElements = (properties: Property[]) => {
        const elements: HTMLDivElement[] = [];

        for (const property of properties) {
            let element: HTMLDivElement;

            // This is special as it is a property group rather than an individual property
            if (property.kind === "sub_property") {
                const properties = property.getProperties();

                if (properties.length === 0) continue;

                element = SubPropertiesComponent.create({
                    label: property.label,
                    propertyElements: createPropertyElements(properties),
                });
            } else {
                element = PropertyComponent.create({
                    property,
                    handleSubmit: () => handlePropertyUpdate(object),
                });
            }

            elements.push(element);
        }

        return elements;
    };

    propertiesContainer.replaceChildren(
        ...createPropertyElements(object.getProperties()),
    );
}

export function hide() {
    propertiesPane.classList.remove("visible");
}

// I hate this specific function.. Why is it in THIS file?!
export function handlePropertyUpdate(object: HasProperties) {
    // Show or update properties pane
    PropertiesPane.show(object);

    // If the object is a light source, recompute its rays
    if (object instanceof LightSource) {
        object.recomputeRays();
    }

    // If the object is a medium, recompute all the light sources
    if (object instanceof OpticalMedium) {
        Simulation.recomputeLightRays();
    }
}

export const PropertiesPane = { show, hide, handlePropertyUpdate } as const;
