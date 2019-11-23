/// <reference path='global/global.d.ts' />
/// <reference path='typedefs/gamecontroller.d.ts' />

import { getArenaCanvas, initArenaView, initLevelDesigner } from 'containers/Arena/service';
import { fillArenaWith } from 'containers/Arena/state/actions';
import { addSupportForGamepadIfAvailable } from 'containers/Gamepad/service';
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
    initLevelDesigner();
};

const renderSinglePlayerGame = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    store.dispatch(fillArenaWith(CellType.EMPTY));

    container.appendChild(getArenaCanvas());
    initArenaView();

    container.appendChild(getTankViewCanvas());
    initTankView();

    addSupportForGamepadIfAvailable();
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
