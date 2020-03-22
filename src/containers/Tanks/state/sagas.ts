import {
    select,
    takeEvery,
} from 'redux-saga/effects';

import {
    SHELL_FPS,
    SHELL_SIZE,
    TANK_SIZE,
} from 'global/constants';
import { dispatch } from 'state/store';

import { registerImpactFromShell } from 'src/containers/Arena/state/actions';
import { getShellSprite, getTankSprite, isCollidingWithWorld, isWithinTheWorld } from '../helpers';
import { getTankViewContext } from '../service';
import {
    destroyShells,
    fireTank,
    moveShell,
    moveTank,
    ActionTypes,
} from './actions';
import { ITanksState } from './interfaces';
import { shellsSelector, tanksSelector } from './selectors';

const shellRenderRegistry: { [shellID: string]: NodeJS.Timeout } = {};

function * watchForMoveTank() {
    yield takeEvery(ActionTypes.TANK_MOVE, moveTankSaga);
}

function * moveTankSaga(action: ReturnType<typeof moveTank>) {
    const { ID } = action.data!;
    const context = getTankViewContext();
    const tanks: ITanksState['vehicles'] = yield select(tanksSelector);
    const tank = tanks[ID];

    context!.clearRect(
        tank.lastPosition.x,
        tank.lastPosition.y,
        TANK_SIZE,
        TANK_SIZE,
    );

    context!.drawImage(
        getTankSprite(tank.type, tank.direction)!,
        tank.position.x,
        tank.position.y,
        TANK_SIZE,
        TANK_SIZE,
    );

    if (__DEV__) {
        context!.strokeStyle = '#FFFFFF';
        context!.lineWidth = 2;
        context!.strokeRect(tank.position.x, tank.position.y, TANK_SIZE, TANK_SIZE);
    }
}

function * watchForFireTank() {
    yield takeEvery(ActionTypes.TANK_FIRE, fireTankSaga);
}

function * fireTankSaga(action: ReturnType<typeof fireTank>) {
    const { shellID } = action.data!;

    const shellRenderInterval = Math.round(1000 / SHELL_FPS);
    const intervalID = setInterval(() => {
        dispatch(moveShell(shellID));
    }, shellRenderInterval);
    shellRenderRegistry[shellID] = intervalID;
}

function * watchForMoveShell() {
    yield takeEvery(ActionTypes.SHELL_MOVE, moveShellSaga);
}

function * moveShellSaga(action: ReturnType<typeof moveShell>) {
    const { ID } = action.data!;
    const shells: ITanksState['shells'] = yield select(shellsSelector);
    const shell = shells[ID];
    const shellsToDestroy: string[] = [];
    const context = getTankViewContext();

    const didImpact = isCollidingWithWorld(shell);
    if (!isWithinTheWorld(shell, SHELL_SIZE) || didImpact) {
        shellsToDestroy.push(ID);
        dispatch(registerImpactFromShell(shell));
    } else {
        context!.clearRect(shell.position.x, shell.position.y, SHELL_SIZE, SHELL_SIZE);
        dispatch(moveShell(shell.ID));
        context!.clearRect(
            shell.lastPosition.x,
            shell.lastPosition.y,
            SHELL_SIZE,
            SHELL_SIZE,
        );
        context!.drawImage(
            getShellSprite(shell.direction)!,
            shell.position.x,
            shell.position.y,
            SHELL_SIZE,
            SHELL_SIZE,
        );
    }

    if (shellsToDestroy.length > 0) {
        dispatch(destroyShells(shellsToDestroy));
    }
}

function * watchForDestroyShells() {
    yield takeEvery(ActionTypes.SHELL_DESTROY, destroyShellsSaga);
}

function * destroyShellsSaga(action: ReturnType<typeof destroyShells>) {
    const { IDs } = action.data!;

    for (const ID of IDs) {
        clearInterval(shellRenderRegistry[ID]);
    }
}

export const sagas = [
    watchForMoveTank,
    watchForFireTank,
    watchForMoveShell,
    watchForDestroyShells,
];
