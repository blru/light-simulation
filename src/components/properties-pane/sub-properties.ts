import "./sub-properties.scss";

export type Options = {
    label: string;
    propertyElements: HTMLDivElement[];
};

export function create(options: Options) {
    const propertyGroup = document.createElement("div");
    propertyGroup.classList.add("sub-properties");

    const label = document.createElement("span");
    label.classList.add("label");
    label.innerText = options.label;
    propertyGroup.append(label);

    const subPropertiesContainer = document.createElement("div");
    subPropertiesContainer.classList.add("property-container");
    subPropertiesContainer.append(...options.propertyElements);
    propertyGroup.append(subPropertiesContainer);

    return propertyGroup;
}

export function getSubPropertiesContainer(
    propertyGroup: ReturnType<typeof create>,
): HTMLDivElement {
    return propertyGroup.getElementsByTagName("div").item(0)!;
}

export const SubProperties = { create, getSubPropertiesContainer } as const;
