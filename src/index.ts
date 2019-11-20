/// <reference path='global/global.d.ts' />

import { generateEmptyArena } from 'containers/Arena/state/actions';
// import { canvas as gameMechanicsCanvas } from 'containers/gameMechanics/canvas/Container';
// import { canvas as levelDesignerCanvas } from 'containers/levelDesigner/canvas/Container';
// import { menu as levelDesignerMenu } from 'containers/levelDesigner/menu/Container';
// import { canvas as singlePlayerCanvas } from 'containers/singlePlayer/canvas/Container';
// import { menu as singlePlayerMenu } from 'containers/singlePlayer/menu/Container';
import { INVALID_CONTAINER_ID } from 'global/errors';
import { store } from 'state/store';
import { getSinglePlayerViewCanvas, initSinglePlayerView } from './containers/Arena/service';
import { getTankViewCanvas, initTankView } from './containers/Tanks/service';

// const renderLevelDesigner = (container: HTMLElement | null) => {
//     if (!container) {
//         throw new Error(INVALID_CONTAINER_ID);
//     }

//     container.appendChild(levelDesignerCanvas.getCanvas());
//     container.appendChild(levelDesignerMenu.getContainer());
// };

const renderSinglePlayerGame = (container: HTMLElement | null) => {
    if (!container) {
        throw new Error(INVALID_CONTAINER_ID);
    }

    store.dispatch(generateEmptyArena());

    container.appendChild(getSinglePlayerViewCanvas());
    initSinglePlayerView();

    container.appendChild(getTankViewCanvas());
    initTankView();
    // container.appendChild(singlePlayerCanvas.getCanvas());
    // container.appendChild(gameMechanicsCanvas.getCanvas());
    // container.appendChild(singlePlayerMenu.getContainer());
};

const startApp = () => {
    // __MODULE__ === 'LEVEL_DESIGNER'
    // ? renderLevelDesigner(
    //     document.getElementById('app'),
    // )
    // : renderSinglePlayerGame(
    //     document.getElementById('app'),
    // );

    renderSinglePlayerGame(
        document.getElementById('app'),
    );
};

startApp();
