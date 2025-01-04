import { Simulation } from "../simulation";

export class Renderer {
    private readonly ctx: CanvasRenderingContext2D;

    constructor(
        private readonly simulation: Simulation,
        readonly canvas: HTMLCanvasElement,
    ) {
        let context = canvas.getContext("2d");
        if (context == null)
            throw new Error("Cannot acquire 2d rendering context");

        this.ctx = context;
    }

    render() {}
}

export * from "./renderable";
