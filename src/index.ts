/// <reference path='global/global.d.ts' />

import { getArenaCanvas, initArenaView } from 'containers/Arena/service';
import { fillArenaWith } from 'containers/Arena/state/actions';
import { getTankViewCanvas, initTankView } from 'containers/Tanks/service';
import { INVALID_CONTAINER_ID } from 'global/errors';
import { CellType } from 'models/Cell';
import { store } from 'state/store';


const renderLevelDesigner = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    store.dispatch(fillArenaWith(CellType.EMPTY));

    container.appendChild(getArenaCanvas());
    initArenaView();

    // container.appendChild(levelDesignerCanvas.getCanvas());
    // container.appendChild(levelDesignerMenu.getContainer());
};

const renderSinglePlayerGame = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    store.dispatch(fillArenaWith(CellType.EMPTY_BLACK));

    container.appendChild(getArenaCanvas());
    initArenaView();

    container.appendChild(getTankViewCanvas());
    initTankView();
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
