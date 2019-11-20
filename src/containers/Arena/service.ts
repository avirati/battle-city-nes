import {
    BRICK_IMAGE,
    EMPTY_BLACK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';
import { applySelector } from 'state/services';
import { dispatch } from 'state/store';

import { IArena } from './models/Arena';
import { CellType, ICell } from './models/Cell';
import { loadArenaMap } from './state/actions';
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
            context!.drawImage(
                imageMap.get(cell.type)!,
                cell.position.x,
                cell.position.y,
                cell.size,
                cell.size,
            );
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

const addDragNDropListeners = () => {

    const FileSelectHandler = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const file: File = event.dataTransfer!.files[0];

        if (file.type !== 'application/json') {
            return;
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const serialisedGameData = event.target!.result;
            try {
                const parsedGameData: ICell[][] = JSON.parse(serialisedGameData as string);
                dispatch(loadArenaMap(parsedGameData));
            } catch (error) {
                console.error('Invalid Game Data', error);
            }
        };
        // Read in the image file as a data URL.
        reader.readAsText(file);
    };

    const FileDragHover = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };

    canvas.addEventListener('dragover', FileDragHover, false);
    canvas.addEventListener('dragleave', FileDragHover, false);
    canvas.addEventListener('drop', FileSelectHandler, false);
};

export const renderMatrix = () => {
    const matrix = applySelector<ICell[][], IArena>(getArenaMatrix);
    renderScene(matrix);
};

export const getSinglePlayerViewCanvas = () => canvas;
export const getSinglePlayerViewContext = () => context;

export const initSinglePlayerView = () => {
    setSize();
    clearScene();
    addDragNDropListeners();
    downloadTextures()
    .then(() => {
        renderMatrix();
    });
};
