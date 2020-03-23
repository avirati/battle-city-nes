import {
    delay,
    select,
    takeEvery,
    throttle,
} from 'redux-saga/effects';

import { registerImpactFromShell } from 'containers/Arena/state/actions';
import {
    SHELL_FPS,
    SHELL_SIZE,
} from 'global/constants';
import { dispatch } from 'state/store';

import {
    getShellSprite,
    isCollidingWithWorld,
    isWithinTheWorld,
    renderTank,
} from '../helpers';
import { getTankViewContext } from '../service';
import {
    destroyShells,
    fireTank,
    moveShell,
    moveTank,
    spawnTank,
    ActionTypes,
} from './actions';
import { ITanksState } from './interfaces';
import { shellsSelector, tanksSelector } from './selectors';

const shellRenderRegistry: { [shellID: string]: NodeJS.Timeout } = {};

function * watchForSpawnTank() {
    yield takeEvery(ActionTypes.TANK_SPAWN, spawnTankSaga);
}

function * spawnTankSaga(action: ReturnType<typeof spawnTank>) {
    const { ID } = action.data!;
    const context = getTankViewContext();
    const tanks: ITanksState['vehicles'] = yield select(tanksSelector);
    const tank = tanks[ID];

    if (!tank) {
        return;
    }

    renderTank(context!, tank);
}

function * watchForMoveTank() {
    yield throttle(100, ActionTypes.TANK_MOVE, moveTankSaga);
}

function * moveTankSaga(action: ReturnType<typeof moveTank>) {
    const { ID } = action.data!;
    const context = getTankViewContext();

    for (let i = 0; i < 60; i++) {
        const tanks: ITanksState['vehicles'] = yield select(tanksSelector);
        const tank = tanks[ID];

        if (!tank) {
            break;
        }

        renderTank(context!, tank);
        yield delay(100 / 60);
    }
}

function * watchForFireTank() {
    yield takeEvery(ActionTypes.TANK_FIRE, fireTankSaga);
}

function * fireTankSaga(action: ReturnType<typeof fireTank>) {
    const { shellID, tankID } = action.data!;

    const shellRenderInterval = Math.round(1000 / SHELL_FPS);
    const intervalID = setInterval(() => {
        dispatch(moveShell(shellID));
    }, shellRenderInterval);
    shellRenderRegistry[shellID] = intervalID;

    const context = getTankViewContext();

    let tanks: ITanksState['vehicles'] = yield select(tanksSelector);
    let tank = tanks[tankID];

    if (!tank.moving) {
        for (let i = 0; i < SHELL_FPS; i++) {
            tanks = yield select(tanksSelector);
            tank = tanks[tankID];
            renderTank(context!, tank);
            yield delay(1);
        }
    }
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

        context!.clearRect(
            shell.lastPosition.x,
            shell.lastPosition.y,
            SHELL_SIZE,
            SHELL_SIZE,
        );
    } else {
        context!.clearRect(shell.position.x, shell.position.y, SHELL_SIZE, SHELL_SIZE);
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
    watchForSpawnTank,
    watchForMoveTank,
    watchForFireTank,
    watchForMoveShell,
    watchForDestroyShells,
];
