export interface ICoordinate {
    x: number;
    y: number;
}

export class Coordinate implements ICoordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
