import { CELL_SIZE } from 'global/constants';
import { Coordinate, ICoordinate } from 'models/Coordinate';

export enum CellType {
    EMPTY = 'EMPTY',
    BRICK = 'BRICK',
    GRASS = 'GRASS',
    WATER = 'WATER',
    STEEL = 'STEEL',
    EAGLE = 'EAGLE',
}

export interface ICell {
    size: number;
    position: ICoordinate;
    type: CellType;
}

export class Cell implements ICell {
    public size: number;
    public position: ICoordinate;
    public type: CellType;

    constructor(type: CellType, x: number, y: number) {
        this.size = CELL_SIZE;
        this.position = new Coordinate(x, y);
        this.type = type;
    }
}
