import { getScreenDimension } from 'helpers';

import {
    BRICK_IMAGE,
    CELL_SIZE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import {
    Arena,
    IArena,
} from 'models/Arena';
import { CellType, ICell } from 'models/Cell';
import { menu } from '../menu/Container';

class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private gameData: IArena;
    private imageMap: Map<string, HTMLImageElement> = new Map();

    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.gameData = new Arena();

        this.setSize();
        this.prepareScene();

        this.downloadTextures()
        .then(() => {
            this.renderScene();
            this.prepareLevelDesigner();
        });

        menu.setExportAction(this.getGameData);

        // menu.setImportAction(this.setGameData);
    }

    public getGameData = (): ICell[][] => this.gameData.exportArenaData();
    public setGameData = (matrix: ICell[][]): void => {
        this.gameData.importArenaData(matrix);
        this.renderScene();
    }

    public getCanvas = () => this.canvas;

    private setSize = () => {
        const { width, height } = getScreenDimension();
        const size = width > height ? height : width;
        this.canvas.width = size;
        this.canvas.height = size;
    }

    private clearScene = () => {
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private prepareScene = () => {
        this.clearScene();
        this.gameData = new Arena();
    }

    private renderScene = () => {
        for (let i = 0; i < this.gameData.size; i++) {
            for (let j = 0; j < this.gameData.size; j++) {
                const cell = this.gameData.matrix[i][j];
                this.context!.drawImage(
                    this.imageMap.get(CellType.EMPTY)!,
                    cell.position.x,
                    cell.position.y,
                    cell.size,
                    cell.size,
                );
            }
        }
    }

    private getCellImage = (cellType: CellType): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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
        }

        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
    })

    private prepareLevelDesigner = () => {
        let moving = false;
        this.canvas.addEventListener('mousedown', () => moving = true);
        this.canvas.addEventListener('mouseup', () => moving = false);
        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if (!moving) {
                return;
            }
            const x = event.offsetX;
            const y = event.offsetY;

            const cellColumn = Math.floor(x / CELL_SIZE);
            const cellRow = Math.floor(y / CELL_SIZE);

            const cell = this.gameData.matrix[cellColumn][cellRow];
            cell.type = menu.getSelectedCellType();
            this.context!.drawImage(
                this.imageMap.get(cell.type)!,
                cell.position.x,
                cell.position.y,
                cell.size,
                cell.size,
            );
        });
    }

    private downloadTextures = async (): Promise<void> => {
        const imagePromises = [
            this.getCellImage(CellType.BRICK),
            this.getCellImage(CellType.GRASS),
            this.getCellImage(CellType.STEEL),
            this.getCellImage(CellType.WATER),
            this.getCellImage(CellType.EAGLE),
            this.getCellImage(CellType.EMPTY),
        ];
        const [
            brickImage,
            grassImage,
            steelImage,
            waterImage,
            eagleImage,
            emptyImage,
        ] = await Promise.all(imagePromises);
        this.imageMap.set(CellType.BRICK, brickImage);
        this.imageMap.set(CellType.GRASS, grassImage);
        this.imageMap.set(CellType.STEEL, steelImage);
        this.imageMap.set(CellType.WATER, waterImage);
        this.imageMap.set(CellType.EAGLE, eagleImage);
        this.imageMap.set(CellType.EMPTY, emptyImage);
    }
}

export const canvas = new Canvas();
