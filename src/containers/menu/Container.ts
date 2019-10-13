import {
    BRICK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import { CellType } from 'models/Cell';

class Menu {
    private brickCreatorButton: HTMLImageElement;
    private waterCreatorButton: HTMLImageElement;
    private steelCreatorButton: HTMLImageElement;
    private grassCreatorButton: HTMLImageElement;
    private emptyCreatorButton: HTMLImageElement;

    private container: HTMLDivElement;

    private selectedCellType: CellType = CellType.EMPTY;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'menu';

        this.brickCreatorButton = document.createElement('img');
        this.brickCreatorButton.src = BRICK_IMAGE;
        this.brickCreatorButton.setAttribute('data-image-type', CellType.BRICK);

        this.waterCreatorButton = document.createElement('img');
        this.waterCreatorButton.src = WATER_IMAGE;
        this.waterCreatorButton.setAttribute('data-image-type', CellType.WATER);

        this.steelCreatorButton = document.createElement('img');
        this.steelCreatorButton.src = STEEL_IMAGE;
        this.steelCreatorButton.setAttribute('data-image-type', CellType.STEEL);

        this.grassCreatorButton = document.createElement('img');
        this.grassCreatorButton.src = GRASS_IMAGE;
        this.grassCreatorButton.setAttribute('data-image-type', CellType.GRASS);

        this.emptyCreatorButton = document.createElement('img');
        this.emptyCreatorButton.src = EMPTY_IMAGE;
        this.emptyCreatorButton.setAttribute('data-image-type', CellType.EMPTY);

        this.attachToParent();
        this.attachEventListeners();
    }

    public getSelectedCellType = () => this.selectedCellType;
    public getContainer = () => this.container;

    private attachToParent = () => {
        this.container.appendChild(this.brickCreatorButton);
        this.container.appendChild(this.waterCreatorButton);
        this.container.appendChild(this.steelCreatorButton);
        this.container.appendChild(this.grassCreatorButton);
        this.container.appendChild(this.emptyCreatorButton);
    }

    private attachEventListeners = () => {
        this.container.addEventListener('click', (event: MouseEvent) => {
            const target: HTMLImageElement = event.target as HTMLImageElement;
            const imageType: CellType = target.getAttribute('data-image-type') as CellType;
            this.selectedCellType = imageType;
        });
    }
}

export const menu = new Menu();
