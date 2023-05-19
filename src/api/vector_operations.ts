import { Vector2 } from "../interfaces/basics";

export class Vector {
    // subtracts b from a
    static subtract(a: Vector2, b: Vector2): Vector2 {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
        };
    }

    static add(a: Vector2, b: Vector2): Vector2 {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    }

    static get zero() {
        return { x: 0, y: 0 };
    }

    static divideByScalar(a: Vector2, b: number): Vector2 {
        return {
            x: a.x / b,
            y: a.y / b,
        };
    }
}
