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

import { changeCellType, setBrush } from './state/actions';
import { getActiveBrushSelector, getArenaMatrixSelector } from './state/selectors';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
const menuContainer: HTMLElement | null = document.getElementById('menu');
const imageMap: Map<string, HTMLImageElement> = new Map();
let mouseMoving = false;

const setSize = () => {
    const { width, height } = getScreenDimension();
    const size = width > height ? height : width;
    canvas.width = size;
    canvas.height = size;
};

const clearScene = () => {
    context!.clearRect(0, 0, canvas.width, canvas.height);
};

const getCellImage = (cellType: CellType): string => {
    switch (cellType) {
        case CellType.BRICK:
            return BRICK_IMAGE;
        case CellType.GRASS:
            return GRASS_IMAGE;
        case CellType.STEEL:
            return STEEL_IMAGE;
        case CellType.WATER:
            return WATER_IMAGE;
        case CellType.EAGLE:
            return GRASS_IMAGE;
        case CellType.EMPTY:
            return EMPTY_IMAGE;
        case CellType.EMPTY_BLACK:
            return EMPTY_BLACK_IMAGE;
    }
};

const fetchCellImage = (cellType: CellType): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();

    image.src = getCellImage(cellType);

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
        fetchCellImage(CellType.BRICK),
        fetchCellImage(CellType.GRASS),
        fetchCellImage(CellType.STEEL),
        fetchCellImage(CellType.WATER),
        fetchCellImage(CellType.EAGLE),
        fetchCellImage(CellType.EMPTY),
        fetchCellImage(CellType.EMPTY_BLACK),
    ];
    const [
        brickImage,
        grassImage,
        steelImage,
        waterImage,
        eagleImage,
        emptyImage,
        emptyImageBlack,
    ] = await Promise.all(imagePromises);
    imageMap.set(CellType.BRICK, brickImage);
    imageMap.set(CellType.GRASS, grassImage);
    imageMap.set(CellType.STEEL, steelImage);
    imageMap.set(CellType.WATER, waterImage);
    imageMap.set(CellType.EAGLE, eagleImage);
    imageMap.set(CellType.EMPTY, emptyImage);
    imageMap.set(CellType.EMPTY_BLACK, emptyImageBlack);
};

const impactedCellsInFront = (shell: Shell) => {
    const topLeft = shell.position;
    const topLeftOfLeft = topLeft.changeX(-shell.size);
    const topRight = topLeft.changeX(shell.size);
    const topRightOfRight = topRight.changeX(shell.size);
    const matrix = applySelector(getArenaMatrixSelector);
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
    const matrix = applySelector(getArenaMatrixSelector);
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
    const matrix = applySelector(getArenaMatrixSelector);
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
    const matrix = applySelector(getArenaMatrixSelector);
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
};

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
    const matrix = applySelector(getArenaMatrixSelector);
    renderScene(matrix);
};

export const getArenaCanvas = () => canvas;

export const initArenaView = () => {
    setSize();
    clearScene();
    return downloadTextures()
    .then(() => {
        renderMatrix();
    });
};

const onBrushSelected = (event: MouseEvent) => {
    const img = event.target! as HTMLImageElement;
    const cellType: CellType = img.getAttribute('data-cell-type') as CellType;
    dispatch(setBrush(cellType));
    menuContainer!.style.display = 'none';
};

const setupMenu = () => {
    [
        CellType.BRICK,
        CellType.GRASS,
        CellType.STEEL,
        CellType.WATER,
        CellType.EMPTY,
    ].forEach((cellType) => {
        const img = document.createElement('img');
        img.setAttribute('data-cell-type', cellType);
        img.src = getCellImage(cellType);
        img.addEventListener('click', onBrushSelected);
        menuContainer!.appendChild(img);
    });

    canvas.addEventListener('contextmenu', (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        menuContainer!.style.display = 'flex';
        menuContainer!.style.left = event.clientX + 'px';
        menuContainer!.style.top = event.clientY + 'px';
        mouseMoving = false;
    });

    canvas.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        menuContainer!.style.display = 'none';
    });
};

const prepareLevelDesigner = () => {
    const matrix = applySelector(getArenaMatrixSelector);
    canvas.addEventListener('mousedown', () => mouseMoving = true);
    canvas.addEventListener('mouseup', () => mouseMoving = false);
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
        if (!mouseMoving) {
            return;
        }
        const x = event.offsetX;
        const y = event.offsetY;

        const cellColumn = Math.floor(x / CELL_SIZE);
        const cellRow = Math.floor(y / CELL_SIZE);

        const cell = matrix[cellColumn][cellRow];
        const activeBrush = applySelector(getActiveBrushSelector);
        context!.drawImage(
            imageMap.get(activeBrush)!,
            cell.position.x,
            cell.position.y,
            cell.size,
            cell.size,
        );
    });
}

export const initLevelDesigner = () => {
    initArenaView()
    .then(() => {
        setupMenu();
        prepareLevelDesigner();
    });
};
