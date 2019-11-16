/// <reference path='global/global.d.ts' />

import { canvas as levelDesignerCanvas } from 'containers/levelDesigner/canvas/Container';
import { menu as levelDesignerMenu } from 'containers/levelDesigner/menu/Container';
import { INVALID_CONTAINER_ID } from 'global/errors';

const renderLevelDesigner = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    container.appendChild(levelDesignerCanvas.getCanvas());
    container.appendChild(levelDesignerMenu.getContainer());
};

const renderSinglePlayerGame = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }
};

const startApp = () => {
    __MODULE__ === 'LEVEL_DESIGNER'
    ? renderLevelDesigner(
        document.getElementById('app'),
    )
    : renderSinglePlayerGame(
        document.getElementById('app'),
    );
};

startApp();
