import { Vector2 } from "./math/vector-2";
import { Preferences } from "./preferences";
import { Toolbar } from "src/elements/toolbar";
import { Renderable } from "./renderer/renderable";

export type Camera = { position: Vector2 };

let ctx: CanvasRenderingContext2D | null = null;
export const camera: Camera = { position: new Vector2() };

/** Renders passed objects */
export function render(renderables: Iterable<Renderable>) {
    // Before doing any rendering make sure there is a context set
    if (ctx == null) return;

    const { grid, colors } = Preferences;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Grid is drawn first so that everything else is drawn on top of it
    renderGrid(
        ctx,
        grid.subSpacingX,
        grid.subSpacingY,
        colors.gridSub ?? "",
        1,
    ); // Sub grid
    renderGrid(ctx, grid.spacingX, grid.spacingY, colors.grid ?? "", 2); // Primary grid

    // TODO: Render the optical media on top of the light rays
    for (const object of renderables) {
        if (object.shouldRender()) {
            object.render(ctx);
        }
    }

    Toolbar.getCurrentTool().descriptor.render?.(ctx);
}

/** Internal function to draw a grid */
function renderGrid(
    ctx: CanvasRenderingContext2D,
    spacingX: number,
    spacingY: number,
    color: string,
    lineWidth: number,
) {
    const renderGridLine = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const xOffset = camera.position.x % spacingX;
    for (let x = xOffset; x < ctx.canvas.width; x += spacingX) {
        renderGridLine(x, 0, x, ctx.canvas.height);
    }

    const yOffset = camera.position.y % spacingY;
    for (let y = yOffset; y < ctx.canvas.height; y += spacingY) {
        renderGridLine(0, y, ctx.canvas.width, y);
    }
}

/**
 * Computes the position given canvas coordinates
 */
export function toWorld(x: number, y: number) {
    return new Vector2(x, y).sub(camera.position);
}

/**
 * Computes the canvas coordiantes given a position in the simulation
 */
export function fromWorld(position: Vector2) {
    return position.clone().add(camera.position);
}

/** Sets the renderer's context */
export function setContext(newContext: CanvasRenderingContext2D) {
    ctx = newContext;
}

/** Gets the renderer's context */
export function getContext() {
    return ctx;
}

export const Renderer = {
    camera,
    render,
    toWorld,
    fromWorld,
    getContext,
    setContext,
} as const;
