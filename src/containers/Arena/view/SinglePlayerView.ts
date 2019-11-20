import { IArena } from 'containers/Arena/models/Arena';
import { CellType } from 'containers/Arena/models/Cell';
import {
    BRICK_IMAGE,
    EMPTY_BLACK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import { getScreenDimension } from 'helpers';

export class BaseView {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private imageMap: Map<string, HTMLImageElement> = new Map();

    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.setSize();
        this.clearScene();
    }

    public getCanvas = () => this.canvas;
    public getContext = () => this.context;
    public getImageMap = () => this.imageMap;

    protected renderScene = (arena: IArena) => {
        for (let i = 0; i < arena.size; i++) {
            for (let j = 0; j < arena.size; j++) {
                const cell = arena.matrix[i][j];
                this.context!.drawImage(
                    this.imageMap.get(cell.type)!,
                    cell.position.x,
                    cell.position.y,
                    cell.size,
                    cell.size,
                );
            }
        }
    }

    protected getCellImage = (cellType: CellType): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
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
    })

    private setSize = () => {
        const { width, height } = getScreenDimension();
        const size = width > height ? height : width;
        this.canvas.width = size;
        this.canvas.height = size;
    }

    private clearScene = () => {
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
