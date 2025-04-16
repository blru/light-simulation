import { HasProperties } from "src/elements/properties-pane/has-properties";
import { EPSILON } from "./constants";
import { Property } from "src/elements/properties-pane/properties";

export class Vector2 implements HasProperties {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}

    static get zero() {
        return new Vector2(0, 0);
    }

    static get unit() {
        return new Vector2(1, 1);
    }

    static fromDirectionalMagnitude(magnitude: number, angle: number) {
        return new Vector2(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude,
        );
    }

    /**
     * Makes this vector a unit vector.
     *
     * @returns the vector affected
     */
    normalize() {
        const magnitude = this.magnitude;

        this.x /= magnitude;
        this.y /= magnitude;

        return this;
    }

    /**
     * Adds another vector to this vector
     *
     * @returns the vector affected
     */
    add(rhs: Vector2) {
        this.x += rhs.x;
        this.y += rhs.y;

        return this;
    }

    /**
     * Subtracts a vector from this vector
     *
     * @returns the vector affected
     */
    sub(rhs: Vector2) {
        this.x -= rhs.x;
        this.y -= rhs.y;

        return this;
    }

    /**
     * Multiplies the components of this vector by a scalar value
     *
     * @returns the vector affected
     */
    multiplyScalar(rhs: number) {
        this.x *= rhs;
        this.y *= rhs;

        return this;
    }

    /**
     * Returns the dot product of this vector and another
     */
    dot(rhs: Vector2) {
        return this.x * rhs.x + this.y * rhs.y;
    }

    /**
     * Returns the angle (in radians) betewen this vector and another
     */
    angleBetween(other: Vector2) {
        // Since the product of 2 square roots is the same as the square root of the product of their radicands,
        // we only need to do one square root instead of two
        const magnitudeProduct = Math.sqrt(
            this.magnitudeSquared * other.magnitudeSquared,
        );

        return Math.acos(this.dot(other) / magnitudeProduct);
    }

    /**
     * Rotates this vector counter clockwise by the specific number of radians
     *
     * @param beta - Angle in radians to rotate by
     */
    rotateBy(beta: number) {
        // PERF: Maybe there is an optimization here?
        const alpha = this.angle;
        const magnitude = this.magnitude;

        this.x = magnitude * Math.cos(alpha + beta);
        this.y = magnitude * Math.sin(alpha + beta);

        return this;
    }

    /**
     * Aligns this vector with another vector
     */
    alignWith(other: Vector2) {
        if (this.dot(other) < 0) this.multiplyScalar(-1);

        return this;
    }

    /**
     * Aligns this vector opposite of another vector
     */
    alignOppositeWith(other: Vector2) {
        if (this.dot(other) < 0) return this;

        return this.multiplyScalar(-1);
    }

    /**
     * Reflects this light ray along a normal
     */
    reflect(normal: Vector2) {
        // Source: https://en.wikipedia.org/wiki/Snell%27s_law
        this.sub(normal.clone().multiplyScalar(2 * normal.dot(this)));

        return this;
    }

    /**
     * Returns the distance squared between this vector and another
     */
    distanceSquaredFrom(other: Vector2) {
        // Clone to avoid modifying the original vector
        return this.clone().sub(other).magnitudeSquared;
    }

    /**
     * Returns the distance between this vector and another
     */
    distanceFrom(other: Vector2) {
        // Clone to avoid modifying the original vector
        return this.clone().sub(other).magnitude;
    }

    /**
     * Returns true if the other vector is equal to this vector
     */
    equals(other: Vector2) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Returns true if the other vector is approximately equal to this vector
     *
     * @param epsilon - The maximum difference allowed between each component of the vectors for them to be considered equal
     */
    approximatelyEquals(other: Vector2, epsilon: number = EPSILON) {
        const deltaX = Math.abs(this.x - other.x);
        const deltaY = Math.abs(this.y - other.y);

        return deltaX <= epsilon && deltaY <= epsilon;
    }

    /**
     * Returns a new vector with the exact same components as this one
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    get magnitudeSquared() {
        return this.x ** 2 + this.y ** 2;
    }

    get magnitude() {
        return Math.sqrt(this.magnitudeSquared);
    }

    /**
     * Returns this vector's angle in radians from the x-axis in the counter clockwise direction between -pi/2 to pi/2 rad
     */
    get angle() {
        return Math.atan2(this.y, this.x);
    }

    getProperties(): Property[] {
        return [
            {
                label: "X",
                kind: "number",
                get: () => {
                    return this.x;
                },
                set: (newValue) => {
                    this.x = newValue;
                },
            },
            {
                label: "Y",
                kind: "number",
                get: () => {
                    return this.y;
                },
                set: (newValue) => {
                    this.y = newValue;
                },
            },
        ];
    }
}
