import { Vector2 } from "./vector-2";
import { expect, it } from "vitest";

it("should return the correct squared magnitude", () => {
    const vector = new Vector2(2, 5);

    expect(vector.magnitudeSquared).toBe(29);
});

it("should return the correct magnitude", () => {
    const vector = new Vector2(3, 4);

    expect(vector.magnitude).toBe(5);
});

it("should check if two vectors are equal", () => {
    const a = new Vector2(128, 256);
    const b = new Vector2(128, 256);

    expect(a.equals(b)).toBe(true);
});

it("should check if two vectors are not equal", () => {
    const a = new Vector2(128, 256);
    const b = new Vector2(256, 128);

    expect(a.equals(b)).toBe(false);
});

it("should return a unit vector of a vector", () => {
    const vector = new Vector2(16, 32);
    const expectedUnitVector = new Vector2(1 / Math.sqrt(5), 2 / Math.sqrt(5));

    expect(vector.normalize().equals(expectedUnitVector)).toBe(true);
});

it("should add two vectors together", () => {
    const a = new Vector2(6, 9);
    const b = new Vector2(4, 20);
    const expectedSum = new Vector2(10, 29);

    expect(a.add(b).equals(expectedSum)).toBe(true);
});

it("should subsctract a vector from another", () => {
    const a = new Vector2(91, 2);
    const b = new Vector2(6, 5);
    const expectedDifference = new Vector2(85, -3);

    expect(a.sub(b).equals(expectedDifference)).toBe(true);
});

it("should multiply a vector by a scalar value", () => {
    const vector = new Vector2(-5, 16);
    const expected = new Vector2(-10, 32);

    expect(vector.multiplyScalar(2).equals(expected)).toBe(true);
});

it("should find the dot product of two vectors", () => {
    const a = new Vector2(9, -13);
    const b = new Vector2(5, 4);

    expect(a.dot(b)).toBe(-7);
});

it("should find the angle between two vectors", () => {
    const a = new Vector2(3, -2);
    const b = new Vector2(1, 12);

    expect(a.angleBetween(b)).toBeCloseTo(2.07565, 4);
});

it("should find the distance between two vectors", () => {
    const a = new Vector2(500, 250);
    const b = new Vector2(-650, 335);

    expect(a.distanceFrom(b)).toBeCloseTo(1153.137, 4);
});
