import {
    put,
    takeLatest,
} from 'redux-saga/effects';
import { v1 as uuid } from 'uuid';

import { spawnTank } from 'containers/Tanks/state/actions';
import { TankDirection, TankType } from 'containers/Tanks/state/interfaces';
import { TANK_SPAWN_POSITION } from 'global/constants';

import { ActionTypes } from './actions';

function * watchForStartGame() {
    yield takeLatest(ActionTypes.START_GAME, startGame);
}

function * startGame() {
    yield put(spawnTank({
        ID: uuid(),
        direction: TankDirection.FORWARD,
        position: TANK_SPAWN_POSITION.BOTTOM_LEFT,
        type: TankType.PLAYER,
    }));
}

export const sagas = [
    watchForStartGame,
];
