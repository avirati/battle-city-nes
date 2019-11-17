import {
    ARENA_SIZE,
    CELL_SIZE,
} from 'global/constants';

import {
    Cell,
    CellType,
    ICell,
} from './Cell';
import { Shell } from './Shell';
import { TankDirection } from './Tank';

export interface IArena {
    matrix: ICell[][];
    size: number;

    exportArenaData: () => ICell[][];
    importArenaData: (matrix: ICell[][]) => void;
    registerCellDestructionFrom: (shell: Shell) => void;
}

export class Arena implements IArena {
    public matrix: ICell[][];
    public size: number;

    constructor() {
        this.matrix = [];
        this.size = ARENA_SIZE;
        this.fillWithEmptyCells();
    }

    public exportArenaData = (): ICell[][] => this.matrix;
    public importArenaData = (matrix: ICell[][]) => this.matrix = matrix;

    public registerCellDestructionFrom = (shell: Shell): void => {
        switch (shell.direction) {
            case TankDirection.FORWARD:
                this.impactedCellsInFront(shell);
        }
    }

    private impactedCellsInFront = (shell: Shell) => {
        const topLeft = shell.position;
        const topRight = shell.position.changeX(shell.size);
        [topLeft, topRight].map((extremety) => {
            const cellColumn = Math.floor(extremety.x / CELL_SIZE);
            const cellRow = Math.floor(extremety.y / CELL_SIZE);
            const cell = this.matrix[cellColumn][cellRow - shell.occupiedCells];
            if (shell.willDestroyCell(cell)) {
                cell.type = CellType.EMPTY_BLACK;
            }
        });
    }

    private fillWithEmptyCells = () => {
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.matrix[i][j] = new Cell(CellType.EMPTY, i * CELL_SIZE, j * CELL_SIZE, i, j);
            }
        }
    }
}
