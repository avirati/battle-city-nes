import {
    CellType,
    ICell,
} from './Cell';

export interface IArena {
    matrix: ICell[][];
    size: number;
    meta: {
        activeBrush: CellType
    };
}
