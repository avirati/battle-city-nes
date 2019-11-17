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
                break;
            case TankDirection.RIGHT:
                this.impactedCellsInRight(shell);
                break;
            case TankDirection.BACKWARD:
                this.impactedCellsInBack(shell);
                break;
            case TankDirection.LEFT:
                this.impactedCellsInLeft(shell);
                break;
        }
    }

    private impactedCellsInFront = (shell: Shell) => {
        const topLeft = shell.position;
        const topRight = shell.position.changeX(shell.size);
        [topLeft, topRight].map((extremety) => {
            const cellColumn = Math.floor(extremety.x / CELL_SIZE);
            const cellRow = Math.floor(extremety.y / CELL_SIZE);
            if (cellRow - shell.occupiedCells >= 0) {
                const cell = this.matrix[cellColumn][cellRow - shell.occupiedCells];
                if (cell && shell.willDestroyCell(cell)) {
                    cell.type = CellType.EMPTY_BLACK;
                }
            }
        });
    }

    private impactedCellsInRight = (shell: Shell) => {
        const topRight = shell.position.changeX(shell.size);
        const bottomLeft = topRight.changeY(shell.size);
        [topRight, bottomLeft].map((extremety) => {
            const cellColumn = Math.floor(extremety.x / CELL_SIZE);
            const cellRow = Math.floor(extremety.y / CELL_SIZE);
            if (cellColumn + shell.occupiedCells < this.size) {
                const cell = this.matrix[cellColumn + shell.occupiedCells][cellRow];
                if (cell && shell.willDestroyCell(cell)) {
                    cell.type = CellType.EMPTY_BLACK;
                }
            }
        });
    }

    private impactedCellsInBack = (shell: Shell) => {
        const bottomLeft = shell.position.changeY(shell.size);
        const bottomRight = bottomLeft.changeX(shell.size);
        [bottomLeft, bottomRight].map((extremety) => {
            const cellColumn = Math.floor(extremety.x / CELL_SIZE);
            const cellRow = Math.floor(extremety.y / CELL_SIZE);
            if (cellRow + shell.occupiedCells < this.size) {
                const cell = this.matrix[cellColumn][cellRow + shell.occupiedCells];
                if (cell && shell.willDestroyCell(cell)) {
                    cell.type = CellType.EMPTY_BLACK;
                }
            }
        });
    }

    private impactedCellsInLeft = (shell: Shell) => {
        const topLeft = shell.position;
        const bottomLeft = topLeft.changeY(shell.size);
        [topLeft, bottomLeft].map((extremety) => {
            const cellColumn = Math.floor(extremety.x / CELL_SIZE);
            const cellRow = Math.floor(extremety.y / CELL_SIZE);
            if (cellColumn - shell.occupiedCells >= 0) {
                const cell = this.matrix[cellColumn - shell.occupiedCells][cellRow];
                if (cell && shell.willDestroyCell(cell)) {
                    cell.type = CellType.EMPTY_BLACK;
                }
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
