import {
    BRICK_IMAGE,
    EMPTY_IMAGE,
    GRASS_IMAGE,
    STEEL_IMAGE,
    WATER_IMAGE,
} from 'global/constants';
import { CellType, ICell } from 'models/Cell';

class Menu {
    private brickCreatorButton: HTMLImageElement;
    private waterCreatorButton: HTMLImageElement;
    private steelCreatorButton: HTMLImageElement;
    private grassCreatorButton: HTMLImageElement;
    private emptyCreatorButton: HTMLImageElement;

    private exportButton: HTMLButtonElement;
    private importButton: HTMLInputElement;

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

        this.exportButton = document.createElement('button');
        this.exportButton.className = 'custom-btn';
        this.exportButton.innerText = 'Export Level';

        this.importButton = document.createElement('input');
        this.importButton.type = 'file';
        this.importButton.className = 'custom-btn';

        this.attachToParent();
        this.attachEventListeners();
    }

    public getSelectedCellType = () => this.selectedCellType;
    public getContainer = () => this.container;

    public setExportAction = (callback: () => ICell[][]) => {
        this.exportButton.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();
            const data = callback();
            const serialisedGameData = JSON.stringify(data);

            const link = document.createElement('a');
            link.download = 'game.json';
            const blob = new Blob([serialisedGameData], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });
    }

    public setImportAction = (callback: (gameData: ICell[][]) => void) => {
        this.importButton.addEventListener('change', (event: any) => { // No type def present https://github.com/microsoft/TypeScript/issues/31816
            event.stopPropagation();
            const file: File = event.target.files[0];

            if (file.type !== 'application/json') {
                return;
            }

            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                const serialisedGameData = event.target!.result;
                try {
                    const parsedGameData: ICell[][] = JSON.parse(serialisedGameData as string);
                    callback(parsedGameData);
                } catch (error) {
                    console.error('Invalid Game Data', error);
                }
            };
            // Read in the image file as a data URL.
            reader.readAsText(file);
        });
    }

    private attachToParent = () => {
        this.container.appendChild(this.brickCreatorButton);
        this.container.appendChild(this.waterCreatorButton);
        this.container.appendChild(this.steelCreatorButton);
        this.container.appendChild(this.grassCreatorButton);
        this.container.appendChild(this.emptyCreatorButton);

        this.container.appendChild(this.exportButton);
        this.container.appendChild(this.importButton);
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
