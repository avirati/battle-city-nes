import { Cell, ICell } from 'containers/Arena/models/Cell';
import { loadArenaMap } from 'containers/Arena/state/actions';
import { dispatch } from 'state/store';

class Menu {
    private importButton: HTMLInputElement;

    private container: HTMLDivElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'menu';

        this.importButton = document.createElement('input');
        this.importButton.type = 'file';
        this.importButton.className = 'custom-btn';

        this.attachToParent();
        this.listenOnMapImport();
    }

    public getContainer = () => this.container;

    private listenOnMapImport = () => {
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
                    const gameData: ICell[][] = [];
                    for (let i = 0; i < parsedGameData.length; i++) {
                        gameData[i] = [];
                        for (let j = 0; j < parsedGameData.length; j++) {
                            const cell = parsedGameData[i][j];
                            gameData[i][j] = new Cell(cell.type, cell.position.x, cell.position.y, i, j);
                        }
                    }
                    dispatch(loadArenaMap(gameData));
                } catch (error) {
                    console.error('Invalid Game Data', error);
                }
            };
            // Read in the image file as a data URL.
            reader.readAsText(file);
        });
    }

    private attachToParent = () => {
        this.container.appendChild(this.importButton);
    }
}

export const menu = new Menu();
