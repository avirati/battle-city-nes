import { CellType } from 'containers/Arena/models/Cell';
import { Shell } from 'containers/Arena/models/Shell';
import { CanvasBase } from 'containers/base/canvas/Container';

class Canvas extends CanvasBase {
    constructor() {
        super();

        this.downloadTextures()
        .then(() => {
            this.renderScene();
        });
    }

    public registerImpactFrom = (shell: Shell) => {
        this.getArena().registerCellDestructionFrom(shell);
        this.renderScene();
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
            emptyImageBlack,
        ] = await Promise.all(imagePromises);
        this.getImageMap().set(CellType.BRICK, brickImage);
        this.getImageMap().set(CellType.GRASS, grassImage);
        this.getImageMap().set(CellType.STEEL, steelImage);
        this.getImageMap().set(CellType.WATER, waterImage);
        this.getImageMap().set(CellType.EAGLE, eagleImage);
        this.getImageMap().set(CellType.EMPTY, emptyImageBlack);
        this.getImageMap().set(CellType.EMPTY_BLACK, emptyImageBlack);
    }
}

export const canvas = new Canvas();
