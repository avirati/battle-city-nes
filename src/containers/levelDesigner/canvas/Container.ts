import { CellType, ICell } from 'containers/Arena/models/Cell';
import { CanvasBase } from 'containers/base/canvas/Container';
import {
    CELL_SIZE,
} from 'global/constants';

import { menu } from '../menu/Container';

class Canvas extends CanvasBase {

    constructor() {
        super();

        this.downloadTextures()
        .then(() => {
            this.renderScene();
            this.prepareLevelDesigner();
        });

        menu.setExportAction(this.getGameData);
        menu.setImportAction((gameData: ICell[][]) => {
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
        this.getImageMap().set(CellType.BRICK, brickImage);
        this.getImageMap().set(CellType.GRASS, grassImage);
        this.getImageMap().set(CellType.STEEL, steelImage);
        this.getImageMap().set(CellType.WATER, waterImage);
        this.getImageMap().set(CellType.EAGLE, eagleImage);
        this.getImageMap().set(CellType.EMPTY, emptyImage);
    }

    private prepareLevelDesigner = () => {
        let moving = false;
        this.getCanvas().addEventListener('mousedown', () => moving = true);
        this.getCanvas().addEventListener('mouseup', () => moving = false);
        this.getCanvas().addEventListener('mousemove', (event: MouseEvent) => {
            if (!moving) {
                return;
            }
            const x = event.offsetX;
            const y = event.offsetY;

            const cellColumn = Math.floor(x / CELL_SIZE);
            const cellRow = Math.floor(y / CELL_SIZE);

            const cell = this.getArena().matrix[cellColumn][cellRow];
            cell.type = menu.getSelectedCellType();
            this.getContext()!.drawImage(
                this.getImageMap().get(cell.type)!,
                cell.position.x,
                cell.position.y,
                cell.size,
                cell.size,
            );
        });
    }
}

export const canvas = new Canvas();
