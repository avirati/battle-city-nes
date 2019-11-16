import { CanvasBase } from 'containers/base/canvas/Container';
import { Cell, CellType, ICell } from 'models/Cell';

import { menu } from '../menu/Container';

class Canvas extends CanvasBase {
    constructor() {
        super();

        this.downloadTextures()
        .then(() => {
            this.renderScene();
        });

        menu.setImportAction((cellInformation: ICell[][]) => {
            const gameData: ICell[][] = [];
            for (let i = 0; i < cellInformation.length; i++) {
                gameData[i] = [];
                for (let j = 0; j < cellInformation.length; j++) {
                    const cell = cellInformation[i][j];
                    gameData[i][j] = new Cell(cell.type, cell.position.x, cell.position.y);
                }
            }
            this.setGameData(gameData);
        });
    }

    private downloadTextures = async (): Promise<void> => {
        const imagePromises = [
            this.getCellImage(CellType.BRICK),
            this.getCellImage(CellType.GRASS),
            this.getCellImage(CellType.STEEL),
            this.getCellImage(CellType.WATER),
            this.getCellImage(CellType.EAGLE),
            this.getCellImage(CellType.EMPTY_BLACK),
        ];
        const [
            brickImage,
            grassImage,
            steelImage,
            waterImage,
            eagleImage,
            emptyImage,
        ] = await Promise.all(imagePromises);
        this.getImageMap().set(CellType.BRICK, brickImage);
        this.getImageMap().set(CellType.GRASS, grassImage);
        this.getImageMap().set(CellType.STEEL, steelImage);
        this.getImageMap().set(CellType.WATER, waterImage);
        this.getImageMap().set(CellType.EAGLE, eagleImage);
        this.getImageMap().set(CellType.EMPTY, emptyImage);
    }
}

export const canvas = new Canvas();
