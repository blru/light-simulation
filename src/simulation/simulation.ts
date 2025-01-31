import { Vector2 } from "./math";

export type Camera = { position: Vector2; scale: number };
export type TimeFlow = "backward" | "forward" | "paused";

export class Simulation {
    private readonly ctx: CanvasRenderingContext2D;
    public camera: Camera = { position: new Vector2(), scale: 1 };
    public timeFlow: TimeFlow = "forward";

    constructor(private readonly canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (context == null)
            throw new Error("Unable to acquire 2d rendering context.");

        this.ctx = context;

        // Begin the loop to step the simulation forward
        this.beginLoop();
    }

    private beginLoop() {
        let previousTime = 0;

        const loop = (currentTime: number) => {
            const deltaTime = currentTime - previousTime;
            previousTime = currentTime;

            // If it is paused, we do not step the simulation forward
            if (this.timeFlow !== "paused") {
                this.step(this.timeFlow === "forward" ? deltaTime : -deltaTime);
            }

            this.render();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    /**
     * Steps the simulation logic
     *
     * @param deltaTime - The time since the last frame in milliseconds, a negative value advances the simulation backwards
     */
    step(deltaTime: number) {
        console.log(deltaTime);
    }

    /**
     * Internal method to draw the simulation state.
     */
    private render() {}

    /**
     * Computes the path of light given an initial position for the ray and its direction
     */
    computeLightPath(origin: Vector2, direction: Vector2) {
        throw new Error("Not implemented");
    }
}
