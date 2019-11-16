/// <reference path='global/global.d.ts' />

import { canvas } from 'containers/canvas/Container';
import { menu } from 'containers/menu/Container';
import { INVALID_CONTAINER_ID } from 'global/errors';

const renderLevelDesigner = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    container.appendChild(canvas.getCanvas());
    container.appendChild(menu.getContainer());
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
