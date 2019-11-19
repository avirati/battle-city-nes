export interface ICoordinate {
    x: number;
    y: number;

    changeX: (amount: number) => Coordinate;
    changeY: (amount: number) => Coordinate;
}

export class Coordinate implements ICoordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public changeX = (amount: number) => new Coordinate(this.x + amount, this.y);
    public changeY = (amount: number) => new Coordinate(this.x, this.y + amount);
}
