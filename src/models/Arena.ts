import {
    ARENA_SIZE,
    CELL_SIZE,
} from 'global/constants';

import {
    Cell,
    CellType,
    ICell,
} from './Cell';

export interface IArena {
    matrix: ICell[][];
    size: number;
}

export class Arena implements IArena {
    public matrix: ICell[][];
    public size: number;

    constructor() {
        this.matrix = [];
        this.size = ARENA_SIZE;
        this.fillWithEmptyCells();
    }

    private fillWithEmptyCells = () => {
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.matrix[i][j] = new Cell(CellType.EMPTY, i * CELL_SIZE, j * CELL_SIZE);
            }
        }
    }
}
