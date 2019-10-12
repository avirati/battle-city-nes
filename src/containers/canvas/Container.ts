import { getScreenDimension } from 'helpers';

import {
    BRICK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import {
    Arena,
    IArena,
} from 'models/Arena';
import { CellType } from 'models/Cell';

export class Canvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private gameData: IArena;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.gameData = new Arena();

        this.setSize();
        this.prepareScene();
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
        const imagePromises = [
            this.getCellImage(CellType.BRICK),
            this.getCellImage(CellType.GRASS),
            this.getCellImage(CellType.STEEL),
            this.getCellImage(CellType.WATER),
            this.getCellImage(CellType.EAGLE),
            this.getCellImage(CellType.EMPTY),
        ];
        Promise.all(imagePromises)
        .then(([brickImage, grassImage, steelImage, waterImage, eagleImage, emptyImage]) => {
            const imageMap = {
                [CellType.BRICK]: brickImage,
                [CellType.GRASS]: grassImage,
                [CellType.STEEL]: steelImage,
                [CellType.WATER]: waterImage,
                [CellType.EAGLE]: eagleImage,
                [CellType.EMPTY]: emptyImage,
            };
            for (let i = 0; i < this.gameData.size; i++) {
                for (let j = 0; j < this.gameData.size; j++) {
                    const cell = this.gameData.matrix[i][j];
                    this.context!.drawImage(imageMap[CellType.EMPTY], cell.position.x, cell.position.y, cell.size, cell.size);
                }
            }
        });
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
}
