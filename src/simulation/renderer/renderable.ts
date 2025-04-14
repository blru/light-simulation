export interface Renderable {
    /*
     * Called when the renderer wants to render this object to the context.
     */
    render(ctx: CanvasRenderingContext2D): void;

    /*
     * Determines whether the object should be rendered. This is used to save on rendering objects that are not visible.
     *
     * @returns true if the object should be rendered and false otherwise.
     */
    shouldRender(): boolean;
}

export function isRenderable(object: Object): object is Renderable {
    return (
        (<Renderable>object).render != null &&
        (<Renderable>object).shouldRender != null
    );
}
