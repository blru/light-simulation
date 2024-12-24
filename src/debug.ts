import { togglePreference } from "./theming";

const LightSimulation: any = {};

// @ts-ignore
window.LightSimulation = LightSimulation;

LightSimulation.toggleTheme = () => togglePreference();
