import { Property } from "./properties";

export interface HasProperties {
    getProperties(): Property[];
}

export function hasProperties(object: any) {
    return (<HasProperties>object).getProperties != null;
}
