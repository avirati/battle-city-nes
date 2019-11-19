import { CELL_SIZE } from 'global/constants';

import { Coordinate, ICoordinate } from './Coordinate';

export enum CellType {
    EMPTY = 'EMPTY',
    EMPTY_BLACK = 'EMPTY_BLACK',
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
    column: number;
    row: number;

    toString: () => string;
}

export class Cell implements ICell {
    public size: number;
    public position: ICoordinate;
    public type: CellType;
    public column: number;
    public row: number;

    constructor(type: CellType, x: number, y: number, column: number, row: number) {
        this.size = CELL_SIZE;
        this.position = new Coordinate(x, y);
        this.type = type;
        this.column = column;
        this.row = row;
    }

    public toString = () => `[${this.position.x}, ${this.position.y}][${this.column}, ${this.row}][${this.type}]`;
}
