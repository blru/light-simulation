export type TimeFlow = "backward" | "forward" | "paused";
export type Camera = { x: number; y: number; scale: number };

export class Simulation {
    private readonly ctx: CanvasRenderingContext2D;
    public timeFlow: TimeFlow = "forward";
    public camera: Camera = { x: 0, y: 0, scale: 1 };

    constructor(private readonly canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (context == null)
            throw new Error("Unable to acquire 2d rendering context.");

        this.ctx = context;

        // Begin stepping
        requestAnimationFrame(() => this.step());
    }

    private step() {
        // Inifnite loop
        requestAnimationFrame(() => this.step());
    }
}
