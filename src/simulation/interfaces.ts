import { Vector2 } from "./math";

type ComputeScreenCoords = (position: Vector2) => Vector2;

export interface Renderable {
    /**
     * Draws on the provided context.
     * @param ctx - The context to draw on.
     * @param computeScreenCoords - Function which takes in a position and converts it to its location on the canvas.
     */
    render(
        ctx: CanvasRenderingContext2D,
        computeScreenCoords: ComputeScreenCoords,
    ): void;

    /**
     * Returns a boolean determining if at least a portion of the object would be visible on-screen if rendered.
     * @param size - The size of the canvas
     * @param computeScreenCoords - Function which takes in a position and converts it to its location on the canvas.
     */
    isVisible(size: Vector2, computeScreenCoords: ComputeScreenCoords): boolean;
}
