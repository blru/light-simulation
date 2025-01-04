export type TimeFlow = "backward" | "forward" | "paused";

export class Simulation {
    private readonly ctx: CanvasRenderingContext2D;
    public timeFlow: TimeFlow = "forward";

    constructor(private readonly canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (context == null)
            throw new Error("Unable to acquire 2d rendering context.");

        this.ctx = context;

        // Begin stepping
        requestAnimationFrame(this.step);
    }

    private step() {
        // Inifnite loop
        requestAnimationFrame(this.step);
    }
}
