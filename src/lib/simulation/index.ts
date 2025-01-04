import { Renderer } from "../renderer";

export type TimeFlow = "backward" | "forward" | "paused";

export class Simulation {
    private readonly renderer: Renderer;
    public timeFlow: TimeFlow = "forward";

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(this, this.canvas);
    }

    step() {}
}
