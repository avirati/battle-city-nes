import { ICell } from 'models/Cell';

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
    }

    public getContainer = () => this.container;

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
        this.container.appendChild(this.importButton);
    }
}

export const menu = new Menu();
