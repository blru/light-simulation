export interface Steppable {
    step(deltaTime: number): void;
}

export function isSteppable(object: Object): object is Steppable {
    return (<Steppable>object).step != null;
}
