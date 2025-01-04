import { simulationView } from "./elements/simulation-view";
import { Simulation } from "./lib/simulation";

// Initialize a new simulation and bind it to the simulation view canvas
export const simulation = new Simulation(simulationView);
