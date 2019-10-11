import { getScreenDimension } from 'helpers';

import { BRICK_IMAGE } from 'global/constants';
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
        const imagePromise = this.getCellImage(CellType.BRICK);
        imagePromise
        .then((brickImage) => {
            for (let i = 0; i < this.gameData.size; i++) {
                for (let j = 0; j < this.gameData.size; j++) {
                    const cell = this.gameData.matrix[i][j];
                    this.context!.drawImage(brickImage, cell.position.x, cell.position.y, cell.size, cell.size);
                }
            }
        });
    }

    private getCellImage = (cellType: CellType): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const image = new Image();
        switch (cellType) {
            case CellType.BRICK:
                image.src = BRICK_IMAGE;
        }

        image.onload = () => resolve(image);
    })
}
