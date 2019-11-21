import {
    Cell,
    CellType,
    ICell,
} from 'models/Cell';

const CELL_PROPERTY_SEPARATOR = '|';
const CELL_SEPARATOR = '#';
const ROW_SEPARATOR = '$';

const cellTypeIDVsValueMap: any = {
    1: CellType.EMPTY,
    2: CellType.BRICK,
    3: CellType.GRASS,
    4: CellType.WATER,
    5: CellType.STEEL,
};

const cellTypeValueVsIDMap: any = {
    [CellType.EMPTY]: '1',
    [CellType.BRICK]: '2',
    [CellType.GRASS]: '3',
    [CellType.WATER]: '4',
    [CellType.STEEL]: '5',
};

export const serialiseMatrix = (matrix: ICell[][]): string =>
    matrix.map(
        (rows) => rows.map(
            (cell) =>   cellTypeValueVsIDMap[cell.type] + CELL_PROPERTY_SEPARATOR +
                        cell.position.x + CELL_PROPERTY_SEPARATOR +
                        cell.position.y,
        ).join(CELL_SEPARATOR),
    ).join(ROW_SEPARATOR);

export const parseSerialisedMatrix = (data: string): ICell[][] =>
    data
    .split(ROW_SEPARATOR)
    .map((rows, rowIndex) =>
        rows
        .split(CELL_SEPARATOR)
        .map((cell, columnIndex) => {
            const parts = cell.split(CELL_PROPERTY_SEPARATOR);
            return new Cell(cellTypeIDVsValueMap[parts[0] as CellType], Number(parts[1]), Number(parts[2]), rowIndex, columnIndex);
        }),
    );
