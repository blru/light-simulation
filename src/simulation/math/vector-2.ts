export class Vector2 {
    constructor(
        public x: number,
        public y: number,
    ) {}

    /**
     * Returns a new vector that is the sum of this vector and another
     */
    add(rhs: Vector2) {
        return new Vector2(this.x + rhs.x, this.y + rhs.y);
    }

    /**
     * Returns a new vector that is the difference between this vector and another
     */
    sub(rhs: Vector2) {
        return new Vector2(this.x - rhs.x, this.y - rhs.y);
    }

    /**
     * Returns a new vector that is the scalar product of this vector and a scalar value
     */
    multiplyScalar(rhs: number) {
        return new Vector2(this.x * rhs, this.y * rhs);
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
        return Math.acos(this.dot(other) / (this.magnitude * other.magnitude));
    }

    /**
     * Returns the distance between this vector and another
     */
    distanceFrom(other: Vector2) {
        return this.sub(other).magnitude;
    }

    get magnitudeSquared() {
        return this.x ** 2 + this.y ** 2;
    }

    get magnitude(): number {
        return Math.sqrt(this.magnitude);
    }
}
