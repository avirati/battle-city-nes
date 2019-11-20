import {
    Cell,
    CellType,
    ICell,
} from 'models/Cell';

const CELL_PROPERTY_SEPARATOR = '|';
const COLUMN_SEPARATOR = '#';
const ROW_SEPARATOR = '$';

export const serialiseMatrix = (matrix: ICell[][]): string =>
    matrix.map(
        (rows) => rows.map(
            (cell) =>   cell.type + CELL_PROPERTY_SEPARATOR +
                        cell.position.x + CELL_PROPERTY_SEPARATOR +
                        cell.position.y,
        ).join(COLUMN_SEPARATOR),
    ).join(ROW_SEPARATOR);

export const parseSerialisedMatrix = (data: string): ICell[][] =>
    data
    .split(ROW_SEPARATOR)
    .map((rows, rowIndex) =>
        rows
        .split(COLUMN_SEPARATOR)
        .map((cell, columnIndex) => {
            const parts = cell.split(CELL_PROPERTY_SEPARATOR);
            return new Cell(parts[0] as CellType, Number(parts[1]), Number(parts[2]), columnIndex, rowIndex);
        }),
    );
