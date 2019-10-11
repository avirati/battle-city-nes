import { getScreenDimension } from 'helpers';

import {
    Arena,
    IArena,
} from 'models/Arena';

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
        for (let i = 0; i < this.gameData.size; i++) {
            for (let j = 0; j < this.gameData.size; j++) {
                const cell = this.gameData.matrix[i][j];
                this.context!.fillStyle = '#000000';
                this.context!.strokeRect(
                    cell.position.x,
                    cell.position.y,
                    cell.size,
                    cell.size,
                );
            }
        }
    }
}
