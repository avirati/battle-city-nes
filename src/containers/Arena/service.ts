import {
    ARENA_SIZE,
    BRICK_IMAGE,
    CELL_SIZE,
    EMPTY_BLACK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { Cell, CellType, ICell } from 'models/Cell';
import { Shell } from 'models/Shell';
import { TankDirection } from 'models/Tank';
import { applySelector } from 'state/services';
import { dispatch } from 'state/store';

import { changeCellType } from './state/actions';
import { getArenaMatrix } from './state/selectors';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
const imageMap: Map<string, HTMLImageElement> = new Map();

const setSize = () => {
    const { width, height } = getScreenDimension();
    const size = width > height ? height : width;
    canvas.width = size;
    canvas.height = size;
};

const clearScene = () => {
    context!.clearRect(0, 0, canvas.width, canvas.height);
};

const getCellImage = (cellType: CellType): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    switch (cellType) {
        case CellType.BRICK:
            image.src = BRICK_IMAGE;
            break;
        case CellType.GRASS:
            image.src = GRASS_IMAGE;
            break;
        case CellType.STEEL:
            image.src = STEEL_IMAGE;
            break;
        case CellType.WATER:
            image.src = WATER_IMAGE;
            break;
        case CellType.EAGLE:
            image.src = GRASS_IMAGE;
            break;
        case CellType.EMPTY:
            image.src = EMPTY_IMAGE;
            break;
        case CellType.EMPTY_BLACK:
            image.src = EMPTY_BLACK_IMAGE;
            break;
    }

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});

const renderScene = (matrix: ICell[][]) => {
    const size = matrix.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = matrix[i][j];
            renderCell(cell);
        }
    }
};

const downloadTextures = async (): Promise<void> => {
    const imagePromises = [
        getCellImage(CellType.BRICK),
        getCellImage(CellType.GRASS),
        getCellImage(CellType.STEEL),
        getCellImage(CellType.WATER),
        getCellImage(CellType.EAGLE),
        getCellImage(CellType.EMPTY_BLACK),
    ];
    const [
        brickImage,
        grassImage,
        steelImage,
        waterImage,
        eagleImage,
        emptyImageBlack,
    ] = await Promise.all(imagePromises);
    imageMap.set(CellType.BRICK, brickImage);
    imageMap.set(CellType.GRASS, grassImage);
    imageMap.set(CellType.STEEL, steelImage);
    imageMap.set(CellType.WATER, waterImage);
    imageMap.set(CellType.EAGLE, eagleImage);
    imageMap.set(CellType.EMPTY, emptyImageBlack);
    imageMap.set(CellType.EMPTY_BLACK, emptyImageBlack);
};

const impactedCellsInFront = (shell: Shell) => {
    const topLeft = shell.position;
    const topLeftOfLeft = topLeft.changeX(-shell.size);
    const topRight = topLeft.changeX(shell.size);
    const topRightOfRight = topRight.changeX(shell.size);
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    const cells = [
        topLeftOfLeft,
        topLeft,
        topRight,
        topRightOfRight,
    ];
    cells.map((extremety) => {
        const cellColumn = Math.floor(extremety.x / CELL_SIZE);
        const cellRow = Math.floor(extremety.y / CELL_SIZE);
        if (cellRow - shell.occupiedCells >= 0) {
            const cell = matrix[cellColumn][cellRow - shell.occupiedCells];
            if (cell && shell.willDestroyCell(cell)) {
                dispatch(changeCellType(cell, CellType.EMPTY_BLACK));
            }
        }
    });
};

const impactedCellsInRight = (shell: Shell) => {
    const topRight = shell.position.changeX(shell.size);
    const topRightAbove = topRight.changeY(-shell.size);
    const bottomLeft = topRight.changeY(shell.size);
    const bottomLeftBelow = bottomLeft.changeY(shell.size);
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    [
        topRight,
        topRightAbove,
        bottomLeft,
        bottomLeftBelow,
    ].map((extremety) => {
        const cellColumn = Math.floor(extremety.x / CELL_SIZE);
        const cellRow = Math.floor(extremety.y / CELL_SIZE);
        if (cellColumn + shell.occupiedCells < ARENA_SIZE) {
            const cell = matrix[cellColumn + shell.occupiedCells][cellRow];
            if (cell && shell.willDestroyCell(cell)) {
                dispatch(changeCellType(cell, CellType.EMPTY_BLACK));
            }
        }
    });
};

const impactedCellsInBack = (shell: Shell) => {
    const bottomLeft = shell.position.changeY(shell.size);
    const bottomLeftOfLeft = bottomLeft.changeX(-shell.size);
    const bottomRight = bottomLeft.changeX(shell.size);
    const bottomRightOfRight = bottomRight.changeX(shell.size);
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    [
        bottomLeft,
        bottomLeftOfLeft,
        bottomRight,
        bottomRightOfRight,
    ].map((extremety) => {
        const cellColumn = Math.floor(extremety.x / CELL_SIZE);
        const cellRow = Math.floor(extremety.y / CELL_SIZE);
        if (cellRow + shell.occupiedCells < ARENA_SIZE) {
            const cell = matrix[cellColumn][cellRow + shell.occupiedCells];
            if (cell && shell.willDestroyCell(cell)) {
                dispatch(changeCellType(cell, CellType.EMPTY_BLACK));
            }
        }
    });
};

const impactedCellsInLeft = (shell: Shell) => {
    const topLeft = shell.position;
    const bottomLeft = topLeft.changeY(shell.size);
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    [topLeft, bottomLeft].map((extremety) => {
        const cellColumn = Math.floor(extremety.x / CELL_SIZE);
        const cellRow = Math.floor(extremety.y / CELL_SIZE);
        if (cellColumn - shell.occupiedCells >= 0) {
            const cell = matrix[cellColumn - shell.occupiedCells][cellRow];
            if (cell && shell.willDestroyCell(cell)) {
                dispatch(changeCellType(cell, CellType.EMPTY_BLACK));
            }
        }
    });
};

export const renderCell = (cell: Cell) => {
    context!.drawImage(
        imageMap.get(cell.type)!,
        cell.position.x,
        cell.position.y,
        cell.size,
        cell.size,
    );
}

export const registerCellDestructionFrom = (shell: Shell): void => {
    switch (shell.direction) {
        case TankDirection.FORWARD:
            impactedCellsInFront(shell);
            break;
        case TankDirection.RIGHT:
            impactedCellsInRight(shell);
            break;
        case TankDirection.BACKWARD:
            impactedCellsInBack(shell);
            break;
        case TankDirection.LEFT:
            impactedCellsInLeft(shell);
            break;
    }
};

export const renderMatrix = () => {
    const matrix = applySelector<ICell[][]>(getArenaMatrix);
    renderScene(matrix);
};

export const getSinglePlayerViewCanvas = () => canvas;

export const initSinglePlayerView = () => {
    setSize();
    clearScene();
    downloadTextures()
    .then(() => {
        renderMatrix();
    });
};
